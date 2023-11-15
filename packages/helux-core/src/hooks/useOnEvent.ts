import { getUserBus } from '../factory/common/userBus';
import type { CoreApiCtx } from '../types/api-ctx';
import { Fn } from '../types/base';

export function useOnEvent(apiCtx: CoreApiCtx, name: string, cb: Fn) {
  apiCtx.react.useEffect(() => {
    const userBus = getUserBus();
    userBus.on(name, cb);
    return () => userBus.off(name, cb);
  }, []);
}
