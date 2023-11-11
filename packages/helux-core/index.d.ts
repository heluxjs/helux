/**
 * Adapter lib only need to know this interface, after calling it, just write export * from 'helux-core'
 * and its types files can set as helux-core/scr/types-api.d.ts
 * see the lib helux that build for react:  https://github.com/heluxjs/helux/blob/master/packages/helux/src/index.ts
 */
export function initHeluxContext(options: {
  heluxCtxKey: string | symbol;
  reactLib: any;
  standalone?: boolean;
  transfer?: (existedRoot: any, newRoot: any) => any;
}): void;
