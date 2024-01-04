import { getUserBus } from '../factory/common/userBus';
import type { CoreApiCtx } from '../types/api-ctx';
import { Fn } from '../types/base';

export function useOnEvent(apiCtx: CoreApiCtx, name: string, evCb: Fn) {
  const { useRef, useMemo, useEffect } = apiCtx.react;
  const fnRef = useRef<{ fn: Fn; wrap: any }>({ fn: evCb, wrap: null });
  fnRef.current.fn = useMemo(() => evCb, [evCb]);

  if (!fnRef.current.wrap) {
    fnRef.current.wrap = (...args: any[]) => {
      fnRef.current.fn(...args);
    };
  }

  useEffect(() => {
    const userBus = getUserBus();
    const wrap = fnRef.current.wrap;
    userBus.on(name, wrap);
    return () => userBus.off(name, wrap);
  }, [name, fnRef]);
}
