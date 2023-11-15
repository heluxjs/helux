import type { Dict } from 'helux-types';

// @ts-ignore
export const GLOBAL_REF: Dict & Window & typeof globalThis = window || global;

export const DEV_FLAG = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
