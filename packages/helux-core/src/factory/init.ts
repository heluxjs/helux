import { Fn } from '@helux/types';
import { GLOBAL_REF } from '@helux/utils';
import { AllApi, buildHeluxApi } from '../apiFactory';
import { createRoot, getRootData, HeluxRoot, setRootData } from './root';

export function initHeluxContext(options: {
  heluxCtxKey: string | symbol;
  reactLib: any;
  act?: Fn;
  standalone?: boolean;
  transfer?: (existedRoot: any, newRoot: any) => any;
}): AllApi {
  const { inited, API } = getRootData();
  if (inited) return API as AllApi; // only can be call one time!

  const { heluxCtxKey, standalone, transfer, reactLib, act } = options;
  const existedRoot: HeluxRoot = GLOBAL_REF[heluxCtxKey];
  const done = (key: string | symbol, root?: any) => {
    const ROOT = root || createRoot();
    const api = buildHeluxApi(reactLib, act);
    setRootData({ ROOT, inited: true, api });
    GLOBAL_REF[key] = ROOT;
    return api;
  };

  if (!existedRoot) {
    return done(heluxCtxKey);
  }

  // found another version, but want to own dependency helux context
  if (standalone) {
    return done(`${String(heluxCtxKey)}_${Date.now()}`);
  }

  // currently helux will reuse existed helux context,
  // multi helux lib will share one hulex context,
  // no matter the helux in app1 and app2 is the same module or not,
  // it is ok that app1 can use a shared state exported from app2 by useAtom directly,

  // try transfer legacy root by user custom transfer fn
  if (transfer) {
    const ROOT = createRoot(); // may a lower version root
    setRootData({ ROOT, inited: true });
    transfer(existedRoot, ROOT);
  }

  // rebind for ssr scenes( nextjs... )
  return done(heluxCtxKey, existedRoot);
}
