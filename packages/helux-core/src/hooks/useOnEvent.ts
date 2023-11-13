import { useEffectLogic } from './useEffect';
import { Fn } from '../types';
import { getUserBus } from '../factory/common/userBus';

export function useOnEvent(name: string, cb: Fn) {
  useEffectLogic(() => {
    const userBus = getUserBus();
    userBus.on(name, cb);
    return () => userBus.off(name, cb);
  }, { deps: [] });
}
