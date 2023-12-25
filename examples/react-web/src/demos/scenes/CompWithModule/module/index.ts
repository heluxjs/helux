import { ctx } from './state';
import { mutateStateFn } from './mutateState';
import * as actions from './actions'; // 定义action 函数
import * as deriveFull from './deriveFull'; // 定义全量派生结果
import * as deriveSelf from './deriveSelf'; // 定义自身可变派生结果
import * as deriveMutate from './deriveMutate'; // 使用一个新对象来定义可变派生结果
import { delay } from '../../../logic/util';

export { ctx } from './state';
// action 对象
export const action = ctx.defineActions()(actions);
// 全量派生对象
export const deriveF = ctx.defineFullDerive()(deriveFull);
// 自我可变派生对象
export const deriveS = ctx.defineMutateSelf()(deriveSelf);
// 全新可变派生对象
export const deriveM = ctx.defineMutateDerive(mutateStateFn)(deriveMutate);

const go = deriveF.result.go;

console.log('go', deriveF.result.go);

action.actions.changeF(1);

console.log('go', deriveF.result.go);

action.actions.changeF(1);

console.log('go', deriveF.result.go);

async function test(){
  action.actions.changeF(1);
  await delay(2000);
  console.log('fTask', deriveF.result.fTask);
  console.log('f2', deriveF.result.f2);
  action.actions.changeF(1);
  await delay(2000);
  console.log('fTask', deriveF.result.fTask);
  console.log('f2', deriveF.result.f2);

  const [r, err] = await deriveF.helper.fTask.runDeriveTask();
  console.log('r, err', r, err);
}
test();

// const a = deriveF.helper.go.useDerived()
