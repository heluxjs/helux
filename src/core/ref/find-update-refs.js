import * as util from '../../support/util';
import ccContext from '../../cc-context';
import * as cache from './_cache';

const { okeys } = util;
const { ccUKey_ref_, module_ccUKeys_, moduleName_stateKeys_ } = ccContext;

const getBelongWatchedKeys = (ctx) => {
  if (ctx.watchedKeys === '-') return ctx.__$$preparedWatchedKeys;
  else return ctx.watchedKeys;
}
const getConnectWatchedKeys  = (ctx, module) => {
  const connect = ctx.connect;
  if (Array.isArray(connect)) {// auto observe connect modules
    return ctx.__$$preparedModuleWatchedKeys_[module];
  } else {
    const waKeys = connect[module];
    if (waKeys === '*') return moduleName_stateKeys_[module];
    else if (waKeys === '-') return ctx.__$$preparedModuleWatchedKeys_[module];
    else return waKeys;
  }
}


export default function (moduleName, partialSharedState, renderKey, renderKeyClasses) {

  const { ver, keys } = module_ccUKeys_[moduleName];
  const sharedStateKeys = okeys(partialSharedState);
  const cacheKey = cache.getCacheKey(moduleName, sharedStateKeys, renderKey, renderKeyClasses);
  const cachedResult = cache.getCache(moduleName, cacheKey);
  if (cachedResult) {
    if (cachedResult.ver === ver) {
      // console.log(`%c hit cache`, 'color:red');
      // console.log(cachedResult.result);
      return { sharedStateKeys, result: cachedResult.result };
    } else {
      cache.setCache(moduleName, cacheKey, null);
    }
  }

  const sharedStateKeyMap = sharedStateKeys.reduce((map, curKey) => {
    map[curKey] = 1;
    return map;
  }, {});

  const belongRefs = [];
  const connectRefs = [];

  const putRef = (isBelong, ref) => {
    isBelong ? belongRefs.push(ref) : connectRefs.push(ref);
  }

  const tryMatch = (ref, preparedWatchedKeys, toBelong) => {
    const len = preparedWatchedKeys.length;
    const {
      renderKey: refRenderKey, ccClassKey: refCcClassKey,
    } = ref.ctx;

    for (let i = 0; i < len; i++) {
      const watchedKey = preparedWatchedKeys[i];

      //命中一个观察Key即可跳出
      if (sharedStateKeyMap[watchedKey]) {

        // 如果调用方携带renderKey发起修改状态动作，则需要匹配renderKey做更新
        if (renderKey) {
          const isRenderKeyMatched = refRenderKey === renderKey;

          // 所有的类实例都受renderKey匹配机制影响
          if (renderKeyClasses === '*') {
            if (isRenderKeyMatched) {
              putRef(toBelong, ref);
              break;
            }
          }
          else {
            // 这些指定类实例受renderKey机制影响
            if (renderKeyClasses.includes(refCcClassKey)) {
              if (isRenderKeyMatched) {
                putRef(toBelong, ref);
                break;
              }
            }
            // 这些实例则不受renderKey机制影响
            else {
              putRef(toBelong, ref);
              break;
            }
          }
        } else {
          putRef(toBelong, ref);
          break;
        }

      }
    }
  }

  keys.forEach(key => {
    const ref = ccUKey_ref_[key];
    if (!ref) return;
    
    const refCtx = ref.ctx;
    const {
      module: refModule, connect: refConnect,
    } = refCtx;
    const isBelong = refModule === moduleName;
    const isConnect = refConnect[moduleName] ? true : false;

    if (isBelong) {
      tryMatch(ref, getBelongWatchedKeys(refCtx), true);
    }
    // 一个实例可能既属于也连接了某个某个模块，这是不推荐的，在buildCtx里面已给出警告
    // 会造成冗余的渲染
    if (isConnect) {
      tryMatch(ref, getConnectWatchedKeys(refCtx, moduleName), false);
    }
  });

  const result = {
    belong: belongRefs,
    connect: connectRefs,
  };
  cache.setCache(moduleName, cacheKey, { ver, result });

  return { sharedStateKeys, result };
}