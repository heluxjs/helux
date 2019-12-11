import { okeys } from '../../support/util';

let id = 0;
/** 针对lazy的reducer调用链状态记录缓存map */
const chainId_moduleStateMap_ = {};
const chainId_isExited_ = {};
const chainId_isLazy_ = {};

/** 所有的reducer调用链状态记录缓存map */
const normalChainId_moduleStateMap_ = {};

export function getChainId() {
  id++;
  return id;
}

function __setChainState(chainId, targetModule, partialState, targetId_msMap) {
  if (partialState) {
    let moduleStateMap = targetId_msMap[chainId];
    if (!moduleStateMap) moduleStateMap = targetId_msMap[chainId] = {};

    const state = moduleStateMap[targetModule];
    if (!state) {
      moduleStateMap[targetModule] = partialState;
    } else {
      Object.assign(state, partialState);
    }
  }
}

export function setChainState(chainId, targetModule, partialState) {
  __setChainState(chainId, targetModule, partialState, chainId_moduleStateMap_)
}

export function setAllChainState(chainId, targetModule, partialState) {
  __setChainState(chainId, targetModule, partialState, normalChainId_moduleStateMap_)
}

export function setAndGetChainStateList(chainId, targetModule, partialState) {
  setChainState(chainId, targetModule, partialState);
  return getChainStateList(chainId);
}

export function getChainStateMap(chainId) {
  return chainId_moduleStateMap_[chainId];
}

export function getAllChainStateMap(chainId) {
  return normalChainId_moduleStateMap_[chainId];
}

// export function getChainModuleState(chainId, module) {
//   const moduleStateMap = getChainStateMap(chainId);
//   return moduleStateMap[module];
// }

export function getChainStateList(chainId) {
  const moduleStateMap = getChainStateMap(chainId);
  const list = [];
  okeys(moduleStateMap).forEach(m => {
    list.push({ module: m, state: moduleStateMap[m] });
  });
  return list;
}

export function removeChainState(chainId) {
  delete chainId_moduleStateMap_[chainId];
}

export function removeAllChainState(chainId) {
  delete normalChainId_moduleStateMap_[chainId];
}

export function exitChain(chainId) {
  chainId_isExited_[chainId] = true;
  removeChainState(chainId)
}

export function isChainExited(chainId) {
  return chainId_isExited_[chainId] === true;
}

export function setChainIdLazy(chainId) {
  chainId_isLazy_[chainId] = true;
}

export function isChainIdLazy(chainId){
  return chainId_isLazy_[chainId] === true;
}