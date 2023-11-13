import * as api from '../api';
import { FactoryFn, ModelFactory, HeluxApi } from '../types-model';

function createModelLogic<T = any>(cb: FactoryFn<T>, extra?: any): T {
  return cb(api, extra);
}

/**
 * 创建一个 model 对象
 */
export function model<T = any>(cb: (api: HeluxApi) => T): T {
  return createModelLogic(cb);
}

/**
 * 定义model 工厂函数，方便模块克隆之用
 */
export function modelFactory<T = any>(factory: FactoryFn<T>): ModelFactory<T> {
  return {
    build: (extra?: any) => {
      return createModelLogic<T>(factory, extra);
    }
  }
}
