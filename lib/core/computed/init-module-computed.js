"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var checker = _interopRequireWildcard(require("../checker"));

var util = _interopRequireWildcard(require("../../support/util"));

var safeGetObjectFromObject = util.safeGetObjectFromObject,
    isPlainJsonObject = util.isPlainJsonObject,
    safeGetArrayFromObject = util.safeGetArrayFromObject;
var FN_MSG = "type of computed fn must be a function or object {fn:function}";
var FN_MSG2 = "computedKey is not stateKey, type of computed object must be {fn:function, depKeys:string[]}";

function _default(module, computed) {
  if (!isPlainJsonObject(computed)) {
    throw new Error("StartUpOption.computed." + module + "'s value is not a plain json object!");
  }

  checker.checkModuleName(module, false, "computed." + module + " is invalid");

  var rootState = _ccContext["default"].store.getState();

  var rootComputedValue = _ccContext["default"].computed.getRootComputedValue();

  var rootComputedFn = _ccContext["default"].computed.getRootComputedFn();

  var rootComputedDep = _ccContext["default"].computed.getRootComputedDep();

  var moduleState = rootState[module];
  var moduleComputedDep = safeGetObjectFromObject(rootComputedDep, module, {
    stateKey_retKeys_: {},
    retKey_fn_: {},
    fnCount: 0
  });
  var retKeys = Object.keys(computed);
  retKeys.forEach(function (key) {
    //key可能是stateKey, 也可能是依赖列表的自定义结果key
    var _fn = computed[key];
    if (!_fn) throw new Error(FN_MSG);

    if (moduleState.hasOwnProperty(key)) {
      //is stateKey
      var originalValue = moduleState[key];

      if (originalValue !== undefined) {
        var moduleComputedFn = safeGetObjectFromObject(rootComputedFn, module);

        if (typeof _fn !== 'function') {
          if (typeof _fn !== 'object') {
            throw new Error(FN_MSG);
          }

          if (_fn.hasOwnProperty('depKeys')) {
            throw new Error('computedKey is stateKey, computedFn can not declare with depKeys, rename your computedKey');
          }

          _fn = _fn.fn; // consider: export name = {fn: ()=>{}}

          if (typeof _fn !== 'function') {
            throw new Error(FN_MSG);
          }
        }

        moduleComputedFn[key] = _fn; // 计算并存储modelComputed

        var computedValue = _fn(originalValue, originalValue, moduleState);

        var moduleComputedValue = safeGetObjectFromObject(rootComputedValue, module);
        moduleComputedValue[key] = computedValue;
      } else {
        //strict?
        util.justWarning("computed." + module + "'s key[" + key + "] is not declared in store." + module + "!");
      }
    } else {
      if (typeof _fn !== 'object') throw new Error(FN_MSG2);
      var _fn2 = _fn,
          fn = _fn2.fn,
          depKeys = _fn2.depKeys;
      if (typeof fn !== 'function') throw new Error(FN_MSG2);

      var _depKeys;

      if (depKeys === '*') {
        _depKeys = ['*'];
      } else {
        if (!Array.isArray(depKeys)) throw new Error(FN_MSG2);
        if (depKeys.includes('*')) throw new Error('depKeys can not include *');
        _depKeys = depKeys;
      }

      var stateKey_retKeys_ = moduleComputedDep.stateKey_retKeys_,
          retKey_fn_ = moduleComputedDep.retKey_fn_;
      retKey_fn_[key] = fn;
      moduleComputedDep.fnCount++;

      _depKeys.forEach(function (sKey) {
        var retKeys = safeGetArrayFromObject(stateKey_retKeys_, sKey);
        retKeys.push(key);
      });

      var _computedValue = fn(moduleState, moduleState);

      var _moduleComputedValue = safeGetObjectFromObject(rootComputedValue, module);

      _moduleComputedValue[key] = _computedValue;
    }
  });
}