import { FactoryFn, HeluxApi, ModelFactory } from '../types/model';

function createModelLogic<T = any>(baseApi: HeluxApi, cb: FactoryFn<T>, extra?: any): T {
  // 传递的是绑定过具体 react 运行时的 api
  return cb(baseApi, extra);
}

/**
 * 创建一个 model 对象
 */
export function model<T = any>(baseApi: HeluxApi, cb: (api: HeluxApi) => T): T {
  return createModelLogic(baseApi, cb);
}

/**
 * 定义model 工厂函数，方便模块克隆之用
 */
export function modelFactory<T = any>(baseApi: HeluxApi, factory: FactoryFn<T>): ModelFactory<T> {
  return {
    build: (extra?: any) => {
      return createModelLogic<T>(baseApi, factory, extra);
    },
  };
}
