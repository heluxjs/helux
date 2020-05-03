"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = require("../../support/util");

var _constant = require("../../support/constant");

var _privConstant = require("../../support/priv-constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _wakeyUkeyMap = require("../../cc-context/wakey-ukey-map");

var _uuid = _interopRequireDefault(require("./uuid"));

var moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_,
    runtimeVar = _ccContext["default"].runtimeVar;
var sortFactor = 1;
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

function _default(cate, confMeta, item, handler, depKeysOrOpt) {
  var ctx = confMeta.refCtx;
  var type = confMeta.type;

  if (cate === _constant.CATE_REF) {
    if (!ctx.__$$inBM) {
      (0, _util.justWarning)(cate + " " + type + " must been called in setup block");
      return;
    }
  }

  if (!item) return;
  var itype = typeof item;

  var _descObj;

  if (itype === 'string') {
    var _descObj2, _descObj3;

    // retKey
    if ((0, _util.isPJO)(handler)) _descObj = (_descObj2 = {}, _descObj2[item] = handler, _descObj2);else if (typeof handler === _privConstant.FUNCTION) _descObj = (_descObj3 = {}, _descObj3[item] = (0, _util.makeFnDesc)(handler, depKeysOrOpt), _descObj3);
  } else if ((0, _util.isPJO)(item)) {
    _descObj = item;
  } else if (itype === _privConstant.FUNCTION) {
    _descObj = item(ctx);
    if (!(0, _util.isPJO)(_descObj)) throw new Error("type of " + type + " callback result must be an object");
  }

  if (!_descObj) {
    (0, _util.justWarning)(cate + " " + type + " param type error");
    return;
  }

  _parseDescObj(cate, confMeta, _descObj);
}

function _parseDescObj(cate, confMeta, descObj) {
  var computedCompare = runtimeVar.computedCompare,
      watchCompare = runtimeVar.watchCompare,
      watchImmediate = runtimeVar.watchImmediate; //读全局的默认值

  var defaultCompare = confMeta.type === _constant.FN_CU ? computedCompare : watchCompare;
  var callerModule = confMeta.module;
  (0, _util.okeys)(descObj).forEach(function (retKey) {
    var val = descObj[retKey];
    var vType = typeof val;
    var targetItem = val;

    if (vType === _privConstant.FUNCTION) {
      targetItem = {
        fn: val
      };
    }

    if ((0, _util.isPJO)(targetItem)) {
      // depKeys设置为默认自动收集
      var _targetItem = targetItem,
          fn = _targetItem.fn,
          _targetItem$immediate = _targetItem.immediate,
          immediate = _targetItem$immediate === void 0 ? watchImmediate : _targetItem$immediate,
          _targetItem$compare = _targetItem.compare,
          compare = _targetItem$compare === void 0 ? defaultCompare : _targetItem$compare,
          lazy = _targetItem.lazy,
          _targetItem$retKeyDep = _targetItem.retKeyDep,
          retKeyDep = _targetItem$retKeyDep === void 0 ? true : _targetItem$retKeyDep; // 确保用户显示的传递null、undefined、0、都置为依赖收集状态

      var depKeys = targetItem.depKeys || '-'; // if user don't pass sort explicitly, computed fn will been called orderly by sortFactor

      var sort = targetItem.sort || sortFactor++;
      var fnUid = (0, _uuid["default"])('mark');

      if (depKeys === '*' || depKeys === '-') {
        // 处于依赖收集，且用户没有显式的通过设置retKeyDep为false来关闭同名依赖规则时，会自动设置同名依赖
        var mapSameName = depKeys === '-' && retKeyDep;

        var _resolveKey2 = _resolveKey(confMeta, callerModule, retKey, mapSameName),
            pureKey = _resolveKey2.pureKey,
            module = _resolveKey2.module;

        _checkRetKeyDup(cate, confMeta, fnUid, pureKey); // when retKey is '/xxxx', here need pass xxxx as retKey


        _mapDepDesc(cate, confMeta, module, pureKey, fn, depKeys, immediate, compare, lazy, sort);
      } else {
        if (depKeys.length === 0) {
          var _resolveKey3 = _resolveKey(confMeta, callerModule, retKey),
              _pureKey = _resolveKey3.pureKey,
              _module2 = _resolveKey3.module; //consume retKey is stateKey
          // 这段逻辑对于将来的1.6版本有效，即没有指定depKeys，启用同名键规则
          // let targetDepKeys = [];
          // if (!depKeys && isStateKey) {
          //   targetDepKeys = [pureKey];// regenerate depKeys
          // }


          _checkRetKeyDup(cate, confMeta, fnUid, _pureKey);

          _mapDepDesc(cate, confMeta, _module2, _pureKey, fn, depKeys, immediate, compare, lazy, sort);
        } else {
          // ['foo/b1', 'bar/b1'] or ['b1', 'b2']
          var _resolveKey4 = _resolveKey(confMeta, callerModule, retKey),
              _pureKey2 = _resolveKey4.pureKey,
              moduleOfKey = _resolveKey4.moduleOfKey;

          var stateKeyModule = moduleOfKey;

          _checkRetKeyDup(cate, confMeta, fnUid, _pureKey2); // 给depKeys按module分类，此时它们都指向同一个retKey，同一个fn，但是会被分配ctx.computedDep或者watchDep的不同映射里


          var module_depKeys_ = {}; // ['foo/b1', 'bar/b1']

          depKeys.forEach(function (depKey) {
            // !!!这里只是单纯的解析depKey，不需要有映射同名依赖的行为
            // 映射同名依赖仅发生在传入retKey的时候
            var _resolveKey5 = _resolveKey(confMeta, callerModule, depKey),
                isStateKey = _resolveKey5.isStateKey,
                pureKey = _resolveKey5.pureKey,
                module = _resolveKey5.module; //consume depKey is stateKey
            // ok: retKey: 'xxxx' depKeys:['foo/f1', 'foo/f2', 'bar/b1', 'bar/b2'], some stateKey belong to foo, some belong to bar
            // ok: retKey: 'foo/xxxx' depKeys:['f1', 'f2'], all stateKey belong to foo
            // ok: retKey: 'foo/xxxx' depKeys:['foo/f1', 'foo/f2'], all stateKey belong to foo
            // both left and right include module but they are not equal, this situation is not ok!
            // not ok: retKey: 'foo/xxxx' depKeys:['foo/f1', 'foo/f2', 'bar/b1', 'bar/b2']


            if (stateKeyModule && module !== stateKeyModule) {
              throw new Error("including slash both in retKey[" + retKey + "] and depKey[" + depKey + "] founded, but their module is different");
            }

            var depKeys = (0, _util.safeGetArray)(module_depKeys_, module);

            if (!isStateKey) {
              throw new Error("depKey[" + depKey + "] invalid, module[" + module + "] doesn't include its stateKey[" + pureKey + "]");
            } else {
              // 当一个实例里 ctx.computed ctx.watch 的depKeys里显示的标记了依赖时
              // 在这里需要立即记录依赖了
              _mapIns(confMeta, module, pureKey);
            }

            depKeys.push(pureKey);
          });
          (0, _util.okeys)(module_depKeys_).forEach(function (m) {
            // 指向同一个fn，允许重复
            _mapDepDesc(cate, confMeta, m, _pureKey2, fn, module_depKeys_[m], immediate, compare, lazy, sort);
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
} // !!!由实例调用computed或者watch，监听同名的retKey，更新stateKey与retKey的关系映射


function _mapSameNameRetKey(confMeta, module, retKey, isModuleStateKey) {
  var dep = confMeta.dep;
  var moduleDepDesc = (0, _util.safeGet)(dep, module, (0, _util.makeCuDepDesc)());
  var stateKey_retKeys_ = moduleDepDesc.stateKey_retKeys_,
      retKey_stateKeys_ = moduleDepDesc.retKey_stateKeys_;
  (0, _util.safeGetThenNoDupPush)(stateKey_retKeys_, retKey, retKey);
  (0, _util.safeGetThenNoDupPush)(retKey_stateKeys_, retKey, retKey); // 记录依赖

  isModuleStateKey && _mapIns(confMeta, module, retKey);
}

function _mapIns(confMeta, module, retKey) {
  var ctx = confMeta.refCtx;

  if (ctx) {
    ctx.__$$staticWaKeys[(0, _wakeyUkeyMap.makeWaKey)(module, retKey)] = 1;
  }
} // 映射依赖描述对象, module即是取的dep里的key


function _mapDepDesc(cate, confMeta, module, retKey, fn, depKeys, immediate, compare, lazy, sort) {
  var dep = confMeta.dep;
  var moduleDepDesc = (0, _util.safeGet)(dep, module, (0, _util.makeCuDepDesc)());
  var retKey_fn_ = moduleDepDesc.retKey_fn_,
      stateKey_retKeys_ = moduleDepDesc.stateKey_retKeys_,
      retKey_lazy_ = moduleDepDesc.retKey_lazy_,
      retKey_stateKeys_ = moduleDepDesc.retKey_stateKeys_;
  var isStatic = Array.isArray(depKeys) && depKeys.length === 0; // 确保static computed优先优先执行

  var targetSort = sort;

  if (isStatic) {
    if (targetSort >= 0) targetSort = -1;
  } else {
    if (sort < 0) targetSort = 0;
  }

  var fnDesc = {
    fn: fn,
    immediate: immediate,
    compare: compare,
    depKeys: depKeys,
    sort: targetSort,
    isStatic: isStatic
  }; // retKey作为将计算结果映射到refComputed | moduleComputed 里的key

  if (retKey_fn_[retKey]) {
    if (cate !== _constant.CATE_REF) {
      // 因为热加载，对于module computed 定义总是赋值最新的，
      retKey_fn_[retKey] = fnDesc;
      retKey_lazy_[retKey] = lazy;
    } // do nothing

  } else {
    retKey_fn_[retKey] = fnDesc;
    retKey_lazy_[retKey] = lazy;
    moduleDepDesc.fnCount++;
  }

  if (cate === _constant.CATE_REF) {
    confMeta.retKeyFns[retKey] = retKey_fn_[retKey];
  }

  var refCtx = confMeta.refCtx;

  if (refCtx) {
    if (confMeta.type === 'computed') refCtx.hasComputedFn = true;else refCtx.hasWatchFn = true;
  } //处于自动收集依赖状态，首次遍历完计算函数后之后再去写stateKey_retKeys_, retKey_stateKeys_
  // in find-dep-fns-to-execute.js setStateKeyRetKeysMap


  if (depKeys === '-') return;

  var _depKeys = depKeys === '*' ? ['*'] : depKeys;

  if (depKeys === '*') retKey_stateKeys_[retKey] = moduleName_stateKeys_[module];

  _depKeys.forEach(function (sKey) {
    //一个依赖key列表里的stateKey会对应着多个结果key
    (0, _util.safeGetThenNoDupPush)(stateKey_retKeys_, sKey, retKey);
  });
} // 分析retKey或者depKey是不是stateKey,
// 返回的是净化后的key


function _resolveKey(confMeta, module, retKey, mapSameName) {
  if (mapSameName === void 0) {
    mapSameName = false;
  }

  var targetModule = module,
      targetRetKey = retKey,
      moduleOfKey = '';

  if (retKey.includes('/')) {
    var _retKey$split = retKey.split('/'),
        _module = _retKey$split[0],
        _stateKey = _retKey$split[1];

    if (_module) {
      moduleOfKey = _module;
      targetModule = _module; // '/name' 支持这种申明方式
    }

    targetRetKey = _stateKey;
  }

  var stateKeys;
  var moduleStateKeys = moduleName_stateKeys_[targetModule];

  if (targetModule === confMeta.module) {
    // 此时computed & watch观察的是对象的所有stateKeys
    stateKeys = confMeta.stateKeys;
  } else {
    // 对于属于bar的ref 配置key 'foo/a'时，会走入到此块
    stateKeys = moduleStateKeys;

    if (!stateKeys) {
      throw (0, _util.makeError)(_constant.ERR.CC_MODULE_NOT_FOUND, (0, _util.verboseInfo)("module[" + targetModule + "]"));
    }

    if (!confMeta.connect[targetModule]) {
      throw (0, _util.makeError)(_constant.ERR.CC_MODULE_NOT_CONNECTED, (0, _util.verboseInfo)("module[" + targetModule + "], retKey[" + targetRetKey + "]"));
    }
  }

  var isStateKey = stateKeys.includes(targetRetKey);

  if (mapSameName && isStateKey) {
    _mapSameNameRetKey(confMeta, targetModule, targetRetKey, moduleStateKeys.includes(targetRetKey));
  }

  return {
    isStateKey: isStateKey,
    pureKey: targetRetKey,
    module: targetModule,
    moduleOfKey: moduleOfKey
  };
}