import { ReactLike } from 'helux-types';
import * as api from './api';

/**
 * 提供给 adapter 库使用，方便绑定具体的 react 运行时，实际类型由 types-api 提供
 */
export function buildApi(react: ReactLike): any {
  const userApi: any = {};
  const apiCtx = { react };
  const apiVar: any = api; // fot skip ts check instead of ts-ignore
  Object.keys(api).forEach((fnKey: string) => {
    userApi[fnKey] = apiVar[fnKey].bind(null, apiCtx);
  });
  return userApi;
}
