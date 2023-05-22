/* eslint-disable camelcase */
import { okeys, safeGet } from '../../support/util';

let id = 0;
/** 针对lazy的reducer调用链状态记录缓存map */
const chainId2moduleStateMap = {};
const chainId2isExited = {};
const chainId2isLazy = {};

/** 所有的reducer调用链状态记录缓存map */
const normalChainId_moduleStateMap_ = {};

export function getChainId() {
  id++;
  return id;
}

function __setChainState(chainId, targetModule, partialState, targetId_msMap) {
  if (partialState) {
    const moduleStateMap = safeGet(targetId_msMap, chainId);
    const moduleState = safeGet(moduleStateMap, targetModule);
    Object.assign(moduleState, partialState);
  }
}

export function setChainState(chainId, targetModule, partialState) {
  __setChainState(chainId, targetModule, partialState, chainId2moduleStateMap)
}

export function setAllChainState(chainId, targetModule, partialState) {
  __setChainState(chainId, targetModule, partialState, normalChainId_moduleStateMap_)
}

export function setAndGetChainStateList(isC2Result, chainId, targetModule, partialState) {
  if (!isC2Result) setChainState(chainId, targetModule, partialState);
  return getChainStateList(chainId);
}

export function getChainStateMap(chainId) {
  return chainId2moduleStateMap[chainId];
}

export function getAllChainStateMap(chainId) {
  return normalChainId_moduleStateMap_[chainId];
}

export function getChainStateList(chainId) {
  const moduleStateMap = getChainStateMap(chainId);
  return okeys(moduleStateMap).map(m => ({ module: m, state: moduleStateMap[m] }));
}

export function removeChainState(chainId) {
  delete chainId2moduleStateMap[chainId];
}

export function removeAllChainState(chainId) {
  delete normalChainId_moduleStateMap_[chainId];
}

export function exitChain(chainId) {
  chainId2isExited[chainId] = true;
  removeChainState(chainId)
}

export function isChainExited(chainId) {
  return chainId2isExited[chainId] === true;
}

export function setChainIdLazy(chainId) {
  chainId2isLazy[chainId] = true;
}

export function isChainIdLazy(chainId) {
  return chainId2isLazy[chainId] === true;
}
