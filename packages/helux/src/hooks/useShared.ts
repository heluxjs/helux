import { useEffect, useState } from 'react';
import { IS_SHARED, MOUNTED, RENDER_END, RENDER_START, SKIP_MERGE } from '../consts';
import type { InsCtxDef } from '../factory/common/buildInternal';
import { attachInsProxyState, buildInsCtx } from '../helpers/ins';
import { clearDep, recoverDep, resetReadMap, updateDep } from '../helpers/insdep';
import { getInternal, getRawState } from '../helpers/state';
import type { Dict } from '../types';
import { useSync } from './common/useSync';
import { useObjectLogic } from './useObject';

interface IUseOptions {
  enableReactive: boolean;
}

function checkStateVer(insCtx: InsCtxDef, options: IUseOptions) {
  const {
    ver,
    internal: { ver: dataVer },
  } = insCtx;
  if (ver !== dataVer) {
    // 替换 proxyState，让把共享对象透传给 memo 组件的场景也能正常触发重新渲染
    insCtx.ver = dataVer;
    attachInsProxyState(insCtx, options.enableReactive);
  }
}

function useSharedLogic<T extends Dict = Dict>(sharedObject: T, options: IUseOptions): [T, (partialState: Partial<T>) => void] {
  const rawState = getRawState(sharedObject);
  const [, setState] = useObjectLogic(rawState, { isStable: true, [IS_SHARED]: true, [SKIP_MERGE]: true });
  const [insCtx] = useState(() => buildInsCtx({ setState, sharedState: sharedObject, ...options }));
  insCtx.renderStatus = RENDER_START;
  resetReadMap(insCtx);

  useSync(insCtx.subscribe, () => getInternal(sharedObject).rawStateSnap);

  // start update dep in every render period
  useEffect(() => {
    insCtx.renderStatus = RENDER_END;
    updateDep(insCtx);
  });

  useEffect(() => {
    insCtx.mountStatus = MOUNTED;
    // recover dep and updater for double mount behavior under react strict mode
    recoverDep(insCtx);
    return () => {
      clearDep(insCtx);
    };
  }, [insCtx]);

  checkStateVer(insCtx, options);
  return [insCtx.proxyState, insCtx.internal.setState];
}

export function useShared<T extends Dict = Dict>(sharedObject: T, enableReactive = false) {
  return useSharedLogic(sharedObject, { enableReactive });
}
