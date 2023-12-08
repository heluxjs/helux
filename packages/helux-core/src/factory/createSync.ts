import type { SharedDict } from '../types/base';
import { checkSharedStrict } from './common/check';
import { createSyncerBuilder, createSyncFnBuilder } from './creator/sync';

function innerCreate(target: any, options: { label: string; isSyncer?: boolean }) {
  const { label, isSyncer } = options;
  const internal = checkSharedStrict(target, { label });
  const fn = isSyncer ? createSyncerBuilder : createSyncFnBuilder;
  return fn(internal);
}

export function sync<T extends SharedDict>(target: T) {
  return innerCreate(target, { label: 'sync' });
}

export function syncer<T extends SharedDict>(target: T) {
  return innerCreate(target, { label: 'syncer', isSyncer: true });
}
