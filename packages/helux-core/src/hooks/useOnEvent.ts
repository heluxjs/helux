import { getUserBus } from '../factory/common/userBus';
import { Fn } from '../types';
import { useEffectLogic } from './useEffect';

export function useOnEvent(name: string, cb: Fn) {
  useEffectLogic(
    () => {
      const userBus = getUserBus();
      userBus.on(name, cb);
      return () => userBus.off(name, cb);
    },
    { deps: [] },
  );
}
