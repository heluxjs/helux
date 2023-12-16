import { createSymbol, HAS_SYMBOL } from '../helpers/sym';
export { EVENT_NAME, LIMU_VER, RECORD_LOADING, VER } from './user';
export { HAS_SYMBOL };

export const PROTO_KEY = '__proto__';

/** 提供给 sync 返回 undefined 时之用 */
export const UNDEFINED = createSymbol('HeluxUndefined');

/** 标识对象是一个 MutateFnItem */
export const MUTATE_FN_ITEM = createSymbol('HeluxMutateFnItem');

export const FN_KEY = createSymbol('HeluxFnKey');

/** get reactive obj's sharedKey */
export const SHARED_KEY = createSymbol('HeluxSharedKey');

export const REACTIVE_META_KEY = createSymbol('HeluxReactiveMeta');

/** see if the target is returned by block series api */
export const IS_BLOCK = createSymbol('HeluxIsBlock');

/** see if the target is returned by atom api */
export const IS_ATOM = createSymbol('HeluxIsAtom');

/** see if the target is returned by deriveAtom api */
export const IS_DERIVED_ATOM = createSymbol('HeluxIsDerivedAtom');

export const OP_KEYS = [SHARED_KEY, IS_ATOM, IS_DERIVED_ATOM];
// export const OP_KEYS = [IS_ATOM, SHARED_KEY];

/**
 * mark fn a single change fn
 * why not use symbol, for stay away from console.log(`see desc ${symbol}`) err
 */
export const SINGLE_MUTATE = 'SingleMutate';

export const HELUX_GLOBAL_LOADING = 'HeluxGlobalLoading';

/** 默认的依赖收集深度值，数组自动加1，用于存储下标 */
export const STOP_DEPTH = 6;

/** 默认数组停止收集 */
export const STOP_ARR_DEP = true;

/** 卸载数据的过期时间（单位：ms） */
export const EXPIRE_MS = 2000;

export const SIZE_LIMIT = 20;

export const RENDER_START = '1';

export const RENDER_END = '2';

export const NOT_MOUNT = 1;

export const MOUNTED = 2;

export const UNMOUNT = 3;

export const KEY_SPLITER = '|';

export const ASYNC_TYPE = {
  TASK: 'task',
  MAY_TRANSFER: 'may_transfer',
} as const;

export const SCOPE_TYPE = {
  STATIC: 'static',
  HOOK: 'hook',
} as const;

export const STATE_TYPE = {
  USER_STATE: 'user_state',
  GLOGAL_EMPTY: 'global_empty',
  GLOGAL_LOADING: 'global_loading',
  PRIVATE_LOADING: 'private_loading',
} as const;

// fn type
export const DERIVE = 'derive';
export const WATCH = 'watch';

/** 来自 limu 的数据类型表达 */
export const DICT = 'Object';
export const MAP = 'Map';
export const ARR = 'Array';
/** 不属于 DICT MAP ARR 算作其他 */
export const OTHER = 'Other';

export const FROM = {
  /**
   * 来自 top setState(draft)、ins setState(draft) 的读写
   * ```ts
   * const [, setState] = atom({a:1});
   *
   * const [, setState] = useAtom();
   * ```
   */
  SET_STATE: 'SetState',
  /**
   * 来自 mutate task setState(draft), mutate fn reactive draft 的读写
   * ```ts
   * mutate({
   *   fn: draft => draft.xx = 1,
   *   task: async({ setState }){ },
   * });
   * ```
   */
  MUTATE: 'Mutate',
  /**
   * 来自 action setState(draft) 的读写
   * ```ts
   * action(({ setState })=>{
   *   setState();
   * })
   * ```
   */
  ACTION: 'Action',
  /**
   * 来自 top reactive、ins reactive、mutate task reactive draft、action reactive draft 的读写
   * ```ts
   * mutate({
   *   task: async({ draft }){ },
   * });
   *
   * action(async ({ draft })=>{ });
   *
   * const [,,{ reactive }] = atom({a:1});
   *
   * const [ reactive ] = useReactive(someAtom);
   * ```
   */
  REACTIVE: 'Reactive',
  /**
   * 来自伴生 loading 的读写
   */
  LOADING: 'Loading',
  /**
   * 来自 sync 的读写
   * ```ts
   * import { sync } from 'helux';
   * sync(someState)(to=>to.a.b);
   *
   * const [,,{ sync }] = atom({a:1});
   * sync(to=>to.a.b);
   * ```
   */
  SYNC: 'Sync',
} as const;
