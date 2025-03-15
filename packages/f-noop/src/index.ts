/**
 * @file 一系列占位空函数
 */

/**
 * 创建 noop 函数，内置的 noopStr、noopNum、noopObj、noopVoid 不满足使用场景时，可用此函数来创建新的 noop 函数
 * @example
 * ```
 * const noopCat = makeNoopAny({ name: 'cat' });
 * ```
 */
export function makeNoopAny(result) {
  return () => result;
}

/** noopAny 默认返回 {}, 如不满足使用场景可基于 makeNoopAny 来定制 */
export function noopAny() {
  return {};
}

export function noopStr() {
  return '';
}

export function noopNum() {
  return 0;
}

export function noopObj() {
  return {};
}

export function noopVoid() {}

/**
 * 创建 noop async 函数，内置的 noopStrAsync、noopNumAsync、noopObjAsync、noopVoidAsync 不满足使用场景时，
 * 可用此函数来创建新的 noop 函数
 * @example
 * ```
 * const noopCatAsync = makeNoopAnyAsync({ name: 'cat' });
 * ```
 */
export function makeNoopAnyAsync(result) {
  return async () => result;
}

/** noopAnyAsync 默认返回 {}, 如不满足使用场景可基于 makeNoopAnyAsync 来定制 */
export async function noopAnyAsync() {
  return {};
}

export async function noopStrAsync() {
  return '';
}

export async function noopNumAsync() {
  return 0;
}

export async function noopObjAsync() {
  return {};
}

export async function noopVoidAsync() {}
