/**
 * 创建 noop 函数，内置的 noopStr、noopNum、noopObj、noopVoid 不满足使用场景时，可用此函数来创建新的 noop 函数
 * @example
 * ```
 * const noopCat = makeNoopAny({ name: 'cat' });
 * ```
 */
declare function makeNoopAny<T = any>(result?: T): (...args: any[]) => T;
/** noopAny 默认返回 {}, 如不满足使用场景可基于 makeNoopAny 来定制 */
declare function noopAny(...args: any[]): any;
declare function noopStr(...args: any[]): string;
declare function noopNum(...args: any[]): number;
declare function noopObj<T = Record<string, any>>(...args: any[]): T;
declare function noopVoid(...args: any[]): void;
/**
 * 创建 noop async 函数，内置的 noopStrAsync、noopNumAsync、noopObjAsync、noopVoidAsync 不满足使用场景时，
 * 可用此函数来创建新的 noop 函数
 * @example
 * ```
 * const noopCatAsync = makeNoopAnyAsync({ name: 'cat' });
 * ```
 */
declare function makeNoopAnyAsync<T = any>(result?: T): (...args: any[]) => Promise<T>;
/** noopAnyAsync 默认返回 {}, 如不满足使用场景可基于 makeNoopAnyAsync 来定制 */
declare function noopAnyAsync(...args: any[]): Promise<any>;
declare function noopStrAsync(...args: any[]): Promise<string>;
declare function noopNumAsync(...args: any[]): Promise<number>;
declare function noopObjAsync<T = Record<string, any>>(...args: any[]): Promise<T>;
declare function noopVoidAsync(...args: any[]): Promise<void>;

export {
  makeNoopAny,
  makeNoopAnyAsync,
  noopAny,
  noopAnyAsync,
  noopNum,
  noopNumAsync,
  noopObj,
  noopObjAsync,
  noopStr,
  noopStrAsync,
  noopVoid,
  noopVoidAsync,
};
