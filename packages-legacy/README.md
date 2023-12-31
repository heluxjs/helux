## desc

3.6.0 之后，`helux-fre` 和 `helux-preact` 不在发布

## fre 问题

存在一个未结局的 bug https://github.com/frejs/fre/issues/362

## preact 问题

不知如何打包 `preact/compat` 到 `helux-preact` 里，目前用户可参考`helux-preact/src`写法自己声明一个文件复制以下内容来导出适配 `preact` 的 api，线上示例见： [helux-preact-starter](https://codesandbox.io/s/helux-preact-starter-dnyzpy)的`libs/helux`文件

```ts
import { initHeluxContext } from '@helux/core';
import reactLib from 'preact/compat';

const api = initHeluxContext({ heluxCtxKey: '__HELUX_PREACT__', reactLib });

// 导出 core 所有方法，类型由 index.d.ts 提供（见 package.json 的 types 配置）
export const {
  atom,
  atomx,
  share,
  sharex,
  // derive api
  derive,
  deriveDict,
  defineDeriveTask,
  defineDeriveFnItem,
  runDerive,
  runDeriveTask,
  // watch api
  watch,
  // hooks api
  useAtom,
  useAtomX,
  useReactive,
  useDerived,
  useWatch,
  useGlobalId,
  useService,
  useOnEvent,
  useMutable,
  useMutateLoading,
  useActionLoading,
  useEffect,
  useLayoutEffect,
  useStable,
  useObject,
  useLocalForceUpdate,
  useGlobalForceUpdate,
  // action api
  action,
  // signal api
  signal,
  block,
  dynamicBlock,
  $,
  // mutate api
  mutate,
  mutateDict,
  runMutate,
  runMutateTask,
  // sync api
  sync,
  syncer,
  // model api
  model,
  modelFactory,
  // emit api
  emit,
  on,
  // init api
  init,
  // util api
  reactiveDesc,
  flush,
  isAtom,
  isDerivedAtom,
  storeSrv,
  shallowCompare,
  isDiff,
  produce,
  getMutateLoading,
  getActionLoading,
  getDeriveLoading,
  getRawState,
  getSnap,
  getAtom,
  addMiddleware,
  addPlugin,
  EVENT_NAME,
  RECORD_LOADING,
  VER,
  LIMU_VER,
} = api;
```
