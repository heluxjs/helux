import { canUseDeep, isSymbol, prefixValKey, warn } from '@helux/utils';
import { immut } from 'limu';
import { HAS_SYMBOL, IS_ATOM, KEY_SPLITER } from '../../consts';
import { recordBlockDepKey } from '../../helpers/blockDep';
import { recordFnDepKeys } from '../../helpers/fnDep';
import { createOb } from '../../helpers/obj';
import { mapSharedState } from '../../helpers/state';
import type { Dict } from '../../types/base';
import { getMarkAtomMap } from '../common/atom';
import { recordLastest } from '../common/blockScope';
import type { ParsedOptions } from './parse';

/**
 * 创建全局使用的共享对象，可提供给 useShared useDerived useWatch derived watch 函数使用
 */
export function buildSharedState(options: ParsedOptions) {
  let sharedState: any = {};
  const { rawState, sharedKey, deep, forAtom } = options;
  const collectDep = (valKey: string, keyPath: string[], val: any) => {
    const depKey = prefixValKey(valKey, sharedKey);
    // using shared state in derived/watch callback
    recordFnDepKeys([depKey], { sharedKey, sharedState });
    recordBlockDepKey([depKey]);
    recordLastest(sharedKey, val, sharedState, depKey, keyPath);
  };

  if (canUseDeep(deep)) {
    sharedState = immut(rawState, {
      customKeys: [IS_ATOM as symbol],
      customGet: () => forAtom,
      onOperate: (params) => {
        const { isBuiltInFnKey, fullKeyPath } = params;
        !isBuiltInFnKey && collectDep(fullKeyPath.join(KEY_SPLITER), fullKeyPath, params.value);
      },
    });
  } else {
    sharedState = createOb(rawState, {
      set: () => {
        warn('changing shared state is invalid');
        return true;
      },
      get: (target: Dict, key: any) => {
        if (key === IS_ATOM) {
          return forAtom;
        }
        const val = target[key];
        if (isSymbol(key)) {
          return val;
        }
        collectDep(key, [key], val);
        return val;
      },
    });
  }
  mapSharedState(sharedKey, sharedState);
  if (!HAS_SYMBOL) {
    getMarkAtomMap().set(sharedState, forAtom);
  }

  return sharedState;
}
