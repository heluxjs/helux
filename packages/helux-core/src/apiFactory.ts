import { buildApi } from '@helux/hooks-impl';
import { Fn, React18Like, ReactLike } from '@helux/types';
import { noop } from '@helux/utils';
import * as api from './api';
import { CoreApiCtx } from './types/api-ctx';
import { HeluxApi, model, modelFactory } from './types/model';
// 依赖 api，故这里二次合并
import * as modelApi from './factory/createModel';

export type AllApi = HeluxApi & { model: typeof model; modelFactory: typeof modelFactory };
const needApiCtxFns = [
  'atom',
  'atomx',
  'share',
  'sharex',
  'bindAtom',
  'withAtom',
  'getMutateLoading',
  'getActionLoading',
  '$',
  'signal',
  'block',
  'blockStatus',
  'dynamicBlock',
  'dynamicBlockStatus',
];

function shouldInjectApiCtx(key: string) {
  return key.startsWith('use') || needApiCtxFns.includes(key);
}

function to18(react: ReactLike): React18Like {
  return Object.assign({ useSyncExternalStore: noop }, react);
}

/**
 * 提供给 adapter 库使用，用于绑定具体的 react 运行时，实际类型由 types/api 提供，
 * 依靠绑定 react 运行时可以做到多个类 react 框架共同使用 helux 包时，helux-core 可完美被复用
 */
export function buildHeluxApi(react: ReactLike, act?: Fn): AllApi {
  const hookImpl = buildApi(react);
  // All apis will be filled later
  const baseApi: any = { ...hookImpl };
  // 注意用户层面调用api时不需要感知这个参数，由 adapter 层自动绑定
  const apiCtx: CoreApiCtx = { react: to18(react), hookImpl, act };
  if (act) {
    // to avoid Warning from @testing-library/react:
    // Warning: An update to TestComponent inside a test was not wrapped in act(...)
    // This ensures that you're testing the behavior the user would see in the browser.
    // @see test file: https://github.com/heluxjs/helux/blob/master/packages/helux/__tests__/helux.ts
    hookImpl.useForceUpdate = () => {
      const [, set] = react.useState({});
      return () => act(() => set({}));
    };
  }
  const apiVar: any = api; // fot skip ts check instead of ts-ignore
  Object.keys(apiVar).forEach((key) => {
    const val = apiVar[key];
    if (shouldInjectApiCtx(key)) {
      // code 1:
      // baseApiVar[key] = (...args: any[]) => val(apiCtx, ...args) };

      // code 2: give arrow function a name;
      // const wrap = { [key]: (...args: any[]) => val(apiCtx, ...args) };
      // baseApiVar[key] = wrap[key];

      // code 3: use bind
      baseApi[key] = val.bind(null, apiCtx);
    } else {
      baseApi[key] = val;
    }
  });

  const allApi = {
    model: (cb: Fn) => modelApi.model(baseApi, cb),
    modelFactory: (cb: Fn) => modelApi.modelFactory(baseApi, cb),
  };

  return Object.assign(allApi, baseApi);
}
