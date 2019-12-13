"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = require("../../support/util");

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_;
/**
computed('foo/firstName', ()=>{});

computed('foo/firstName', {
  fn: ()=>{},
  compare: false,
  depKeys: ['firstName'],
});

computed({
  'foo/firstName':()=>{},
  'foo/fullName':{
    fn:()=>{},
    depKeys:['firstName', 'lastName']
  }
});

computed(ctx=>({
  'foo/firstName':()=>{},
  'foo/fullName':{
    fn:()=>{},
    depKeys:['firstName', 'lastName']
  }
}))
*/
// cate: module | ref

function _default(cate, confMeta, item, handler, depKeys, compare, immediate) {
  if (!item) return;
  var itype = typeof item;

  var _descObj;

  if (itype === 'string') {
    var _descObj2, _descObj3;

    if (typeof handler === 'object') _descObj = (_descObj2 = {}, _descObj2[item] = handler, _descObj2);else _descObj = (_descObj3 = {}, _descObj3[item] = {
      fn: handler,
      depKeys: depKeys,
      compare: compare,
      immediate: immediate
    }, _descObj3);
  } else if (itype === 'object') {
    _descObj = item;
  } else if (itype === 'function') {
    _descObj = item(confMeta.refCtx);
    if (!(0, _util.isPlainJsonObject)(_descObj)) throw new Error("type of " + confMeta.type + " callback result must be an object");
  }

  if (!_descObj) return;

  _parseDescObj(cate, confMeta, _descObj);
}

;

function _parseDescObj(cate, confMeta, descObj) {
  var computedCompare = _ccContext["default"].computedCompare,
      watchCompare = _ccContext["default"].watchCompare,
      watchImmediate = _ccContext["default"].watchImmediate; //读全局的默认值

  var defaultCompare = confMeta.type === 'computed' ? computedCompare : watchCompare;
  (0, _util.okeys)(descObj).forEach(function (key) {
    var val = descObj[key];
    var vType = typeof val; // 解释key，提取相关信息

    var _resolveKey2 = _resolveKey(cate, confMeta, key),
        isStateKey = _resolveKey2.isStateKey,
        module = _resolveKey2.module,
        retKey = _resolveKey2.retKey;

    var depKeysOfStateKey = isStateKey ? [retKey] : [];

    if (vType === 'function') {
      _mapDepDesc(confMeta, key, module, retKey, val, depKeysOfStateKey, watchImmediate, defaultCompare);

      return;
    }

    if (vType === 'object') {
      var fn = val.fn,
          depKeys = val.depKeys,
          _val$immediate = val.immediate,
          immediate = _val$immediate === void 0 ? watchImmediate : _val$immediate,
          _val$compare = val.compare,
          compare = _val$compare === void 0 ? defaultCompare : _val$compare;

      var _depKeys = depKeys || depKeysOfStateKey;

      _mapDepDesc(confMeta, key, module, retKey, fn, _depKeys, immediate, compare);
    }
  });
} // 映射依赖描述对象


function _mapDepDesc(confMeta, key, module, retKey, fn, depKeys, immediate, compare) {
  var dep = confMeta.dep;
  var moduleDepDesc = (0, _util.safeGetObjectFromObject)(dep, module, {
    retKey_fn_: {},
    stateKey_retKeys_: {},
    fnCount: 0
  });
  var retKey_fn_ = moduleDepDesc.retKey_fn_,
      stateKey_retKeys_ = moduleDepDesc.stateKey_retKeys_;

  if (retKey_fn_[retKey]) {
    if (!_ccContext["default"].isHotReloadMode()) throw new Error("key[" + retKey + "] already declared!");else (0, _util.justTip)("key[" + retKey + "] may duplicate, but now is hot reload mode, you can ignore this tip if you can make sure it is unique");
  }

  var _depKeys = depKeys;

  if (depKeys === '*') {
    _depKeys = ['*'];
  }

  if (!Array.isArray(_depKeys)) {
    throw new Error("depKeys can only be an Array<string> or string *, --verbose-info: key[" + key + "]");
  }

  retKey_fn_[retKey] = {
    fn: fn,
    immediate: immediate,
    compare: compare,
    depKeys: depKeys
  };
  moduleDepDesc.fnCount++;
  var refCtx = confMeta.refCtx;

  if (refCtx) {
    if (confMeta.type === 'computed') refCtx.hasComputedFn = true;else refCtx.hasWatchFn = true;
  }

  _depKeys.forEach(function (sKey) {
    //一个依赖key列表里的stateKey会对应着多个结果key
    var retKeys = (0, _util.safeGetArrayFromObject)(stateKey_retKeys_, sKey);
    retKeys.push(retKey);
  });
}

function _resolveKey(cate, confMeta, key) {
  var _module = confMeta.module,
      _retKey = key,
      _stateKeys;

  if (key.includes('/')) {
    if (cate === _constant.CATE_MODULE) throw new Error("key[" + key + "] is invalid, can not include slash");

    var _key$split = key.split('/'),
        module = _key$split[0],
        retKey = _key$split[1];

    if (module) _module = module; // '/name' 支持这种申明方式

    _retKey = retKey;
  }

  if (_module === confMeta.module) {
    // 此时computed & watch可能观察的是私有的stateKey
    _stateKeys = (0, _util.okeys)(confMeta.state);
  } else {
    // 对于属于bar的ref 配置key 'foo/a'时，会走入到此块
    _stateKeys = moduleName_stateKeys_[_module];

    if (!_stateKeys) {
      throw (0, _util.makeError)(_constant.ERR.CC_MODULE_NOT_FOUND, (0, _util.verboseInfo)("module[" + _module + "]"));
    }

    if (!confMeta.connect[_module]) {
      throw new Error("key[" + key + "] is invalid, module[" + _module + "] not been registered or connected");
    }
  } // retKey作为将计算结果映射到refComputed | refConnectedComputed | moduleComputed 里的key


  return {
    isStateKey: _stateKeys.includes(_retKey),
    module: _module,
    retKey: _retKey
  };
}