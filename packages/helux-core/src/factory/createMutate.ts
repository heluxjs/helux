import { SINGLE_MUTATE } from '../consts';
import { getInternal } from '../helpers/state';
import type {
  Atom,
  AtomMutateFn,
  AtomMutateFnDict,
  AtomMutateFnLooseItem,
  Dict,
  IRunMutateOptions,
  MutateFn,
  MutateFnDict,
  MutateFnLooseItem,
  MutateWitness,
  SharedDict,
  SharedState,
} from '../types';
import { checkShared, checkSharedStrict } from './common/check';
import { callMutateFn, watchAndCallMutateDict } from './creator/mutateFn';
import { parseCreateMutateOpt, parseMutate, parseMutateFn } from './creator/parse';

interface ILogicOptions {
  label: string;
  descOrOptions?: string | IRunMutateOptions;
  forTask?: boolean;
}

/**
 * 查找到配置到 mutate 函数并执行
 */
function runMutateFnItem(options: { target: SharedState; desc?: string; forTask?: boolean }) {
  const { target, desc: inputDesc = '', forTask = false } = options;
  const { mutateFnDict, snap } = getInternal(target);
  const desc = inputDesc || SINGLE_MUTATE; // 未传递任何描述，尝试调用可能存在的单函数

  const item = mutateFnDict[desc];
  if (!item) return;
  // 指定了 task 但未配置 task，返回最近一次修改结果的快照
  if (forTask && !item.task) return snap;

  // 调用 desc 对应的函数
  return callMutateFn(target, { ...item, forTask });
}

function makeWitness(target: SharedState, desc: string, realDesc: string) {
  return {
    call: () => runMutateFnItem({ target, desc: realDesc }), // 呼叫同步函数的句柄
    callTask: () => runMutateFnItem({ target, desc: realDesc, forTask: true }), // 呼叫异步函数的句柄
    desc,
    realDesc,
  };
}

interface IConfigureMutateFnOptBase {
  target: SharedState;
  forAtom?: boolean;
  label: string;
}

interface IConfigureMutateFnOpt extends IConfigureMutateFnOptBase {
  fnItem: MutateFnLooseItem | AtomMutateFnLooseItem | MutateFn | AtomMutateFn;
}

interface IConfigureMutateDictOpt extends IConfigureMutateFnOptBase {
  fnDict: any; // 刻意擦除类型，适配 atomMutateDict 逻辑
}

/**
 * 创建一个外部执行的 mutate 函数（ 即不定义在生成 share 或 atom 时的 options 参数里，生成后再定义 mutate 函数 ）
 */
function configureMutateFn(options: IConfigureMutateFnOpt) {
  const { target, fnItem, forAtom = false, label } = options;
  const internal = checkSharedStrict(target, { forAtom, label });
  const stdFnItem = parseMutateFn(fnItem, '', internal.mutateFnDict);
  if (!stdFnItem) {
    throw new Error('not a fn or fnItem { fn }');
  }
  const dict = { [stdFnItem.realDesc]: stdFnItem };
  watchAndCallMutateDict({ target, dict });
  return makeWitness(target, stdFnItem.desc, stdFnItem.realDesc);
}

/**
 * 配置 mutate 字典，暂返回 any，具体约束见 types-api multiDict
 */
function configureMutateDict(options: IConfigureMutateDictOpt): any {
  const { target, fnDict, forAtom = false, label } = options;
  const internal = checkSharedStrict(target, { forAtom, label });
  const dict = parseMutate(fnDict, internal.mutateFnDict); // trust dict here
  watchAndCallMutateDict({ target, dict });
  const witnessDict: Dict<MutateWitness> = {}; // 具体类型定义见 types-api multiDict
  Object.keys(dict).forEach((desc) => {
    witnessDict[desc] = makeWitness(target, desc, desc);
  });
  return witnessDict;
}

/**
 * 对 runMutate runMutateTask 入参做分析，确认是否能执行内部 mutate 逻辑
 */
function prepareParms<T extends SharedState>(target: T, options: ILogicOptions) {
  const { label, descOrOptions, forTask = false } = options;
  const { desc, strict } = parseCreateMutateOpt(descOrOptions);
  const internal = checkShared(target, { label, strict });
  if (!internal || !desc) {
    return { ok: false, desc, forTask };
  }
  return { ok: true, desc, forTask };
}

/**
 * 执行匹配 desc 的 mutate 函数
 */
export function runMutateLogic<T extends SharedState>(target: T, options: ILogicOptions): T | Promise<T> {
  const { ok, desc, forTask } = prepareParms(target, options);
  if (!ok) {
    return forTask ? Promise.resolve(target) : target;
  }
  const nextSnap = runMutateFnItem({ target, desc, forTask });
  return forTask ? Promise.resolve(nextSnap) : nextSnap;
}

/**
 * 执行匹配 desc 的 mutate 函数
 */
export function runMutate<T extends SharedState>(target: T, descOrOptions?: string | IRunMutateOptions): T {
  return runMutateLogic(target, { descOrOptions, label: 'runMutate' }) as T;
}

/**
 * 执行匹配 desc 的 mutate task 函数（存在才执行）
 */
export function runMutateTask<T extends SharedState>(target: T, descOrOptions?: string | IRunMutateOptions): Promise<T> {
  return runMutateLogic(target, { descOrOptions, label: 'runMutateTask', forTask: true }) as Promise<T>;
}

/**
 * 为 shared 创建一个 mutate 函数，如需创建异步计算结果，配置 task 即可
 * 更详细的泛型定义见 types-api.d.ts
 */
export function mutate(target: SharedState) {
  return (fnItem: MutateFnLooseItem<any, any> | MutateFn<any, any>) => configureMutateFn({ target, fnItem, label: 'mutate' });
}

/**
 * 为 shared 创建多个 mutate 函数，接收一个字典配置来完成多函数配置，更详细的泛型定义见 types-api.d.ts
 */
export function mutateDict<T extends SharedDict>(target: T) {
  return <D = MutateFnDict<T>>(fnDict: D) => configureMutateDict({ target, fnDict, label: 'mutateDict' });
}

/**
 * 为 atom 创建一个 mutate 函数，如需创建异步计算结果，配置 task 即可
 * 更详细的泛型定义见 types-api.d.ts
 */
export function atomMutate(target: Atom) {
  return (fnItem: AtomMutateFnLooseItem<any, any> | AtomMutateFn<any, any>) =>
    configureMutateFn({ target, fnItem, label: 'atomMutate', forAtom: true });
}

export function atomMutateDict(target: Atom) {
  return (fnDict: AtomMutateFnDict) => configureMutateDict({ target, fnDict, label: 'atomMutateDict' });
}
