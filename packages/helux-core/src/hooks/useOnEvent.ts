import { getUserBus } from '../factory/common/userBus';
import type { CoreApiCtx } from '../types/api-ctx';
import { Fn } from '../types/base';

export function useOnEvent(apiCtx: CoreApiCtx, name: string, evCb: Fn, onBeforeMount?: boolean) {
  const { useRef, useMemo, useEffect } = apiCtx.react;
  const fnRef = useRef<{ fn: Fn; wrap: any; onBeforeMount?: boolean }>({ fn: evCb, wrap: null, onBeforeMount });
  fnRef.current.fn = useMemo(() => evCb, [evCb]);

  if (!fnRef.current.wrap) {
    fnRef.current.wrap = (...args: any[]) => {
      fnRef.current.fn(...args);
    };
    if (onBeforeMount) {
      getUserBus().on(name, fnRef.current.wrap);
    }
  }

  useEffect(() => {
    const userBus = getUserBus();
    const { wrap, onBeforeMount } = fnRef.current;
    if (!onBeforeMount) {
      userBus.on(name, wrap);
    }
    return () => userBus.off(name, wrap);
  }, [name, fnRef]);
}
