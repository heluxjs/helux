import type { Dict } from '@helux/types';

function getGlobalThis() {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof global !== 'undefined') return global;
  if (typeof window !== 'undefined') return window;
  // @ts-ignore
  if (typeof this !== 'undefined') return this;
  throw new Error('no globalThis');
}

// 直接写 window 导致 vitest 报错，改为 getGlobalThis 写法
// export const GLOBAL_REF: Dict & Window & typeof globalThis = window || global;

export const GLOBAL_REF: Dict & Window & typeof globalThis = getGlobalThis();

export const DEV_FLAG = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
