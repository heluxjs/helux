import * as actions from './actions'; // action 函数定义
import * as deriveFull from './deriveFull'; // 全量派生结果定义
import * as deriveMutate from './deriveMutate'; // 新对象来可变派生结果定义
import * as deriveSelf from './deriveSelf'; // 自我可变派生结果定义
import { mutateStateFn } from './mutateState';
import { ctx } from './state';

export { ctx } from './state';
// action 对象
export const action = ctx.defineActions()(actions);
// 全量派生对象
export const deriveF = ctx.defineFullDerive()(deriveFull);
// 自我可变派生对象
export const deriveS = ctx.defineMutateSelf()(deriveSelf);
// 全新可变派生对象
export const deriveM = ctx.defineMutateDerive(mutateStateFn)(deriveMutate);
