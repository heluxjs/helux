import type { Atom, SharedDict } from '../types/base';
import { checkSharedStrict } from './common/check';
import { createSyncerBuilder, createSyncFnBuilder } from './creator/sync';

function innerCreate(target: any, options: { label: string; forAtom?: boolean; isSyncer?: boolean }) {
  const { label, forAtom, isSyncer } = options;
  const { sharedKey, rawState, innerSetState } = checkSharedStrict(target, { label, forAtom });
  const fn = isSyncer ? createSyncerBuilder : createSyncFnBuilder;
  return fn(sharedKey, rawState, innerSetState);
}

export function sync<T extends SharedDict>(target: T) {
  return innerCreate(target, { label: 'sync' });
}

export function syncer<T extends SharedDict>(target: T) {
  return innerCreate(target, { label: 'syncer', isSyncer: true });
}

export function atomSync<T extends any>(target: Atom<T>) {
  return innerCreate(target, { label: 'atomSync', forAtom: true });
}

export function atomSyncer<T extends any>(target: Atom<T>) {
  return innerCreate(target, { label: 'atomSyncer', isSyncer: true, forAtom: true });
}
