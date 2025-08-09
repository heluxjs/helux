import type { ReactLike } from '@helux/types';
import type { HooksApiImpl } from '@helux/hooks-impl';
import type { HeluxApi, model, modelFactory } from './types/model';

/**
 * 避免上层应用库（例如：helux ）的 index.ts 里 再次导出 limu 时出现警告：
 * 如果没有引用 "xxx"，则无法命名 "xxxx" 的推断类型。这很可能不可移植
 */
declare module 'limu' { }

export type AllApi = HeluxApi & {
  model: typeof model;
  modelFactory: typeof modelFactory;
  hookImpl: HooksApiImpl;
};

/**
 * Adapter lib only need to know this interface, after calling it, just write export { ... } from 'helux-core'
 * and its types files can set as helux-core/scr/types-api.d.ts
 * see the lib helux that build for react:  https://github.com/heluxjs/helux/blob/master/packages/helux/src/index.ts
 */
export function initHeluxContext(options: {
  heluxCtxKey: string | symbol;
  reactLib: ReactLike;
  standalone?: boolean;
  transfer?: (existedRoot: any, newRoot: any) => any;
}): AllApi;
