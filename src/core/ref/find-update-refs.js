import * as util from '../../support/util';
import ccContext from '../../cc-context';
import * as cache from './_cache';

const { okeys } = util;
const { ccUKey_ref_, waKey_uKeyMap_ } = ccContext;

export default function (moduleName, partialSharedState, renderKey, renderKeyClasses) {

  const sharedStateKeys = okeys(partialSharedState);
  const cacheKey = cache.getCacheKey(moduleName, sharedStateKeys, renderKey, renderKeyClasses);
  const cachedResult = cache.getCache(moduleName, cacheKey);
  if (cachedResult) {
    return { sharedStateKeys, result: cachedResult };
  }

  const targetUKeyMap = {};
  const belongRefs = [];
  const connectRefs = [];
  const excludeMap = {};
  const silentRefMap = {};// 不需要更新，但是需要暗暗的替换state

  sharedStateKeys.forEach(stateKey => {
    const waKey = `${moduleName}/${stateKey}`;
    //利用assign不停的去重
    Object.assign(targetUKeyMap, waKey_uKeyMap_[waKey]);

    const uKeyMap = waKey_uKeyMap_[waKey];
    okeys(uKeyMap).forEach(uKey => {
      if (!excludeMap[uKey]) {//没排除过
        if (uKeyMap[uKey] === 1) {//只要是1，就不用silent了
          excludeMap[uKey] = 1;
          delete silentRefMap[uKey];// 删除可能已加入silentRefMap的uKey
        } else {// 2
          silentRefMap[uKey] = 1;
        }
      }
    });

  });
  const uKeys = okeys(targetUKeyMap);

  const putRef = (isBelong, ref) => {
    isBelong ? belongRefs.push(ref) : connectRefs.push(ref);
  }

  const tryMatch = (ref, toBelong) => {
    const {
      renderKey: refRenderKey, ccClassKey: refCcClassKey,
    } = ref.ctx;

    // 如果调用方携带renderKey发起修改状态动作，则需要匹配renderKey做更新
    if (renderKey) {
      const isRenderKeyMatched = refRenderKey === renderKey;

      // 所有的类实例都受renderKey匹配机制影响
      if (renderKeyClasses === '*') {
        if (isRenderKeyMatched) {
          putRef(toBelong, ref);
        }
      }
      else {
        // 这些指定类实例受renderKey机制影响
        if (renderKeyClasses.includes(refCcClassKey)) {
          if (isRenderKeyMatched) {
            putRef(toBelong, ref);
          }
        }
        // 这些实例则不受renderKey机制影响
        else {
          putRef(toBelong, ref);
        }
      }
    } else {
      putRef(toBelong, ref);
    }

  }

  uKeys.forEach(key => {
    const ref = ccUKey_ref_[key];
    if (!ref) return;

    const refCtx = ref.ctx;
    const {
      module: refModule, connect: refConnect,
    } = refCtx;
    const isBelong = refModule === moduleName;
    const isConnect = refConnect[moduleName] ? true : false;

    if (isBelong) {
      tryMatch(ref, true);
    }
    // 一个实例如果既属于模块x同时也连接了模块x，这是不推荐的，在buildCtx里面已给出警告
    // 会造成冗余的渲染
    if (isConnect) {
      tryMatch(ref, false);
    }
  });

  const result = {
    belong: belongRefs,
    connect: connectRefs,
    silentRefMap,
  };
  cache.setCache(moduleName, cacheKey, result);

  return { sharedStateKeys, result };
}