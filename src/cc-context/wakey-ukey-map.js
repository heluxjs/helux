/* eslint-disable camelcase */
import { shouldGuessStrictMode, safeGetThenNoDupPush } from '../support/util';

// 依赖收集写入的映射
export const waKey2uKeyMap = {};

// 依赖标记写入的映射，是一个实例化完成就会固化的依赖
// 不采取一开始映射好全部waKey的形式，而是采用safeGet动态添加map映射
export const waKey2staticUKeyMap = {};

function _mapIns(mapContainer, waKey, ccUniqueKey) {
  try {
    mapContainer[waKey][ccUniqueKey] = 1;//处于依赖状态
  } catch (err) {
    const map = {};
    map[ccUniqueKey] = 1;
    mapContainer[waKey] = map;
  }
}

export function makeWaKey(module, stateKey) {
  return `${module}/${stateKey}`;
}

export function mapIns(module, stateKey, ccUniqueKey) {
  _mapIns(waKey2uKeyMap, makeWaKey(module, stateKey), ccUniqueKey);
}

export function mapInsM(modStateKey, ccUniqueKey) {
  _mapIns(waKey2uKeyMap, modStateKey, ccUniqueKey);
}

export function delIns(module, stateKey, ccUniqueKey) {
  delInsM(makeWaKey(module, stateKey), ccUniqueKey)
}

const cUkey2depKeys = {};
export function delInsM(modStateKey, ccUniqueKey) {
  try {
    // 对抗 react 18 里的 strict 双调用模型
    if (shouldGuessStrictMode()) {
      safeGetThenNoDupPush(cUkey2depKeys, ccUniqueKey, modStateKey);
    }

    delete waKey2uKeyMap[modStateKey][ccUniqueKey];
  } catch (err) {
    // do nothing
  }
}

export function mapStaticIns(module, stateKey, ccUniqueKey) {
  _mapIns(waKey2staticUKeyMap, makeWaKey(module, stateKey), ccUniqueKey);
}

export function mapStaticInsM(modStateKey, ccUniqueKey) {
  _mapIns(waKey2staticUKeyMap, modStateKey, ccUniqueKey);
}

const cUkey2staticDepKeys = {};
export function delStaticInsM(modStateKey, ccUniqueKey) {
  try {
    // 对抗 react 18 里的 strict 双调用模型
    if (shouldGuessStrictMode()) {
      safeGetThenNoDupPush(cUkey2staticDepKeys, ccUniqueKey, modStateKey);
    }
    delete waKey2staticUKeyMap[modStateKey][ccUniqueKey];
  } catch (err) {
    // do nothing
  }
}

export function mayRecoverDepRecord(ccUniqueKey) {
  if (shouldGuessStrictMode()) {
    const depKeys = cUkey2depKeys[ccUniqueKey];
    // 恢复时顺带清理掉
    if (depKeys) {
      delete cUkey2depKeys[ccUniqueKey];
      depKeys.forEach(key => mapInsM(key, ccUniqueKey));
    }

    const staticDepKeys = cUkey2staticDepKeys[ccUniqueKey] || [];
    if (staticDepKeys) {
      delete cUkey2staticDepKeys[ccUniqueKey];
      staticDepKeys.forEach(key => mapStaticInsM(key, ccUniqueKey));
    }
  }
}
