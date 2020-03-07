"use strict";

exports.__esModule = true;
exports.clearCachedData = clearCachedData;
exports["default"] = _default;

var _util = require("../../support/util");

function getCacheDataContainer() {
  return {
    module: {
      computed: {},
      watch: {}
    },
    ref: {
      computed: {},
      watch: {},
      effect: {}
    }
  };
}

var cacheArea_pickedRetKeys_ = getCacheDataContainer();

function _wrapFn(retKey, retKey_fn_, isLazy) {
  var _retKey_fn_$retKey = retKey_fn_[retKey],
      fn = _retKey_fn_$retKey.fn,
      depKeys = _retKey_fn_$retKey.depKeys;
  return {
    retKey: retKey,
    fn: fn,
    depKeys: depKeys,
    isLazy: isLazy
  };
}

function clearCachedData() {
  cacheArea_pickedRetKeys_ = getCacheDataContainer();
} // cate module | ref
// type computed | watch


function _default(isBeforeMount, cate, type, depDesc, stateModule, oldState, committedState, cUkey) {
  var moduleDep = depDesc[stateModule]; // it can be refModuleDep or moduleDep

  var pickedFns = [];
  if (!moduleDep) return {
    pickedFns: pickedFns,
    setted: [],
    changed: []
  };
  var retKey_fn_ = moduleDep.retKey_fn_,
      retKey_lazy_ = moduleDep.retKey_lazy_,
      stateKey_retKeys_ = moduleDep.stateKey_retKeys_,
      fnCount = moduleDep.fnCount;
  /** 首次调用 */

  if (isBeforeMount) {
    var retKeys = (0, _util.okeys)(retKey_fn_);

    var _setted = (0, _util.okeys)(committedState);

    var _changed = _setted;

    if (type === 'computed') {
      return {
        pickedFns: retKeys.map(function (retKey) {
          return _wrapFn(retKey, retKey_fn_, retKey_lazy_[retKey]);
        }),
        setted: _setted,
        changed: _changed
      };
    } // for watch


    retKeys.forEach(function (retKey) {
      var _retKey_fn_$retKey2 = retKey_fn_[retKey],
          fn = _retKey_fn_$retKey2.fn,
          immediate = _retKey_fn_$retKey2.immediate,
          depKeys = _retKey_fn_$retKey2.depKeys;
      if (immediate) pickedFns.push({
        retKey: retKey,
        fn: fn,
        depKeys: depKeys
      });
    });
    return {
      pickedFns: pickedFns,
      setted: _setted,
      changed: _changed
    };
  } // 这些目标stateKey的值发生了变化


  var _differStateKeys = (0, _util.differStateKeys)(oldState, committedState),
      setted = _differStateKeys.setted,
      changed = _differStateKeys.changed;

  if (setted.length === 0) {
    return {
      pickedFns: pickedFns,
      setted: [],
      changed: []
    };
  } //用setted + changed + module 作为键，缓存对应的pickedFns，这样相同形状的committedState再次进入此函数时，方便快速直接命中pickedFns


  var cacheKey = setted.join(',') + '|' + changed.join(',') + '|' + stateModule; // 要求用户必须在setup里静态的定义完computed & watch，动态的调用computed & watch的回调因为缓存原因不会被触发

  var tmpNode = cacheArea_pickedRetKeys_[cate][type];
  var cachePool = cUkey ? (0, _util.safeGetObject)(tmpNode, cUkey) : tmpNode;
  var cachedPickedRetKeys = cachePool[cacheKey];

  if (cachedPickedRetKeys) {
    return {
      pickedFns: cachedPickedRetKeys.map(function (retKey) {
        return _wrapFn(retKey, retKey_fn_, retKey_lazy_[retKey]);
      }),
      setted: setted,
      changed: changed
    };
  }

  _pickFn(pickedFns, setted, changed, retKey_fn_, stateKey_retKeys_, retKey_lazy_, fnCount);

  cachePool[cacheKey] = pickedFns.map(function (v) {
    return v.retKey;
  });
  return {
    pickedFns: pickedFns,
    setted: setted,
    changed: changed
  };
}

function _pickFn(pickedFns, settedStateKeys, changedStateKeys, retKey_fn_, stateKey_retKeys_, retKey_lazy_, fnCount) {
  if (settedStateKeys.length === 0) return; // 把*的函数先全部挑出来, 有key的值发生变化了或者有设值行为

  var starRetKeys = stateKey_retKeys_['*'];

  if (starRetKeys) {
    var isKeyValChanged = changedStateKeys.length > 0;
    starRetKeys.forEach(function (retKey) {
      var _retKey_fn_$retKey3 = retKey_fn_[retKey],
          fn = _retKey_fn_$retKey3.fn,
          compare = _retKey_fn_$retKey3.compare,
          depKeys = _retKey_fn_$retKey3.depKeys;
      var toPush = {
        retKey: retKey,
        fn: fn,
        depKeys: depKeys,
        isLazy: retKey_lazy_[retKey]
      };

      if (compare) {
        if (isKeyValChanged) pickedFns.push(toPush);
        return;
      }

      pickedFns.push(toPush);
    });
  } // 继续遍历settedStateKeys, 挑选出剩余的目标fn（非*相关的）


  if (pickedFns.length < fnCount) {
    (function () {
      var retKey_picked_ = {};
      var len = settedStateKeys.length;

      var _loop2 = function _loop2(i) {
        var stateKey = settedStateKeys[i];
        var retKeys = stateKey_retKeys_[stateKey]; //发生变化了的stateKey不一定在依赖列表里

        if (!retKeys) return "continue";
        retKeys.forEach(function (retKey) {
          //没有挑过的方法才挑出来
          if (!retKey_picked_[retKey]) {
            var _retKey_fn_$retKey4 = retKey_fn_[retKey],
                fn = _retKey_fn_$retKey4.fn,
                compare = _retKey_fn_$retKey4.compare,
                depKeys = _retKey_fn_$retKey4.depKeys;
            var canPick = true;

            if (compare && !changedStateKeys.includes(stateKey)) {
              canPick = false;
            }

            if (canPick) {
              retKey_picked_[retKey] = true;
              pickedFns.push({
                retKey: retKey,
                fn: fn,
                depKeys: depKeys,
                isLazy: retKey_lazy_[retKey]
              });
            }
          }
        });
        if (pickedFns.length === fnCount) return "break";
      };

      _loop: for (var i = 0; i < len; i++) {
        var _ret = _loop2(i);

        switch (_ret) {
          case "continue":
            continue;

          case "break":
            break _loop;
        }
      }
    })();
  }
}