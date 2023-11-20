import type { HooksApiImpl } from '@helux/hooks-impl';
import type { React18Like } from '@helux/types';
import * as api from './api';

export type HeluxApi = typeof api;

/**
 * 由 apiFactory 绑定后注入
 */
export type CoreApiCtx = { react: React18Like; hookImpl: HooksApiImpl };
