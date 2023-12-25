import { IDeriveFnParams, IDeriveFnItem, defineDeriveFnItem, defineDeriveTask } from 'helux';
import { state } from './state';
import { delay } from '../../../logic/util';

export function go(params: IDeriveFnParams) {
  return state.val.f + 100;
}

export function test() {
  const map: Record<number, any> = {};
  state.val.list.forEach(item => map[item.id] = item);
  return map;
}

/**
 * 通过 IDeriveFnItem 主动约束结果返回类型和deps 返回类型，同时 deps 返回类型自动透传给 params.input
 */
export const fTask: IDeriveFnItem<number, [number]> = {
  deps: () => [state.val.f],
  fn: (params) => {
    return params.input[0];
  },
  task: async (params) => {
    delay(1000)
    return params.prevResult + 100;
  },
}

export const fTask2 = defineDeriveFnItem<IDeriveFnItem<number, [number]>>({
  deps: () => [state.val.f],
  fn: (params) => {
    return params.input[0];
  },
  task: async (params) => {
    delay(1000);
    return params.prevResult + 100;
  },
});

/**
 * 通过 defineDeriveTask 约束结果返回类型，自动推导出 deps 返回类型并透传给 params.input
 */
export const f2 = defineDeriveTask(
  () => [state.val.f] as const,
)<number>({
  fn: (params) => {
    return params.input[0];
  },
  task: async (params) => {
    delay(1000)
    return params.prevResult + 100;
  },
});
