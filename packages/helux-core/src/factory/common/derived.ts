import { dedupList, enureReturnArr, isFn, isObj, isPromise, nodupPush, noop, tryAlert, warn } from '@helux/utils';
import { ASYNC_TYPE, DERIVE, IS_DERIVED_ATOM, SCOPE_TYPE } from '../../consts';
import { recordBlockDepKey } from '../../helpers/blockDep';
import { markFnEnd, markFnStart, registerFn, shouldShowComputing } from '../../helpers/fnCtx';
import { ensureFnDepData, recordFnDepKeys } from '../../helpers/fnDep';
import { runFn } from '../../helpers/fnRunner';
import { createOb } from '../../helpers/obj';
import { getSharedKey } from '../../helpers/state';
import type { Dict, Fn, ICreateDeriveLogicOptions, IFnCtx } from '../../types/base';
import { recordLastest } from './blockScope';
import { getFnCtxByObj, getFnKey, markFnKey } from './fnScope';

const { TASK } = ASYNC_TYPE;
const { STATIC, HOOK } = SCOPE_TYPE;

function checkResult(fnCtx: IFnCtx, result: Dict, forAtom?: boolean) {
  if (!forAtom) {
    if (!isObj(result) || isPromise(result)) {
      throw new Error('ERR_NON_OBJ: derive,deriveAsync expect result to be a plain object');
    }
  }
  const { isAsync, isAsyncTransfer } = fnCtx;
  // 未标记是异步中转函数时，不允许异步计算函数做结果、共享状态中转
  if (isAsync && !isAsyncTransfer) {
    const fnKey = getFnKey(result);
    const sharedKey = getSharedKey(result);
    // 返回自身结果是 ok 的，捕捉到错误时，需要返回自身结果兜底
    if ((fnKey && fnCtx.fnKey !== fnKey) || sharedKey) {
      throw new Error(
        'ERR_INVALID_CALL: derive,deriveAsync can not transfer another derived result or shared state, it will cause wrong result',
      );
    }
  }
}

export function attachStaticProxyResult(fnCtx: IFnCtx, forAtom: boolean) {
  // LABEL: proxyResult
  const proxyResult = createOb(fnCtx.result, {
    set: () => {
      warn('changing derived result is invalid');
      return false;
    },
    get: (target: Dict, key: any) => {
      if (key === IS_DERIVED_ATOM) {
        return forAtom;
      }
      const val = target[key];
      // copy depKeys
      recordFnDepKeys(fnCtx.depKeys, { belongCtx: fnCtx });
      // transfer depKeys for block or signal
      recordBlockDepKey(fnCtx.depKeys, proxyResult);
      recordLastest(0, val, proxyResult, '', [key], true, forAtom);
      return val;
    },
  });
  fnCtx.proxyResult = proxyResult;
  return proxyResult;
}

interface IInitDeriveFnOptions extends ICreateDeriveLogicOptions {
  fn?: Fn;
  task?: Fn;
  deps?: Fn;
  sourceFn?: Fn;
}

function transferDep(fnCtx: IFnCtx, options: any) {
  const upstreamFnCtx = getFnCtxByObj(options.result);
  // 特殊处理计算结果中转行为
  // const cu1 = derive(...);
  // const cu2 = derive(()=>cu1); // 此处产生结果中转
  if (upstreamFnCtx) {
    // 关联上下游函数
    fnCtx.depKeys = dedupList(fnCtx.depKeys.concat(upstreamFnCtx.depKeys));
    nodupPush(upstreamFnCtx.nextLevelFnKeys, fnCtx.fnKey);
    nodupPush(fnCtx.prevLevelFnKeys, upstreamFnCtx.fnKey);
    fnCtx.isFirstLevel = false;
    options.isUpstream?.();
  }
}

/**
 * 初始化 derive 函数，主要包含函数注册、函数运行、生成代理结果 3 个步骤
 */
export function initDeriveFn(options: IInitDeriveFnOptions) {
  const {
    scopeType = STATIC,
    fnCtxBase,
    // 目前仅 hook 函数支持转移异步结果
    isAsyncTransfer = false,
    asyncType = TASK,
    returnUpstreamResult,
    runAsync = true,
    forAtom = false,
    immediate,
  } = options;
  if (!isFn(options.fn)) {
    throw new Error('ERR_NON_FN: derive need fn arg!');
  }
  const { fn = noop, deps = noop, task } = options;
  const deriveFn = (params: Dict) => {
    const list = enureReturnArr(deps);
    if (params.isFirstCall) {
      list.forEach((result: any) => transferDep(fnCtx, { result }));
    }
    return fn({ ...params, input: list });
  };
  const isAsync = options.isAsync ?? isFn(task); // task 是不是异步函数后续执行会做检查
  const showLoading = options.showLoading ?? isAsync;

  const fnCtx = registerFn(deriveFn, {
    specificProps: { forAtom, scopeType, fnType: DERIVE, task, deps, isAsync, asyncType, isAsyncTransfer, showLoading },
    fnCtxBase,
  });

  markFnStart(fnCtx.fnKey);
  let result = deriveFn({ isFirstCall: true, prevResult: null, triggerReasons: [] });
  markFnEnd();

  const upstreamFnCtx = getFnCtxByObj(result);
  if (forAtom && !upstreamFnCtx) {
    // 非结果中转
    result = { val: result }; // wrap as atom shape
  }
  const curFnKey = fnCtx.fnKey;
  checkResult(fnCtx, result);

  transferDep(fnCtx, {
    result,
    isUpstream: () => {
      // 异步函数已在 checkResult 里保证不能产生结果中转行为，此处只需要针对处于非异步函数场景时赋值为 true 即可
      fnCtx.returnUpstreamResult = returnUpstreamResult ?? !isAsync;
    },
  });
  ensureFnDepData(fnCtx); // 人工补录 depKey 和 fn 的依赖关系

  if (!fnCtx.returnUpstreamResult) {
    // 给 result 和 fn 标记相同的 key
    markFnKey(result, scopeType, curFnKey);
  }

  // ATTENTION 用户设置了 immediate 的话，仅对第一层函数有效
  // if (runAsync && asyncType === TASK && immediate && fnCtx.isFirstLevel) {
  // 是否实现上述 ATTENTION 条件语句里有无 fnCtx.isFirstLeve 的差异，效果见 LabDriveOfIsFirstLevel
  // 目前定的策略是用户定义了 immediate 就立即执行

  // 此处和 mutateFn 的 task 触发逻辑保持一致
  // 第一次调用时，如未显示定义 immediate 值，则触发规律是没有 fn 则执行，有 fn 则不执行
  const canRunTask = runAsync && asyncType === TASK && (immediate ?? !options.fn);
  if (task && canRunTask) {
    runFn(curFnKey, { isFirstCall: true, sn: fnCtx.renderInfo.sn + 1 })
      .then((data: any) => {
        checkResult(fnCtx, data, forAtom);
      })
      .catch((err: any) => tryAlert(err));
  }

  fnCtx.result = result;

  // 组件使用 useDerived 创建完 fnCtx 后，补上正在计算的状态
  if (scopeType === HOOK && shouldShowComputing(fnCtx)) {
    fnCtx.setLoading(true);
  }

  if (fnCtx.returnUpstreamResult) {
    fnCtx.proxyResult = result; // 返回上游结果，此结果已被代理
  } else {
    attachStaticProxyResult(fnCtx, forAtom);
  }

  return fnCtx;
}
