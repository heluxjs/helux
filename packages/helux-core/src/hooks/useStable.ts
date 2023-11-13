import { react } from '../react';
import type { Dict } from '../types';
import type { MutableRefObject } from '../types-react';
import { canUseProxy, isFn, isObj, safeGet } from '../utils';

type Stable = { data: any; wrap: any; inited: boolean };
type StableRef = MutableRefObject<Stable>;

/** 特殊处理 {} 类型 */
function wrapObj(data: any, ref: StableRef) {
  if (!canUseProxy()) {
    const wrap: Dict = {};
    Object.keys(data).forEach((key) => {
      const val = data[key];
      if (isFn(val)) {
        wrap[key] = (...args: any[]) => ref.current.data[key](...args);
      } else {
        Object.defineProperty(wrap, key, {
          get() {
            return ref.current.data[key];
          },
          set(value) {
            ref.current.data[key] = value;
          },
        });
      }
    });
    return wrap;
  }

  const cache: Dict = {};
  return new Proxy(data, {
    get(target, key) {
      const val = target[key];
      if (isFn(val)) {
        return safeGet(cache, key, (...args: any[]) => ref.current.data[key](...args));
      }
      return val;
    },
  });
}

/** 包裹数据为稳定引用 */
function wrapData(ref: StableRef) {
  const { data } = ref.current;
  if (isFn(data)) {
    ref.current.wrap = (...args: any[]) => ref.current.data(...args);
    return;
  }
  if (isObj(data)) {
    ref.current.wrap = wrapObj(data, ref);
    return;
  }
  ref.current.wrap = data;
}

export function useStable<T = any>(data: T) {
  const stableRef = react.useRef<Stable>({ data, wrap: {}, inited: false });
  // 'stableRef.current = serviceImpl' will have problem in react devtool
  // https://github.com/alibaba/hooks/issues/728
  // https://github.com/facebook/react/issues/20394
  // https://github.com/facebook/react/blob/80f3d88190c07c2da11b5cac58a44c3b90fbc296/packages/react-debug-tools/src/ReactDebugHooks.js#L249
  stableRef.current.data = react.useMemo(() => data, [data]);
  // stableRef.current.data = data;
  if (!stableRef.current.inited) {
    wrapData(stableRef);
    stableRef.current.inited = true;
  }
  return stableRef.current.wrap;
}
