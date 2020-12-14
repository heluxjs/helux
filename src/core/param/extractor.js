import { CC_DISPATCHER, MODULE_GLOBAL } from '../../support/constant';
import { STR_ARR_OR_STAR, INAJ } from '../../support/priv-constant';
import * as util from '../../support/util';
import ccContext from '../../cc-context';
import * as checker from './checker';

const { getModuleStateKeys } = ccContext;

const { verifyKeys, verboseInfo: vbi, okeys } = util;

export function getStoredKeys(belongMotule, refPrivState, ccOptionStoredKeys, regStoredKeys) {
  const targetStoredKeys = ccOptionStoredKeys || regStoredKeys;
  if (!targetStoredKeys) {
    return [];
  }

  const moduleStateKeys = getModuleStateKeys(belongMotule);
  if (targetStoredKeys === '*') {
    // refPrivState里可能含有moduleStateKey，需要进一步过滤
    return okeys(refPrivState).filter(k => !moduleStateKeys.includes(k));
  } else {
    checker.checkStoredKeys(belongMotule, targetStoredKeys);
    return targetStoredKeys;
  }
}

export function getWatchedStateKeys(module, ccClassKey, regWatchedKeys) {
  if (ccClassKey === CC_DISPATCHER) return [];

  if (!regWatchedKeys) return [];

  if (regWatchedKeys === '*') {
    return getModuleStateKeys(module);
  }

  if (regWatchedKeys === '-') {
    return regWatchedKeys;
  }

  const { notArray, keyElementNotString } = verifyKeys(regWatchedKeys, []);
  if (notArray || keyElementNotString) {
    const vbiInfo = vbi(`ccClassKey:${ccClassKey}`);
    throw new Error(`watchedKeys ${STR_ARR_OR_STAR} ${vbiInfo}`);
  }

  return regWatchedKeys;
}

export function getConnect(regConnect) {
  const targetConnect = regConnect || {};// codesandbox lost default value

  if (!util.isPJO(targetConnect, true)) {
    throw new Error(`param connect type error, it ${INAJ} or string array`);
  }
  const isArr = Array.isArray(targetConnect);

  let finalConnect = {};
  if (isArr || typeof targetConnect === 'string') {
    const connectedModules = isArr ? targetConnect : targetConnect.split(',');
    connectedModules.forEach(m => {
      finalConnect[m] = '-'; //标识自动收集观察依赖
    });
  } else {
    finalConnect = regConnect;
  }

  // 未设定连接$$global模块的watchedKeys参数时，自动连接$$global模块，并默认采用依赖收集
  if (!finalConnect[MODULE_GLOBAL]) {
    finalConnect[MODULE_GLOBAL] = '-';
  }

  checker.checkConnectSpec(finalConnect);

  return finalConnect;
}
