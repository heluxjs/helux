import { buildInternal } from '../creator/buildInternal';
import { newFnCtx, newMutateCtx, newMutateFnItem, newReactiveMeta } from './ctor';

export const fakeDraftRootMeta = { draftRoot: { val: null }, isFake: true, isAtom: true };

export const fakeMutateCtx = newMutateCtx({});

export const fakeReativeMeta = newReactiveMeta(true, { expired: true, from: 'Reactive', desc: '' });

// { [MUTATE_FN_ITEM]: 1, fn: fnItem, deps: noopArr, oriDesc: desc, desc, depKeys: [] }
export const fakeMutateFnItem = newMutateFnItem();

export const fakeInternal = buildInternal({ rawState: {}, forAtom: false, usefulName: '' } as any, {} as any);

export const fakeFnCtx = newFnCtx();
