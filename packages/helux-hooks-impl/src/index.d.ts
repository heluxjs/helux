import type { ReactLike } from '@helux/types';
import * as rawApiMod from './api';
import * as api from './types-api';

export type HooksApiImpl = typeof api;

export type HooksApiRaw = typeof rawApiMod;

export declare const rawApi: HooksApiRaw;

/**
 * 供适配层调用，初始化相关参数
 */
export function buildApi(react: ReactLike): HooksApiImpl;
