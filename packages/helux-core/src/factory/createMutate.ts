import { FROM, SINGLE_MUTATE } from '../consts';
import { delFnDep } from '../helpers/fnDep';
import { getBoundStateInfo, getInternal } from '../helpers/state';
import type {
  ActionReturn,
  Dict,
  IMutateFnItem,
  IMutateFnLooseItem,
  IMutateWitness,
  IRunMutateOptions,
  MutateFn,
  MutateFnDict,
  SharedState,
} from '../types/base';
import { checkShared, checkSharedStrict } from './common/check';
import { ensureBool } from './common/util';
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
function runMutateFnItem<T = SharedState>(options: { target: T; desc?: string; forTask?: boolean; throwErr?: boolean; extraArgs?: any }) {
  const { target, desc: inputDesc = '', forTask = false, throwErr, extraArgs } = options;
  const { mutateFnDict, snap } = getInternal(target);
  const desc = inputDesc || SINGLE_MUTATE; // 未传递任何描述，尝试调用可能存在的单函数

  const item = mutateFnDict[desc];
  if (!item) return { snap, err: new Error(`mutate fn ${desc} not defined`), result: null };
  // 指定了 task 但未配置 task，返回最近一次修改结果的快照
  if (forTask && !item.task) return { snap, err: new Error(`mutate task ${desc} not defined`), result: null };

  // throwErr 谨慎处理，只严格接受布尔值
  const throwErrVar = ensureBool(throwErr, false);
  const baseOpts = { sn: 0, fnItem: item, from: FROM.MUTATE, throwErr: throwErrVar, extraArgs };
  // 调用 desc 对应的函数
  if (forTask) {
    return callAsyncMutateFnLogic(target, baseOpts);
  }
  return callMutateFnLogic(target, baseOpts);
}

function makeWitness(target: SharedState, options: { desc: string; oriDesc: string; internal: TInternal; watchFnCtx: any }) {
  const { desc, oriDesc, internal, watchFnCtx } = options;
  return {
    run: (throwErr?: boolean) => {
      // 呼叫同步函数的句柄
      const ret = runMutateFnItem({ target, desc, throwErr }) as ActionReturn;
      return toMutateRet(ret);
    },
    // 呼叫异步函数的句柄
    runTask: (throwErr?: boolean) => Promise.resolve(runMutateFnItem({ target, desc, forTask: true, throwErr })).then(toMutateRet),
    cancel: () => {
      // unwatch
      delFnDep(watchFnCtx);
      // TODO optimize: shuold I use Relect.deleteProperty
      delete internal.mutateFnDict[desc];
    },
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
  label: string;
  forAtom?: boolean;
  extraTarget?: SharedState;
}

interface IConfigureMutateFnOpt extends IConfigureMutateFnOptBase {
  fnItem: IMutateFnLooseItem | MutateFn;
}

interface IConfigureMutateDictOpt extends IConfigureMutateFnOptBase {
  fnDict: any; // 刻意擦除类型，适配 mutateDict 逻辑
}

/**
 * 创建一个外部执行的 mutate 函数（ 即不定义在生成 share 或 atom 时的 options 参数里，生成后再定义 mutate 函数 ）
 */
function configureMutateFn(options: IConfigureMutateFnOpt) {
  const { target, fnItem, label, extraTarget } = options;
  const internal = checkSharedStrict(target, { label });
  const stdFnItem = parseMutateFn(fnItem, '', internal.mutateFnDict);
  if (!stdFnItem) {
    throw new Error('not a fn or fnItem { fn }');
  }
  if (extraTarget) {
    stdFnItem.extraBound = getBoundStateInfo(extraTarget);
  }
  const { desc, oriDesc } = stdFnItem;

  internal.mutateFnDict[desc] = stdFnItem;
  stdFnItem.enabled = internal.enableMutate;
  const dict = { [desc]: stdFnItem };
  let watchFnCtx;
  if (internal.enableMutate) {
    const retMap = watchAndCallMutateDict({ target, dict });
    watchFnCtx = retMap[desc];
  }
  return makeWitness(target, { desc, oriDesc, internal, watchFnCtx });
}

/**IMutateWitness
 * 配置 mutate 字典，暂返回 any，具体约束见 types-api multiDict
 */
function configureMutateDict(options: IConfigureMutateDictOpt): any {
  const { target, fnDict, label } = options;
  const internal = checkSharedStrict(target, { label });
  const dict = parseMutate(fnDict, internal.mutateFnDict, internal.enableMutate); // trust dict here
  if (options.extraTarget) {
    const extraBound = getBoundStateInfo(options.extraTarget);
    Object.keys(dict).forEach((key) => (dict[key].extraBound = extraBound));
  }

  let watchFnCtxMap: Dict = {};
  if (internal.enableMutate) {
    watchFnCtxMap = watchAndCallMutateDict({ target, dict });
  }
  const witnessDict: Dict<IMutateWitness> = {}; // 具体类型定义见 types-api multiDict
  Object.keys(dict).forEach((desc) => {
    witnessDict[desc] = makeWitness(target, { desc, oriDesc: desc, internal, watchFnCtx: watchFnCtxMap[desc] });
  });
  return witnessDict;
}

/**
 * 对 runMutate runMutateTask 入参做分析，确认是否能执行内部 mutate 逻辑
 */
function prepareParms<T extends SharedState>(target: T, options: ILogicOptions) {
  const { label, descOrOptions, forTask = false } = options;
  const { desc, strict, throwErr, extraArgs } = parseCreateMutateOpt(descOrOptions);
  if (!desc) {
    return { ok: false, desc, forTask, throwErr, err: new Error('miss desc') };
  }
  const internal = checkShared(target, { label, strict });
  if (!internal) {
    return { ok: false, desc, forTask, throwErr, extraArgs, err: new Error('not a valid atom or shared result') };
  }
  return { ok: true, desc, forTask, throwErr, extraArgs, err: null };
}

/**
 * 执行匹配 desc 的 mutate 函数
 */
export function runMutateLogic<T extends SharedState>(target: T, options: ILogicOptions): [T, Error | null] | Promise<[T, Error | null]> {
  const { ok, desc, forTask, err, throwErr, extraArgs } = prepareParms(target, options);
  if (!ok) {
    if (throwErr) {
      throw err;
    }
    return forTask ? Promise.resolve([target, err]) : [target, err];
  }
  const result = runMutateFnItem({ target, desc, forTask, throwErr, extraArgs });
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
export function mutate(target: SharedState, extraTarget?: SharedState) {
  return (fnItem: IMutateFnLooseItem<any, any, any> | MutateFn<any, any>) =>
    configureMutateFn({ target, extraTarget, fnItem, label: 'mutate' });
}

/**
 * 为 atom 或 share 创建多个 mutate 函数，接收一个字典配置来完成多函数配置，更详细的泛型定义见 types-api.d.ts
 */
export function mutateDict<T extends SharedState>(target: T, extraTarget?: SharedState) {
  return <D = MutateFnDict<T>>(fnDict: D) => configureMutateDict({ target, extraTarget, fnDict, label: 'mutateDict' });
}

/**
 * 辅助给直接透传给 defineMutateDerive 的某个 fnItem 标记类型
 */
export function defineMutateFnItem<F extends IMutateFnItem>(fnItem: F): F {
  return fnItem;
}
