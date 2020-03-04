"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = require("../../support/util");

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _uuid = _interopRequireDefault(require("./uuid"));

var moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_,
    runtimeVar = _ccContext["default"].runtimeVar;
/**
computed('foo/firstName', ()=>{});
//or
computed('firstName', ()=>{}, ['foo/firstName']);

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
// or 
computed({
  'foo/firstName':()=>{},
  'fullName':{
    fn:()=>{},
    depKeys:['foo/firstName', 'foo/lastName']
  }
});

computed(ctx=>{ return cuDesc}
*/
// cate: module | ref

function _default(cate, confMeta, item, handler, depKeys, compare, immediate) {
  var ctx = confMeta.refCtx;
  var type = confMeta.type;

  if (cate === _constant.CATE_REF) {
    if (!ctx.__$$isBSe) {
      (0, _util.justWarning)(cate + " " + type + " must be been called in setup block");
      return;
    }
  }

  if (!item) return;
  var itype = typeof item;

  var _descObj;

  if (itype === 'string') {
    var _descObj2, _descObj3;

    // retKey
    if ((0, _util.isPJO)(handler)) _descObj = (_descObj2 = {}, _descObj2[item] = handler, _descObj2);else _descObj = (_descObj3 = {}, _descObj3[item] = {
      fn: handler,
      depKeys: depKeys,
      compare: compare,
      immediate: immediate
    }, _descObj3);
  } else if ((0, _util.isPJO)(item)) {
    _descObj = item;
  } else if (itype === 'function') {
    _descObj = item(ctx);
    if (!(0, _util.isPJO)(_descObj)) throw new Error("type of " + type + " callback result must be an object");
  }

  if (!_descObj) {
    (0, _util.justWarning)(cate + " " + type + " param type error");
    return;
  }

  _parseDescObj(cate, confMeta, _descObj);
}

;

function _parseDescObj(cate, confMeta, descObj) {
  var computedCompare = runtimeVar.computedCompare,
      watchCompare = runtimeVar.watchCompare,
      watchImmediate = runtimeVar.watchImmediate; //读全局的默认值

  var defaultCompare = confMeta.type === 'computed' ? computedCompare : watchCompare;
  var callerModule = confMeta.module;
  (0, _util.okeys)(descObj).forEach(function (retKey) {
    var val = descObj[retKey];
    var vType = typeof val;
    var targetItem = val;

    if (vType === 'function') {
      targetItem = {
        fn: val
      };
    }

    if ((0, _util.isPJO)(targetItem)) {
      var _targetItem = targetItem,
          fn = _targetItem.fn,
          depKeys = _targetItem.depKeys,
          _targetItem$immediate = _targetItem.immediate,
          immediate = _targetItem$immediate === void 0 ? watchImmediate : _targetItem$immediate,
          _targetItem$compare = _targetItem.compare,
          compare = _targetItem$compare === void 0 ? defaultCompare : _targetItem$compare,
          lazy = _targetItem.lazy;
      var fnUid = (0, _uuid["default"])('mark');

      if (depKeys === '*') {
        var _resolveStateKey2 = _resolveStateKey(confMeta, callerModule, retKey),
            isStateKey = _resolveStateKey2.isStateKey,
            stateKey = _resolveStateKey2.stateKey;

        if (!isStateKey) throw new Error("retKey[" + retKey + "] is not a state key of module[" + callerModule + "]");

        _checkRetKeyDup(cate, confMeta, fnUid, stateKey); // when retKey is '/xxxx', here need pass xxxx, so pass stateKey as retKey


        _mapDepDesc(cate, confMeta, callerModule, stateKey, fn, depKeys, immediate, compare, lazy);
      } else {
        // ['foo/b1', 'bar/b1'] or null or undefined
        if (depKeys && !Array.isArray(depKeys)) throw new Error('depKeys must an string array or *');

        if (!depKeys || depKeys.length === 0) {
          var _resolveStateKey3 = _resolveStateKey(confMeta, callerModule, retKey),
              _isStateKey = _resolveStateKey3.isStateKey,
              _stateKey2 = _resolveStateKey3.stateKey,
              module = _resolveStateKey3.module; //consume retKey is stateKey


          var targetDepKeys = [];

          if (!depKeys && _isStateKey) {
            targetDepKeys = [_stateKey2]; // regenerate depKeys
          }

          _checkRetKeyDup(cate, confMeta, fnUid, _stateKey2);

          _mapDepDesc(cate, confMeta, module, _stateKey2, fn, targetDepKeys, immediate, compare, lazy);
        } else {
          var stateKeyModule = '',
              targetRetKey = retKey;

          if (retKey.includes('/')) {
            var _retKey$split = retKey.split('/'),
                m = _retKey$split[0],
                r = _retKey$split[1];

            stateKeyModule = m;
            targetRetKey = r;
          }

          _checkRetKeyDup(cate, confMeta, fnUid, targetRetKey); // 给depKeys按module分类，此时它们都指向同一个retKey，同一个fn


          var module_depKeys_ = {};
          depKeys.forEach(function (depKey) {
            var _resolveStateKey4 = _resolveStateKey(confMeta, callerModule, depKey),
                isStateKey = _resolveStateKey4.isStateKey,
                stateKey = _resolveStateKey4.stateKey,
                module = _resolveStateKey4.module; //consume depKey is stateKey
            // ok: retKey: 'xxxx' depKeys:['foo/f1', 'foo/f2', 'bar/b1', 'bar/b2'], some stateKey belong to foo, some belong to bar
            // ok: retKey: 'foo/xxxx' depKeys:['f1', 'f2'], all stateKey belong to foo
            // ok: retKey: 'foo/xxxx' depKeys:['foo/f1', 'foo/f2'], all stateKey belong to foo
            // both left and right include module but they are not equal, this situation is not ok!
            // not ok: retKey: 'foo/xxxx' depKeys:['foo/f1', 'foo/f2', 'bar/b1', 'bar/b2']


            if (stateKeyModule && module !== stateKeyModule) {
              throw new Error("including slash both in retKey[" + retKey + "] and depKey[" + depKey + "] founded, but their module is different");
            }

            var depKeys = (0, _util.safeGetArrayFromObject)(module_depKeys_, module);

            if (!isStateKey) {
              throw new Error("depKey[" + depKey + "] invalid, module[" + module + "] doesn't include its stateKey[" + stateKey + "]");
            }

            depKeys.push(stateKey);
          });
          (0, _util.okeys)(module_depKeys_).forEach(function (m) {
            // 指向同一个fn，允许重复
            _mapDepDesc(cate, confMeta, m, targetRetKey, fn, module_depKeys_[m], immediate, compare, lazy);
          });
        }
      }
    } else {
      (0, _util.justWarning)("retKey[" + retKey + "] item type error");
    }
  });
}

