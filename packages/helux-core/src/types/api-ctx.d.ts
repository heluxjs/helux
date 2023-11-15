import type { HooksApiImpl } from 'helux-hooks-impl';
import type { React18Like } from 'helux-types';
import * as api from './api';

export type HeluxApi = typeof api;

export type CoreApiCtx = { react: React18Like; hookImpl: HooksApiImpl };
