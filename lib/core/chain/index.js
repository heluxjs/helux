"use strict";

exports.__esModule = true;
exports.getChainId = getChainId;
exports.setChainState = setChainState;
exports.setAllChainState = setAllChainState;
exports.setAndGetChainStateList = setAndGetChainStateList;
exports.getChainStateMap = getChainStateMap;
exports.getAllChainStateMap = getAllChainStateMap;
exports.getChainStateList = getChainStateList;
exports.removeChainState = removeChainState;
exports.removeAllChainState = removeAllChainState;
exports.exitChain = exitChain;
exports.isChainExited = isChainExited;
exports.setChainIdLazy = setChainIdLazy;
exports.isChainIdLazy = isChainIdLazy;

var _util = require("../../support/util");

var id = 0;
/** 针对lazy的reducer调用链状态记录缓存map */

var chainId_moduleStateMap_ = {};
var chainId_isExited_ = {};
var chainId_isLazy_ = {};
/** 所有的reducer调用链状态记录缓存map */

var normalChainId_moduleStateMap_ = {};

function getChainId() {
  id++;
  return id;
}

function __setChainState(chainId, targetModule, partialState, targetId_msMap) {
  if (partialState) {
    var moduleStateMap = targetId_msMap[chainId];
    if (!moduleStateMap) moduleStateMap = targetId_msMap[chainId] = {};
    var state = moduleStateMap[targetModule];

    if (!state) {
      moduleStateMap[targetModule] = partialState;
    } else {
      Object.assign(state, partialState);
    }
  }
}

function setChainState(chainId, targetModule, partialState) {
  __setChainState(chainId, targetModule, partialState, chainId_moduleStateMap_);
}

function setAllChainState(chainId, targetModule, partialState) {
  __setChainState(chainId, targetModule, partialState, normalChainId_moduleStateMap_);
}

function setAndGetChainStateList(chainId, targetModule, partialState) {
  setChainState(chainId, targetModule, partialState);
  return getChainStateList(chainId);
}

function getChainStateMap(chainId) {
  return chainId_moduleStateMap_[chainId];
}

function getAllChainStateMap(chainId) {
  return normalChainId_moduleStateMap_[chainId];
} // export function getChainModuleState(chainId, module) {
//   const moduleStateMap = getChainStateMap(chainId);
//   return moduleStateMap[module];
// }


function getChainStateList(chainId) {
  var moduleStateMap = getChainStateMap(chainId);
  var list = [];
  (0, _util.okeys)(moduleStateMap).forEach(function (m) {
    list.push({
      module: m,
      state: moduleStateMap[m]
    });
  });
  return list;
}

function removeChainState(chainId) {
  delete chainId_moduleStateMap_[chainId];
}

function removeAllChainState(chainId) {
  delete normalChainId_moduleStateMap_[chainId];
}

function exitChain(chainId) {
  chainId_isExited_[chainId] = true;
  removeChainState(chainId);
}

function isChainExited(chainId) {
  return chainId_isExited_[chainId] === true;
}

function setChainIdLazy(chainId) {
  chainId_isLazy_[chainId] = true;
}

function isChainIdLazy(chainId) {
  return chainId_isLazy_[chainId] === true;
}