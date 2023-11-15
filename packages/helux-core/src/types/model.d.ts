import * as api from './api';

export type HeluxApi = typeof api;

export type Model<T = any> = T;

export type FactoryFn<T = any> = (api: HeluxApi, extra?: any) => Model<T>;

export type ModelFactory<T = any> = { build: (extra?: any) => Model<T> };

export function model<T = any>(cb: (api: HeluxApi) => Model<T>): Model<T>;

/**
 * 高阶抽象接口，创建一个model工厂，方便做模块克隆，并支持传 extra 参数做个性化定制
 * ```ts
 * const factory = modelFactory((api, extra) => {
 *   console.log('received build extra param ', extra);
 *
 *   // you can also create multi sharedState
 *   const userCtx = api.shareState({ a: 1, b: 2 });
 *   const { state, setState } = userCtx;
 *   const someResult = api.derive(() => state.a + 100);
 *
 *  return { // export anything you want
 *    state,
 *     someResult,
 *     setState,
 *   }
 * });
 * // build model for reusing logic, but their state is isolated
 * const model1 = factory.build(22);
 * const model2 = factory.build(22);
 * ```
 */
export function modelFactory<T = any>(factory: FactoryFn<T>): ModelFactory<T>;
