import { noop, noopArr } from '@helux/utils';
import { IOperateParams } from 'limu';
import { ASYNC_TYPE, FROM, NOT_MOUNT, RENDER_START } from '../../consts';
import type { From, IFnCtx, IMutateCtx, IMutateFnStdItem, ISetFactoryOpts, OnOperate } from '../../types/base';
import type { IReactiveMeta } from '../../types/inner';
import { genRenderSN } from './key';

const { MAY_TRANSFER } = ASYNC_TYPE;
const { SET_STATE, REACTIVE } = FROM;
const fakeGetReplaced = () => ({ isReplaced: false, replacedValue: null as any });
const noopAny: (...args: any[]) => any = () => {};

const fnItem = newMutateFnItem({ isFake: true });

export interface IBuildReactiveOpts {
  isTop?: boolean;
  depKeys?: string[];
  desc?: string;
  onRead?: OnOperate;
  from?: From;
  expired?: boolean;
  insKey?: number;
}

export function newReactiveMeta(draft: any, buildOptions: IBuildReactiveOpts, finish: any = noop): IReactiveMeta {
  const { desc = '', onRead, from = REACTIVE, depKeys = [], isTop = false, expired = false, insKey = 0 } = buildOptions;
  return {
    draft,
    finish,
    modified: false,
    expired,
    sharedKey: 0,
    moduleName: '',
    hasFlushTask: false,
    nextTickFlush: noop,
    data: [],
    isTop,
    key: '',
    fnKey: '',
    depKeys,
    writeKeys: [],
    desc,
    onRead,
    from,
    insKey,
  };
}

export function newMutateCtx(options: ISetFactoryOpts): IMutateCtx {
  const {
    ids = [],
    globalIds = [],
    isReactive = false,
    from = SET_STATE,
    enableDep = false,
    handleCbReturn = true,
    sn = genRenderSN(),
    isFirstCall = false,
    desc = '',
    onRead,
  } = options;
  return {
    fnKey: '',
    depKeys: [],
    forcedDepKeys: [],
    triggerReasons: [],
    ids,
    globalIds,
    readKeys: {},
    writeKeys: {},
    arrKeyDict: {}, // 记录读取过程中遇到的数组 key
    writeKeyPathInfo: {},
    handleCbReturn,
    draftVal: null,
    from,
    isReactive,
    enableDep,
    sn,
    isFirstCall,
    desc,
    onRead,
  };
}

export function newOpParams(
  key: string,
  value: any,
  options: { isChanged?: boolean; parentKeyPath: string[]; op?: any; parentType?: any },
): IOperateParams {
  const { isChanged = true, parentKeyPath = [], op = 'set', parentType = 'Object' } = options;
  const fullKeyPath = parentKeyPath.slice();
  fullKeyPath.push(key);
  return {
    isChanged,
    isCustom: false,
    op,
    immutBase: false,
    key,
    value,
    proxyValue: value,
    parentType,
    keyPath: parentKeyPath,
    fullKeyPath,
    isBuiltInFnKey: false,
    replaceValue: noop,
    getReplaced: fakeGetReplaced,
  };
}

export function newMutateFnItem(partial?: Partial<IMutateFnStdItem>): IMutateFnStdItem {
  const {
    desc = '',
    fn = noop,
    task = noopAny,
    depKeys = [],
    writeKeys = [],
    deps = noopArr,
    isFake = false,
    onlyDeps = false,
    ...rest
  } = partial || {};
  const base: IMutateFnStdItem = {
    fn,
    task,
    deps,
    oriDesc: '',
    onlyDeps,
    desc,
    depKeys,
    writeKeys,
    checkDeadCycle: undefined,
    watchKey: '',
    isFake,
    enabled: true,
    ...rest,
  };
  return base;
}

export function newFnCtx() {
  const base: IFnCtx = {
    fnKey: '', // 在 feDep.mapFn 阶段会生成
    fn: noop,
    subFnInfo: fnItem,
    checkDeadCycle: true,
    isFirstLevel: true,
    isExpired: false,
    task: noop,
    deps: noopArr,
    status: { loading: false, err: null, ok: true },
    forAtom: false,
    remainRunCount: 0,
    showLoading: false,
    nextLevelFnKeys: [],
    prevLevelFnKeys: [],
    mountStatus: NOT_MOUNT,
    depKeys: [],
    depSharedKeys: [],
    result: {},
    fnType: 'watch',
    returnUpstreamResult: false,
    scopeType: 'static',
    renderStatus: RENDER_START,
    proxyResult: {},
    updater: noop,
    createTime: Date.now(),
    shouldReplaceResult: false,
    isAsync: false,
    isAsyncTransfer: false,
    isSimpleWatch: false,
    isRunning: false,
    dcErrorInfo: { err: null, tipFn: noop },
    asyncType: MAY_TRANSFER,
    subscribe: (cb: any) => {
      cb();
    },
    extra: {},
    setLoading: (loading: boolean, err = null) => {
      const ok = !loading && !err;
      base.status = { loading, err, ok };
    },
    renderInfo: {
      time: 0,
      insKey: 0,
      sn: 0,
      getDeps: () => base.depKeys.slice(),
    },
  };
  return base;
}
