import { isJsObj, setVal } from '@helux/utils';
import { FROM, UNDEFINED } from '../../consts';
import { createDpOb } from '../../helpers/obj';
import type { Dict, Fn, InnerSetState } from '../../types/base';
import { createImmut, getDepKeyByPath } from '../common/util';
import type { TInternal } from './buildInternal';
import { DRAFT_ROOT } from './current';

export function getEventVal(e: any) {
  let val = e;
  // avoid Warning: This synthetic event is reused for performance reasons. If you're seeing this...
  // call e.persist() @see https://reactjs.org/docs/events.html#event-pooling
  if (e) {
    if (e.persist) e.persist();
    const { currentTarget } = e;
    if (currentTarget && e.type) {
      // 针对 <input type='checkbox' /> 标签不能取 value，要特殊处理下
      if (currentTarget.tagName === 'INPUT' && currentTarget.type === 'checkbox') {
        val = currentTarget.checked;
      } else {
        val = currentTarget.value;
      }
    } else if (e.nativeEvent && e.target) {
      val = e.target.value;
    }
  }
  return val;
}

function createTargetWrap(rawState: Dict, disableProxy: boolean, sourceId: string) {
  let latestPath: string[] = [];
  // 非 Proxy 环境只支持一层 syncer 值
  const target = createImmut(rawState, ({ fullKeyPath }) => {
    latestPath = fullKeyPath;
  }, disableProxy, sourceId);
  return { target, getPath: () => latestPath };
}

function createSyncFn(innerSetState: InnerSetState, path: string[], before?: Fn) {
  const syncFn = (evOrVal: any) => {
    let val = getEventVal(evOrVal);
    innerSetState(
      (draft: any) => {
        // 透传 draftRoot 给用户，方便对 primitive atom 做赋值操作
        const { isAtom, draftRoot } = DRAFT_ROOT.current();
        const params = { draft, draftRoot, path, isAtom, UNDEFINED };
        // before函数里用户还可以修改其他数据或返回 path 对应的数据新值
        const newVal = before?.(val, params);
        setVal(draftRoot, path, newVal !== undefined ? newVal : val);
      },
      { from: FROM.SYNC },
    );
  };
  return syncFn;
}

function syncerFn(keyPath: string[], internal: TInternal) {
  const { sharedKey, innerSetState } = internal;
  let cacheKey = getDepKeyByPath(keyPath, sharedKey);
  let dataSyncer = dataSyncerCahce.get(cacheKey);
  if (!dataSyncer) {
    dataSyncer = createSyncFn(innerSetState, keyPath);
    dataSyncerCahce.set(cacheKey, dataSyncer);
  }
  return dataSyncer;
}

const dataSyncerCahce = new Map<string, Fn>();
/**
 * 注意 syncer 只能同步一层key的数据，如需要同步多层的，使用 sync 函数
 * ```jsx
 * <div onClick={syncer.a}></div>
 * ```
 * @return syncerBuilder
 */
export function createSyncerBuilder(internal: TInternal) {
  const { forAtom, rawState } = internal;
  if (forAtom) {
    // 原始值 atom，用户可使用 syncer 直接绑定
    // <div onClick={syncer}></div>
    if (!isJsObj(rawState.val)) {
      return syncerFn(['val'], internal);
    }

    // 对象结果自动拆箱，对 rawState.val 的各个 key 做 syncer 函数集合
    return createDpOb(rawState.val, {
      get: (target, key) => syncerFn(['val', key], internal),
    });
  }

  return createDpOb(rawState, {
    get: (target, key) => syncerFn([key], internal),
  });
}

const syncFnCahce = new Map<string, Fn>();

/**
 * @example
 * ```jsx
 * <div onClick={sync(t=>t.a.b)}></div>
 * // 这里 val 将获得类型提示
 * <div onClick={to(t=>t.a.b, val=>val+1)}></div>
 * ```
 * @return syncFnBuilder
 */
export function createSyncFnBuilder(internal: TInternal) {
  const { forAtom, sharedKey, innerSetState, rawState, disableProxy } = internal;
  const targetWrap = createTargetWrap(rawState, disableProxy, String(sharedKey));
  return (pathOrRecorder: any, before?: (val: any) => any) => {
    let path: string[] = [];
    if (Array.isArray(pathOrRecorder)) {
      // atom 自动补齐 val
      path = forAtom ? ['val', ...pathOrRecorder] : pathOrRecorder;
    } else {
      const { target, getPath } = targetWrap;
      // atom sync 读路径回调自动拆箱
      pathOrRecorder(forAtom ? target.val : target);
      path = getPath();
    }

    let cacheKey = getDepKeyByPath(path, sharedKey);
    if (before) {
      cacheKey += `${before.toString()}`;
    }

    let syncFn = syncFnCahce.get(cacheKey);
    if (!syncFn) {
      syncFn = createSyncFn(innerSetState, path, before);
      syncFnCahce.set(cacheKey, syncFn);
    }

    return syncFn;
  };
}
