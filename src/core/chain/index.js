import { okeys } from '../../support/util';

let id = 0;
const chainId_moduleStateMap_ = {};
const chainId_isExited_ = {};
const chainId_isLazy_ = {};

export function getChainId() {
  id++;
  return id;
}

export function setChainState(chainId, targetModule, partialState) {
  if (partialState) {
    let moduleStateMap = chainId_moduleStateMap_[chainId];
    if (!moduleStateMap) moduleStateMap = chainId_moduleStateMap_[chainId] = {};

    const state = moduleStateMap[targetModule];
    if (!state) {
      moduleStateMap[targetModule] = partialState;
    } else {
      const mergedState = Object.assign(state, partialState);
      moduleStateMap[targetModule] = mergedState;
    }
  }
}

export function setAndGetChainStateList(chainId, targetModule, partialState) {
  setChainState(chainId, targetModule, partialState);
  return getChainStateList(chainId);
}

export function getChainStateList(chainId) {
  const moduleStateMap = chainId_moduleStateMap_[chainId];
  const list = [];
  okeys(moduleStateMap).forEach(m => {
    list.push({ module: m, state: moduleStateMap[m] });
  });
  return list;
}

export function removeChainState(chainId) {
  delete chainId_moduleStateMap_[chainId];
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