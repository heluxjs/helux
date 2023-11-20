import { setVal } from 'helux-utils';
import { createOneLevelOb } from '../../helpers/obj';
import type { Dict, Fn, SetState } from '../../types/base';
import { createImmut, getDepKeyByPath } from '../common/util';

export function getEventVal(e: any) {
  let val = e;
  // avoid Warning: This synthetic event is reused for performance reasons. If you're seeing this...
  // call e.persist() @see https://reactjs.org/docs/events.html#event-pooling
  if (e) {
    if (e.persist) e.persist();
    if (e.currentTarget && e.type) {
      val = e.currentTarget.value;
    } else if (e.nativeEvent && e.target) {
      val = e.target.value;
    }
  }
  return val;
}

function createTargetWrap(rawState: Dict) {
  let latestPath: string[] = [];
  // 非 Proxy 环境只支持一层 syncer 值
  const target = createImmut(rawState, ({ fullKeyPath }) => {
    latestPath = fullKeyPath;
  });
  return { target, getPath: () => latestPath };
}

function createSyncFn(setState: Fn, path: string[], before?: Fn) {
  const syncFn = (evOrVal: any) => {
    let val = getEventVal(evOrVal);
    setState(
      (draft: any) => {
        setVal(draft, path, val);
        before?.(val, draft); // 用户设置了想修改其他数据或自身数据的函数
      },
      { from: 'Sync' },
    );
  };
  return syncFn;
}

const dataSyncerCahce = new Map<string, Fn>();
/**
 * 注意 syncer 只能同步一层key的数据，如需要同步多层的，使用 sync 函数
 * <div onClick={syncer.a}></div>
 * @return syncerBuilder
 */
export function createSyncerBuilder(sharedKey: number, rawState: Dict, setState: SetState) {
  const syncer = createOneLevelOb(rawState, {
    get(target, key) {
      let cacheKey = getDepKeyByPath([key], sharedKey);
      let dataSyncer = dataSyncerCahce.get(cacheKey);
      if (!dataSyncer) {
        dataSyncer = createSyncFn(setState, [key]);
        dataSyncerCahce.set(cacheKey, dataSyncer);
      }

      return dataSyncer;
    },
  });
  return syncer;
}

const syncFnCahce = new Map<string, Fn>();
/**
 * <div onClick={sync(t=>t.a.b)}></div>
 * 这里 val 将获得类型提示
 * <div onClick={to(t=>t.a.b, val=>val+1)}></div>
 * @return syncFnBuilder
 */
export function createSyncFnBuilder(sharedKey: number, rawState: Dict, setState: SetState) {
  const targetWrap = createTargetWrap(rawState);
  return (pathOrRecorder: any, before?: (val: any) => any) => {
    let path: string[] = [];
    if (Array.isArray(pathOrRecorder)) {
      path = pathOrRecorder;
    } else {
      pathOrRecorder(targetWrap.target);
      path = targetWrap.getPath();
    }

    let cacheKey = getDepKeyByPath(path, sharedKey);
    if (before) {
      cacheKey += `${before.toString()}`;
    }

    let syncFn = syncFnCahce.get(cacheKey);
    if (!syncFn) {
      syncFn = createSyncFn(setState, path, before);
      syncFnCahce.set(cacheKey, syncFn);
    }

    return syncFn;
  };
}
