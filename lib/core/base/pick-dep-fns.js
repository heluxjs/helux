"use strict";

exports.__esModule = true;
exports["default"] = _default;

var _util = require("../../support/util");

var cacheKey_pickedFns_ = {};

function _default(depDesc, stateModule, oldState, committedState) {
  var moduleDep = depDesc[stateModule];
  var pickedFns = [];

  if (moduleDep) {
    var _ret = function () {
      // 这些目标stateKey的值发生了变化
      var targetStateKeys = (0, _util.differStateKeys)(oldState, committedState);

      if (targetStateKeys.length === 0) {
        return {
          v: []
        };
      }

      var stateKey_retKeys_ = moduleDep.stateKey_retKeys_,
          retKey_fn_ = moduleDep.retKey_fn_,
          fnCount = moduleDep.fnCount; //用targetStateKeys + module 作为键，缓存对应的pickedFns，这样相同形状的committedState再次进入此函数时，方便快速直接命中pickedFns

      var cacheKey = targetStateKeys.join(',') + '|' + stateModule; // 要求用户必须在setup里静态的定义完computed & watch

      var cachedPickedFns = cacheKey_pickedFns_[cacheKey];

      if (cachedRetKeys) {
        return {
          v: cachedPickedFns
        };
      } else {
        (function () {
          var retKey_picked_ = {}; // 把*的函数先全部挑出来

          var starRetKeys = stateKey_retKeys_['*'];

          if (starRetKeys) {
            starRetKeys.forEach(function (retKey) {
              return pickedFns.push({
                retKey: retKey,
                fn: retKey_fn_[retKey]
              });
            });
          } // 还没有挑完，再遍历targetStateKeys, 挑选出剩余的目标fn


          if (pickedFns.length < fnCount) {
            var len = targetStateKeys.length;

            for (var i = 0; i < len; i++) {
              var stateKey = targetStateKeys[i];
              var retKeys = stateKey_retKeys_[stateKey];
              retKeys.forEach(function (retKey) {
                //没有挑过的方法才挑出来
                if (!retKey_picked_[retKey]) {
                  retKey_picked_[retKey] = true;
                  pickedFns.push({
                    retKey: retKey,
                    fn: retKey_fn_[retKey]
                  });
                }
              });
              if (pickedFns.length === fnCount) break;
            }
          }

          cacheKey_pickedFns_[cacheKey] = pickedFns;
        })();
      }
    }();

    if (typeof _ret === "object") return _ret.v;
  }

  return pickedFns;
}