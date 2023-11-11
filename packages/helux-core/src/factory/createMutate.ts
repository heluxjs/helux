import { SINGLE_MUTATE } from '../consts';
import { getInternal } from '../helpers/state';
import type { Atom, AtomMutateFnItem, IRunMutateOptions, MutateFnItem, SharedDict, SharedState } from '../types';
import { checkShared } from './common/check';
import { callMutateFn, configureMutateFns } from './creator/mutateFn';
import { parseCreateMutateOpt, parseDesc } from './creator/parse';

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

/** 如用户未显式指定 desc，会自动生成一个，辅助 runMutateFn 之用，当前阶段不考虑 desc 重复问题，需用户自己保证 */
function injectDesc(fnItem: MutateFnItem | AtomMutateFnItem) {
  const desc = parseDesc(fnItem.desc);
  return { ...fnItem, desc };
}

/**
 * 创建一个外部执行的 mutate 函数（ 即不定义在生成 share 或 atom 时的 options 参数里，生成后再定义 mutate 函数 ）
 */
function configureMutateFn(options: { target: SharedState; fnItem: MutateFnItem | AtomMutateFnItem; forAtom?: boolean; label: string }) {
  const { target, fnItem, forAtom = false, label } = options;
  checkShared(target, { forAtom, label, strict: true });
  const withDescFn = injectDesc(fnItem);
  configureMutateFns({ target, fns: [withDescFn], isOut: true });
  const realDesc = withDescFn.desc;
  return {
    call: () => runMutateFnItem({ target, desc: realDesc }), // 呼叫同步函数的句柄
    callTask: () => runMutateFnItem({ target, desc: realDesc, forTask: true }), // 呼叫异步函数的句柄
    realDesc,
    desc: fnItem.desc || '',
  };
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
export function mutate(target: SharedDict) {
  return (fnItem: MutateFnItem<any, any>) => configureMutateFn({ target, fnItem, label: 'mutate' });
}

/**
 * 为 atom 创建一个 mutate 函数，如需创建异步计算结果，配置 task 即可
 * 更详细的泛型定义见 types-api.d.ts
 */
export function atomMutate(target: Atom) {
  return (fnItem: AtomMutateFnItem<any, any>) => configureMutateFn({ target, fnItem, label: 'atomMutate', forAtom: true });
}
