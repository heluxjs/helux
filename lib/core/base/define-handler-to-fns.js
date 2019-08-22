"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = require("../../support/util");

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_;
/**
  computed({
    'foo/firstName': ()=>{},
    'foo/fullName':{
      fn:()=>{},
      depKeys:['firstName', 'lastName']
    },
    'foo/bala':{
      fn:()=>{},
      depKeys:'*'
    }
  })
-----------------------------------
  computed('foo/firstName', ()=>{});
  computed('foo/fullName', ()=>{}, ['firstName', 'lastName']);
  computed('foo/bala', ()=>{}, '*');


watch({
  'foo/a':{
    fn:()=>{},
    immediate: true,
  },
  'foo/whatever':{
    fn:()=>{},
    immediate: true,
    depKeys:['a', 'b', 'c']
  }
})
-----------------------------------
watch('foo/a', ()=>{}, true);
watch('foo/whatever', ()=>{}, true, ['firstName', 'lastName']);

*/

function _default(refCtx, item, handler, fns, immediateKeys, immediate, depStateKeys, depFn, type) {
  if (!item) return;
  var itype = typeof item;

  if (itype === 'object') {
    parseDescObj(refCtx, item, fns, depFn, immediateKeys, type);
    return;
  }

  if (itype === 'function') {
    var ret = item(refCtx);
    if (!ret) return;

    if (typeof ret === 'object') {
      parseDescObj(refCtx, ret, fns, depFn, immediateKeys, type);
      return;
    }

    throw new Error("type of computed or watch callback result must be an object.");
  }

  if (itype === 'string') {
    var key = item;

    if (depStateKeys) {
      mapDepDesc(refCtx, key, depFn, depStateKeys, immediate);
      flagHasFn(refCtx, type);
      return;
    }

    getModuleAndRetKey(refCtx, key);
    fns[key] = handler;
    if (immediate) immediateKeys.push(key);
    flagHasFn(refCtx, type);
    return;
  }
}

;

function flagHasFn(refCtx, type) {
  if (type === 1) refCtx.hasComputedFn = true;else refCtx.hasWatchFn = true;
}

function parseDescObj(refCtx, descObj, fns, depFn, immediateKeys, type) {
  var keys = (0, _util.okeys)(descObj);

  if (keys.length > 0) {
    flagHasFn(refCtx, type);
    keys.forEach(function (key) {
      var val = descObj[key];
      var vType = typeof val;

      if (vType === 'function') {
        fns[key] = val;
        return;
      }

      if (vType === 'object') {
        var _fn = val.fn,
            depKeys = val.depKeys,
            immediate = val.immediate;

        if (!depKeys) {
          fns[key] = _fn;

          if (immediate && immediateKeys) {
            immediateKeys.push(key);
          }

          return;
        }

        mapDepDesc(refCtx, key, depFn, depKeys, immediate);
      }
    });
  }
}

function mapDepDesc(refCtx, key, depFn, depKeys, immediate) {
  var _getModuleAndRetKey = getModuleAndRetKey(refCtx, key, false),
      module = _getModuleAndRetKey.module,
      retKey = _getModuleAndRetKey.retKey;

  var moduleDepDesc = (0, _util.safeGetObjectFromObject)(depFn, module, {
    stateKey_retKeys_: {},
    retKey_fn_: {},
    immediateRetKeys: []
  });
  var stateKey_retKeys_ = moduleDepDesc.stateKey_retKeys_,
      retKey_fn_ = moduleDepDesc.retKey_fn_;
  var _depKeys = depKeys;

  if (depKeys === '*') {
    _depKeys = ['*'];
  }

  if (!Array.isArray(_depKeys)) {
    throw new Error("depKeys can only be an Array<string> or string *");
  }

  if (immediate) immediateRetKeys.push(immediate);
  retKey_fn_[retKey] = fn;

  _depKeys.forEach(function (sKey) {
    //一个依赖key列表里的stateKey会对应着多个结果key
    var retKeys = (0, _util.safeGetArrayFromObject)(stateKey_retKeys_, sKey);
    retKeys.push(retKey);
  });
} // retKey作为将计算结果映射到refComputed | refConnectedComputed | moduleComputed 里的key


function getModuleAndRetKey(refCtx, key, mustInclude) {
  if (mustInclude === void 0) {
    mustInclude = true;
  }

  var _module = refCtx.module,
      _retKey = key;

  if (key.includes('/')) {
    var _key$split = key.split('/'),
        module = _key$split[0],
        retKey = _key$split[1];

    _module = module;
    _retKey = retKey;
  }

  var moduleStateKeys = moduleName_stateKeys_[_module];

  if (!moduleStateKeys) {
    throw (0, _util.makeError)(_constant.ERR.CC_MODULE_NOT_FOUND, (0, _util.verboseInfo)("module[" + _module + "]"));
  }

  var includeKey = moduleStateKeys.includes(_retKey);

  if (mustInclude) {
    if (!includeKey) {
      throw new Error("key[" + _retKey + "] is not declared in module[" + _module + "]");
    }
  } else {
    //传递了depKeys，_retKey不能再是stateKey
    if (includeKey) {
      throw new Error("retKey[" + _retKey + "] can not be stateKey of module[" + _module + "] if you declare depKeys");
    }
  }

  return {
    module: _module,
    retKey: _retKey
  };
}