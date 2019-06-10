"use strict";

exports.__esModule = true;
exports.getChainId = getChainId;
exports.setChainState = setChainState;
exports.setAndGetChainStateList = setAndGetChainStateList;
exports.getChainStateList = getChainStateList;
exports.removeChainState = removeChainState;
exports.exitChain = exitChain;
exports.isChainExited = isChainExited;
exports.setChainIdLazy = setChainIdLazy;
exports.isChainIdLazy = isChainIdLazy;

var _util = require("../../support/util");

var id = 0;
var chainId_moduleStateMap_ = {};
var chainId_isExited_ = {};
var chainId_isLazy_ = {};

function getChainId() {
  id++;
  return id;
}

function setChainState(chainId, targetModule, partialState) {
  if (partialState) {
    var moduleStateMap = chainId_moduleStateMap_[chainId];
    if (!moduleStateMap) moduleStateMap = chainId_moduleStateMap_[chainId] = {};
    var state = moduleStateMap[targetModule];

    if (!state) {
      moduleStateMap[targetModule] = partialState;
    } else {
      var mergedState = Object.assign(state, partialState);
      moduleStateMap[targetModule] = mergedState;
    }
  }
}

function setAndGetChainStateList(chainId, targetModule, partialState) {
  setChainState(chainId, targetModule, partialState);
  return getChainStateList(chainId);
}

function getChainStateList(chainId) {
  var moduleStateMap = chainId_moduleStateMap_[chainId];
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