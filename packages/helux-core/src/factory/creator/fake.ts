import { noop } from '@helux/utils';
import { FROM } from '../../consts';
import type { MutateFnStdItem } from '../../types/base';
import type { IReactiveMeta } from '../../types/inner';
import { newMutateCtx } from '../common/util';
import { buildInternal } from './buildInternal';

export const fakeDraftRoot = { val: null, isFake: true };

export const fakeMutateCtx = newMutateCtx({});

export const fakeReativeMeta: IReactiveMeta = {
  isReactive: false,
  key: '',
  sharedKey: 0,
  moduleName: '',
  writeKeys: [],
  desc: '',
  onRead: undefined,
  from: FROM.SET_STATE,
};

// { [MUTATE_FN_ITEM]: 1, fn: fnItem, deps: noopArr, oriDesc: desc, desc, depKeys: [] }
export const fakeMutateFnItem: MutateFnStdItem = {
  fn: noop,
  depKeys: [],
  oriDesc: '',
  desc: '',
};

export const fakeInternal = buildInternal({ rawState: {}, forAtom: false, usefulName: '' } as any, {} as any);
