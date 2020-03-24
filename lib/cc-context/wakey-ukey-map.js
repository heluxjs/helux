"use strict";

exports.__esModule = true;
exports.makeWaKey = makeWaKey;
exports.mapIns = mapIns;
exports.mapInsM = mapInsM;
exports.delIns = delIns;
exports.delInsM = delInsM;
exports.mapStaticIns = mapStaticIns;
exports.mapStaticInsM = mapStaticInsM;
exports.delStaticInsM = delStaticInsM;
exports.waKey_staticUKeyMap_ = exports.waKey_uKeyMap_ = void 0;

var _util = require("../support/util");

// 依赖收集写入的映射
var waKey_uKeyMap_ = {}; // 依赖标记写入的映射，是一个实例化完成就会固化的依赖
// 不采取一开始映射好全部waKey的形式，而是采用safeGet动态添加map映射

exports.waKey_uKeyMap_ = waKey_uKeyMap_;
var waKey_staticUKeyMap_ = {};
exports.waKey_staticUKeyMap_ = waKey_staticUKeyMap_;

function _mapIns(mapContainer, waKey, ccUniqueKey) {
  try {
    mapContainer[waKey][ccUniqueKey] = 1; //处于依赖状态
  } catch (err) {
    var map = {};
    map[ccUniqueKey] = 1;
    mapContainer[waKey] = map;
  }
}

function makeWaKey(module, stateKey) {
  return module + "/" + stateKey;
}

function mapIns(module, stateKey, ccUniqueKey) {
  _mapIns(waKey_uKeyMap_, makeWaKey(module, stateKey), ccUniqueKey);
}

function mapInsM(modStateKey, ccUniqueKey) {
  _mapIns(waKey_uKeyMap_, modStateKey, ccUniqueKey);
}

function delIns(module, stateKey, ccUniqueKey) {
  delInsM(makeWaKey(module, stateKey), ccUniqueKey);
}

function delInsM(modStateKey, ccUniqueKey) {
  try {
    delete waKey_uKeyMap_[modStateKey][ccUniqueKey];
  } catch (err) {}
}

function mapStaticIns(module, stateKey, ccUniqueKey) {
  _mapIns(waKey_staticUKeyMap_, makeWaKey(module, stateKey), ccUniqueKey);
}

function mapStaticInsM(modStateKey, ccUniqueKey) {
  _mapIns(waKey_staticUKeyMap_, modStateKey, ccUniqueKey);
}

function delStaticInsM(modStateKey, ccUniqueKey) {
  try {
    delete waKey_staticUKeyMap_[modStateKey][ccUniqueKey];
  } catch (err) {}
}