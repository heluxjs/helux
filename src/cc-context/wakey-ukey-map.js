/* eslint-disable camelcase */

// 依赖收集写入的映射
export const waKey_uKeyMap_ = {};

// 依赖标记写入的映射，是一个实例化完成就会固化的依赖
// 不采取一开始映射好全部waKey的形式，而是采用safeGet动态添加map映射
export const waKey_staticUKeyMap_ = {};

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
  _mapIns(waKey_uKeyMap_, makeWaKey(module, stateKey), ccUniqueKey);
}

export function mapInsM(modStateKey, ccUniqueKey) {
  _mapIns(waKey_uKeyMap_, modStateKey, ccUniqueKey);
}

export function delIns(module, stateKey, ccUniqueKey) {
  delInsM(makeWaKey(module, stateKey), ccUniqueKey)
}

export function delInsM(modStateKey, ccUniqueKey) {
  try {
    delete waKey_uKeyMap_[modStateKey][ccUniqueKey];
  } catch (err) {
    // do nothing
  }
}

export function mapStaticIns(module, stateKey, ccUniqueKey) {
  _mapIns(waKey_staticUKeyMap_, makeWaKey(module, stateKey), ccUniqueKey);
}

export function mapStaticInsM(modStateKey, ccUniqueKey) {
  _mapIns(waKey_staticUKeyMap_, modStateKey, ccUniqueKey);
}

export function delStaticInsM(modStateKey, ccUniqueKey) {
  try {
    delete waKey_staticUKeyMap_[modStateKey][ccUniqueKey];
  } catch (err) { 
    // do nothing
  }
}
