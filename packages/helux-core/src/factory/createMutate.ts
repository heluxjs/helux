import { FROM, SINGLE_MUTATE } from '../consts';
import { getInternal } from '../helpers/state';
import type {
  ActionReturn,
  Dict,
  IMutateFnLooseItem,
  IMutateWitness,
  IRunMutateOptions,
  MutateFn,
  MutateFnDict,
  SharedState,
} from '../types/base';
import { checkShared, checkSharedStrict } from './common/check';
import type { TInternal } from './creator/buildInternal';
import { callAsyncMutateFnLogic, callMutateFnLogic, watchAndCallMutateDict } from './creator/mutateFn';
import { parseCreateMutateOpt, parseMutate, parseMutateFn } from './creator/parse';

interface ILogicOptions {
  label: string;
  descOrOptions?: string | IRunMutateOptions;
  forTask?: boolean;
}

const toMutateRet = (ret: ActionReturn) => [ret.snap, ret.err] as [any, Error | null];

/**
 * 查找到配置到 mutate 函数并执行
 */
function runMutateFnItem<T = SharedState>(options: { target: T; desc?: string; forTask?: boolean }) {
  const { target, desc: inputDesc = '', forTask = false } = options;
  const { mutateFnDict, snap } = getInternal(target);
  const desc = inputDesc || SINGLE_MUTATE; // 未传递任何描述，尝试调用可能存在的单函数

  const item = mutateFnDict[desc];
  if (!item) return { snap, err: new Error(`mutate fn ${desc} not defined`), result: null };
  // 指定了 task 但未配置 task，返回最近一次修改结果的快照
  if (forTask && !item.task) return { snap, err: new Error(`mutate task ${desc} not defined`), result: null };

  const baseOpts = { sn: 0, fnItem: item, from: FROM.MUTATE };
  // 调用 desc 对应的函数
  if (forTask) {
    return callAsyncMutateFnLogic(target, baseOpts);
  }
  return callMutateFnLogic(target, baseOpts);
}

function makeWitness(target: SharedState, desc: string, oriDesc: string, internal: TInternal) {
  return {
    run: () => {
      // 呼叫同步函数的句柄
      const ret = runMutateFnItem({ target, desc }) as ActionReturn;
      return toMutateRet(ret);
    },
    // 呼叫异步函数的句柄
    runTask: () => Promise.resolve(runMutateFnItem({ target, desc, forTask: true })).then(toMutateRet),
    desc,
    oriDesc,
    getSnap: () => internal.snap,
    snap: internal.snap,
    /** for initLoadingCtx */
    __sharedKey: internal.sharedKey,
  };
}

interface IConfigureMutateFnOptBase {
  target: SharedState;
  forAtom?: boolean;
  label: string;
}

interface IConfigureMutateFnOpt extends IConfigureMutateFnOptBase {
  fnItem: IMutateFnLooseItem | MutateFn;
}

interface IConfigureMutateDictOpt extends IConfigureMutateFnOptBase {
  fnDict: any; // 刻意擦除类型，适配 atomMutateDict 逻辑
}

/**
 * 创建一个外部执行的 mutate 函数（ 即不定义在生成 share 或 atom 时的 options 参数里，生成后再定义 mutate 函数 ）
 */
function configureMutateFn(options: IConfigureMutateFnOpt) {
  const { target, fnItem, label } = options;
  const internal = checkSharedStrict(target, { label });
  const stdFnItem = parseMutateFn(fnItem, '', internal.mutateFnDict);
  if (!stdFnItem) {
    throw new Error('not a fn or fnItem { fn }');
  }
  internal.mutateFnDict[stdFnItem.desc] = stdFnItem;
  const dict = { [stdFnItem.desc]: stdFnItem };
  watchAndCallMutateDict({ target, dict });
  return makeWitness(target, stdFnItem.desc, stdFnItem.oriDesc, internal);
}

/**IMutateWitness
 * 配置 mutate 字典，暂返回 any，具体约束见 types-api multiDict
 */
function configureMutateDict(options: IConfigureMutateDictOpt): any {
  const { target, fnDict, label } = options;
  const internal = checkSharedStrict(target, { label });
  const dict = parseMutate(fnDict, internal.mutateFnDict); // trust dict here
  watchAndCallMutateDict({ target, dict });
  const witnessDict: Dict<IMutateWitness> = {}; // 具体类型定义见 types-api multiDict
  Object.keys(dict).forEach((desc) => {
    witnessDict[desc] = makeWitness(target, desc, desc, internal);
  });
  return witnessDict;
}

/**
 * 对 runMutate runMutateTask 入参做分析，确认是否能执行内部 mutate 逻辑
 */
function prepareParms<T extends SharedState>(target: T, options: ILogicOptions) {
  const { label, descOrOptions, forTask = false } = options;
  const { desc, strict } = parseCreateMutateOpt(descOrOptions);
  if (!desc) {
    return { ok: false, desc, forTask, err: new Error('miss desc') };
  }
  const internal = checkShared(target, { label, strict });
  if (!internal) {
    return { ok: false, desc, forTask, err: new Error('not a valid atom or shared result') };
  }
  return { ok: true, desc, forTask, err: null };
}

/**
 * 执行匹配 desc 的 mutate 函数
 */
export function runMutateLogic<T extends SharedState>(target: T, options: ILogicOptions): [T, Error | null] | Promise<[T, Error | null]> {
  const { ok, desc, forTask, err } = prepareParms(target, options);
  if (!ok) {
    return forTask ? Promise.resolve([target, err]) : [target, err];
  }
  const result = runMutateFnItem({ target, desc, forTask });
  return forTask ? Promise.resolve(result).then(toMutateRet) : toMutateRet(result as ActionReturn);
}

/**
 * 执行匹配 desc 的 mutate 函数
 */
export function runMutate<T extends SharedState>(target: T, descOrOptions?: string | IRunMutateOptions) {
  return runMutateLogic(target, { descOrOptions, label: 'runMutate' });
}

/**
 * 执行匹配 desc 的 mutate task 函数（存在才执行）
 */
export function runMutateTask<T extends SharedState>(target: T, descOrOptions?: string | IRunMutateOptions) {
  return runMutateLogic(target, { descOrOptions, label: 'runMutateTask', forTask: true }) as Promise<[T, Error | null]>;
}

/**
 * 为 atom 或 share 创建一个 mutate 函数，如需创建异步计算结果，配置 task 即可
 * 更详细的泛型定义见 types-api.d.ts
 */
export function mutate(target: SharedState) {
  return (fnItem: IMutateFnLooseItem<any, any> | MutateFn<any, any>) => configureMutateFn({ target, fnItem, label: 'mutate' });
}

/**
 * 为 atom 或 share 创建多个 mutate 函数，接收一个字典配置来完成多函数配置，更详细的泛型定义见 types-api.d.ts
 */
export function mutateDict<T extends SharedState>(target: T) {
  return <D = MutateFnDict<T>>(fnDict: D) => configureMutateDict({ target, fnDict, label: 'mutateDict' });
}
