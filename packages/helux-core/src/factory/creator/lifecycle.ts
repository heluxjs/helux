import { isFn } from '@helux/utils';
import type { DictFn } from '../../types/base';
import type { TInternal } from '../creator/buildInternal';

const lifecycleFnNames = ['willMount', 'mounted', 'willUnmount', 'beforeCommit', 'afterCommit', 'onRead', 'onWrite'];

export function defineLifecycle(lifecycleFns: DictFn, internal: TInternal) {
  if (!lifecycleFns) return;

  const validFns: DictFn = {};
  lifecycleFnNames.forEach((name) => {
    const fn = lifecycleFns[name];
    if (!isFn(fn)) {
      return;
    }
    validFns[name] = fn;
    if (name === 'beforeCommit') {
      internal.lifecycle.hasBeforeCommit = true;
    }
  });
  Object.assign(internal.lifecycle, validFns);
}