function _checkRetKeyDup(cate, confMeta, fnUid, retKey) {
  if (cate === _constant.CATE_REF) {
    var _confMeta$refCtx = confMeta.refCtx,
        ccUniqueKey = _confMeta$refCtx.ccUniqueKey,
        retKey_fnUid_ = _confMeta$refCtx.retKey_fnUid_;
    var type = confMeta.type;
    var typedRetKey = type + "_" + retKey;
    var mappedFn = retKey_fnUid_[typedRetKey];

    if (mappedFn) {
      throw new Error("ccUKey[" + ccUniqueKey + "], retKey[" + retKey + "] duplicate in ref " + type);
    } else {
      retKey_fnUid_[typedRetKey] = fnUid;
    }
  }
} // 映射依赖描述对象


function _mapDepDesc(cate, confMeta, module, retKey, fn, depKeys, immediate, compare, lazy) {
  var dep = confMeta.dep;
  var moduleDepDesc = (0, _util.safeGetObjectFromObject)(dep, module, (0, _util.makeCuDepDesc)());
  var retKey_fn_ = moduleDepDesc.retKey_fn_,
      stateKey_retKeys_ = moduleDepDesc.stateKey_retKeys_,
      retKey_lazy_ = moduleDepDesc.retKey_lazy_;
  var fnDesc = {
    fn: fn,
    immediate: immediate,
    compare: compare,
    depKeys: depKeys
  }; // retKey作为将计算结果映射到refComputed | moduleComputed 里的key

  if (retKey_fn_[retKey]) {
    if (cate !== _constant.CATE_REF) {
      // 因为热加载，对于module computed 定义总是赋值最新的，
      retKey_fn_[retKey] = fnDesc;
      retKey_lazy_[retKey] = confMeta.isLazyComputed || lazy;
    } // do nothing

  } else {
    retKey_fn_[retKey] = fnDesc;
    retKey_lazy_[retKey] = confMeta.isLazyComputed || lazy;
    moduleDepDesc.fnCount++;
  }

  var _depKeys = depKeys;

  if (depKeys === '*') {
    _depKeys = ['*'];
  }

  if (cate === _constant.CATE_REF) {
    confMeta.retKeyFns[retKey] = retKey_fn_[retKey];
  }

  var refCtx = confMeta.refCtx;

  if (refCtx) {
    if (confMeta.type === 'computed') refCtx.hasComputedFn = true;else refCtx.hasWatchFn = true;
  }

  _depKeys.forEach(function (sKey) {
    //一个依赖key列表里的stateKey会对应着多个结果key
    var retKeys = (0, _util.safeGetArrayFromObject)(stateKey_retKeys_, sKey);
    if (!retKeys.includes(retKey)) retKeys.push(retKey);
  });
}

function _resolveStateKey(confMeta, module, stateKey) {
  var targetModule = module,
      targetStateKey = stateKey;

  if (stateKey.includes('/')) {
    var _stateKey$split = stateKey.split('/'),
        _module = _stateKey$split[0],
        _stateKey = _stateKey$split[1];

    if (_module) targetModule = _module; // '/name' 支持这种申明方式

    targetStateKey = _stateKey;
  }

  var stateKeys;

  if (targetModule === confMeta.module) {
    // 此时computed & watch观察的是对象的所有stateKeys
    stateKeys = confMeta.stateKeys;
  } else {
    // 对于属于bar的ref 配置key 'foo/a'时，会走入到此块
    stateKeys = moduleName_stateKeys_[targetModule];

    if (!stateKeys) {
      throw (0, _util.makeError)(_constant.ERR.CC_MODULE_NOT_FOUND, (0, _util.verboseInfo)("module[" + targetModule + "]"));
    }

    if (!confMeta.connect[targetModule]) {
      throw (0, _util.makeError)(_constant.ERR.CC_MODULE_NOT_CONNECTED, (0, _util.verboseInfo)("module[" + targetModule + "], stateKey[" + targetStateKey + "]"));
    }
  }

  return {
    isStateKey: stateKeys.includes(targetStateKey),
    stateKey: targetStateKey,
    module: targetModule
  };
}