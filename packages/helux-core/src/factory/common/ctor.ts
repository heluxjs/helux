import { noop, noopArr } from '@helux/utils';
import { IOperateParams } from 'limu';
import { ASYNC_TYPE, FROM, NOT_MOUNT, RENDER_START } from '../../consts';
import type { IFnCtx, IInnerSetStateOptions, IMutateCtx, IMutateFnStdItem } from '../../types/base';
import type { IReactiveMeta } from '../../types/inner';

const { MAY_TRANSFER } = ASYNC_TYPE;
const { SET_STATE } = FROM;
const fakeGetReplaced = () => ({ isReplaced: false, replacedValue: null as any });
const noopAny: (...args: any[]) => any = () => {};

const fnItem = newMutateFnItem();

export function newReactiveMeta(): IReactiveMeta {
  return {
    isTop: true,
    key: '',
    fnKey: '',
    sharedKey: 0,
    moduleName: '',
    depKeys: [],
    writeKeys: [],
    desc: '',
    onRead: undefined,
    from: SET_STATE,
  };
}

export function newMutateCtx(options: IInnerSetStateOptions): IMutateCtx {
  // 用户 setState 可能设定了 ids globalIds
  const { ids = [], globalIds = [], isReactive = false, from = SET_STATE, enableDep = false, handleCbReturn = true } = options;
  return {
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

// export function newMutateFnItem(): MutateFnStdItem {
//   return {
//     fn: noop,
//     onlyDeps: false,
//     depKeys: [],
//     writeKeys: [],
//     oriDesc: '',
//     desc: '',
//     watchKey: '',
//   };
// }

export function newMutateFnItem(partial?: Partial<IMutateFnStdItem>): IMutateFnStdItem {
  const { desc = '', fn = noop, task = noopAny, depKeys = [], writeKeys = [], deps = noopArr, onlyDeps = false, ...rest } = partial || {};
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
