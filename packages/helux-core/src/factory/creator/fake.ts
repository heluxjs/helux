import { noop, noopArr } from '@helux/utils';
import { FROM } from '../../consts';
import type { MutateFnStdItem } from '../../types/base';
import type { IReactiveMeta } from '../../types/inner';
import { newMutateCtx } from '../common/util';
import { buildInternal } from './buildInternal';

export const fakeDraftRoot = { val: null, isFake: true };

export const fakeMutateCtx = newMutateCtx({});

export const fakeReativeMeta: IReactiveMeta = {
  isTop: true,
  key: '',
  fnKey: '',
  sharedKey: 0,
  moduleName: '',
  depKeys: [],
  writeKeys: [],
  desc: '',
  onRead: undefined,
  from: FROM.SET_STATE,
};

// { [MUTATE_FN_ITEM]: 1, fn: fnItem, deps: noopArr, oriDesc: desc, desc, depKeys: [] }
export const fakeMutateFnItem: MutateFnStdItem = {
  fn: noop,
  onlyDeps: false,
  depKeys: [],
  oriDesc: '',
  desc: '',
  watchKey: '',
};

export const fakeInternal = buildInternal({ rawState: {}, forAtom: false, usefulName: '' } as any, {} as any);

export const newFakeFnItem = (partial: any) => {
  const { desc = '', fn = noop, task = noop, depKeys = [], deps = noopArr } = partial;
  return {
    fn,
    task,
    deps,
    oriDesc: '',
    desc,
    depKeys,
    checkDeadCycle: undefined,
    watchKey: '',
    ...partial,
  };
};
