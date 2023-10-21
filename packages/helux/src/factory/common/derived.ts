import { IS_ATOM, DERIVE, ASYNC_TYPE, SCOPE_TYPE } from '../../consts';
import { delRunninFnKey, getFnCtxByObj, getFnKey, mapFn, markFnKey, recordValKeyDep, revertDep, runFn } from '../../helpers/fndep';
import { createOb, injectHeluxProto } from '../../helpers/obj';
import { getSharedKey } from '../../helpers/state';
import { dedupList, isFn, isObj, isPromise, nodupPush, noop, warn } from '../../utils';
import type { AsyncType, Dict, Fn, IFnCtx, ScopeType } from '../../types';

function checkResult(fnCtx: IFnCtx, result: Dict) {
  if (!isObj(result) || isPromise(result)) {
    throw new Error('ERR_NON_OBJ: result must be an plain json object!');
  }
  const { isAsync, isAsyncTransfer } = fnCtx;
  // 未标记是异步中转函数时，不允许异步计算函数做结果、共享状态中转
  if (isAsync && !isAsyncTransfer) {
    const fnKey = getFnKey(result);
    const sharedKey = getSharedKey(result);
    if (fnKey || sharedKey) {
      throw new Error('ERR_NON_OBJ: can not transfer another derived result or shared state');
    }
  }
}

export function attachStaticProxyResult(fnCtx: IFnCtx, forAtom: boolean) {
  const proxyResult = createOb(
    fnCtx.result,
    {
      set: () => {
        warn('changing derived result is invalid');
        return false;
      },
      get: (target: Dict, key: any) => {
        if (key === IS_ATOM) {
          return forAtom;
        }
        // copy dep keys
        recordValKeyDep(fnCtx.depKeys, { belongCtx: fnCtx });
        return target[key];
      },
    },
  );
  fnCtx.proxyResult = proxyResult;
  return proxyResult;
}

interface IMapFnCtxOptions {
  deriveFn: Fn;
  careDeriveStatus?: boolean;
  sourceFn?: Fn;
  scopeType?: ScopeType;
  fnCtxBase?: IFnCtx;
  isAsync?: boolean;
  asyncType?: AsyncType;
  allowTransfer?: boolean;
  returnUpstreamResult?: boolean;
  runAsync?: boolean;
  forAtom?: boolean;
}

// TODO allowTransfer 可能可以移除
export function createFnCtx(options: IMapFnCtxOptions) {
  const {
    sourceFn = noop,
    deriveFn,
    isAsync = false,
    scopeType = SCOPE_TYPE.STATIC,
    fnCtxBase,
    allowTransfer = false,
    asyncType = ASYNC_TYPE.NORMAL,
    returnUpstreamResult,
    runAsync = true,
    careDeriveStatus = false,
    forAtom = false,
  } = options;
  if (!isFn(sourceFn) || !isFn(deriveFn)) {
    throw new Error('ERR_NON_FN: only accpet function arg!');
  }
  const fnCtx = mapFn(deriveFn, {
    specificProps: { scopeType, fnType: DERIVE, isAsync, asyncType, isAsyncTransfer: allowTransfer, careDeriveStatus },
    fnCtxBase,
  });

  let source: any = null;
  let result = {};
  const cuParams = { isFirstCall: true, prevResult: null };
  if (!isAsync) {
    result = deriveFn(cuParams);
    source = result;
  } else {
    if (asyncType === 'source') {
      const wrap = sourceFn(cuParams);
      fnCtx.sourceFn = sourceFn;
      source = wrap.source;
      result = wrap.initial;
    } else if (asyncType === 'task') {
      const wrap = deriveFn(cuParams);
      result = wrap.initial;
    }
  }
  if (forAtom) {
    result = { val: result }; // wrap as atom shape
  }

  const curFnKey = fnCtx.fnKey;
  delRunninFnKey();
  checkResult(fnCtx, result);

  // 特殊处理计算结果中转行为
  // const cu1 = derive(...);
  // const cu2 = derive(()=>cu1); // 此处产生结果中转
  if (source) {
    const upstreamFnCtx = getFnCtxByObj(source);
    // 关联上下游函数
    if (upstreamFnCtx) {
      fnCtx.depKeys = dedupList(fnCtx.depKeys.concat(upstreamFnCtx.depKeys));
      // 异步函数已在 checkResult 里保证不能产生结果中转行为，此处只需要针对处于非异步函数场景时赋值为 true 即可
      fnCtx.returnUpstreamResult = returnUpstreamResult ?? !isAsync;
      nodupPush(upstreamFnCtx.nextLevelFnKeys, fnCtx.fnKey);
      nodupPush(fnCtx.prevLevelFnKeys, upstreamFnCtx.fnKey);
      fnCtx.isFirstLevel = false;
    } else if (getSharedKey(source)) {
      // 直接用某个共享状态作为输入源
      fnCtx.depKeys = Object.keys(source);
    }
    revertDep(fnCtx); // 人工补录 valKey 和 fn 的依赖关系
  }

  if (!fnCtx.returnUpstreamResult) {
    // 给 result 和 fn 标记相同的 key
    injectHeluxProto(result);
    markFnKey(result, scopeType, curFnKey);
  }

  if (runAsync && (asyncType === 'source' || asyncType === 'task')) {
    runFn(curFnKey, { isFirstCall: true });
  }

  fnCtx.result = result;

  if (fnCtx.returnUpstreamResult) {
    fnCtx.proxyResult = result; // 返回上游结果，此结果已被代理
  } else {
    attachStaticProxyResult(fnCtx, forAtom);
  }

  return fnCtx;
}
