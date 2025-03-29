import { isFn } from '@helux/utils';
import type { DictFn } from '../../types/base';
import type { TInternal } from '../creator/buildInternal';

const lifecycleFnNames = ['willMount', 'mounted', 'willUnmount'];

export function defineLifecycle(lifecycleFns: DictFn, internal: TInternal) {
  const validFns: DictFn = {};
  lifecycleFnNames.forEach((name) => {
    const fn = lifecycleFns[name];
    if (isFn(fn)) {
      validFns[name] = fn;
    }
  });
  Object.assign(internal.lifecycle, validFns);
}
