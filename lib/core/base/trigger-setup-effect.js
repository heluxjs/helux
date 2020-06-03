"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var util = _interopRequireWildcard(require("../../support/util"));

var moduleName_stateKeys_ = _ccContext["default"].moduleName_stateKeys_,
    _ccContext$store = _ccContext["default"].store,
    getPrevState = _ccContext$store.getPrevState,
    getState = _ccContext$store.getState,
    getStateVer = _ccContext$store.getStateVer;

var warn = function warn(key, frag) {
  return util.justWarning("effect: key[" + key + "] is invalid, its " + frag + " has not been declared in' store!");
};

function mapSettedList(settedList) {
  return settedList.reduce(function (map, _ref) {
    var module = _ref.module,
        keys = _ref.keys;
    keys.forEach(function (key) {
      return map[module + "/" + key] = 1;
    });
    return map;
  }, {});
}

function _default(ref, callByDidMount) {
  var ctx = ref.ctx;
  var _ctx$effectMeta = ctx.effectMeta,
      effectItems = _ctx$effectMeta.effectItems,
      eid_effectReturnCb_ = _ctx$effectMeta.eid_effectReturnCb_,
      effectPropsItems = _ctx$effectMeta.effectPropsItems,
      eid_effectPropsReturnCb_ = _ctx$effectMeta.eid_effectPropsReturnCb_;
  var __$$prevMoStateVer = ctx.__$$prevMoStateVer,
      __$$settedList = ctx.__$$settedList,
      refModule = ctx.module;

  var makeItemHandler = function makeItemHandler(eid_cleanCb_, isFirstCall, needJudgeImmediate) {
    return function (item) {
      var fn = item.fn,
          eId = item.eId,
          immediate = item.immediate;

      if (needJudgeImmediate) {
        if (immediate === false) return;
      }

      var prevCb = eid_cleanCb_[eId];
      if (prevCb) prevCb(ctx); // let ctx.effect have the totally same behavior with useEffect

      var cb = fn(ctx, isFirstCall);
      eid_cleanCb_[eId] = cb; //不管有没有返回，都要覆盖之前的结果
    };
  };

  if (callByDidMount) {
    // flag isFirstCall as true
    effectItems.forEach(makeItemHandler(eid_effectReturnCb_, true, true));
    effectPropsItems.forEach(makeItemHandler(eid_effectPropsReturnCb_, true, true));
  } else {
    // callByDidUpdate
    // start handle effect meta data of state keys
    var prevState = ctx.prevState;
    var curState = ctx.unProxyState;
    var toBeExecutedFns = [];
    effectItems.forEach(function (item) {
      // const { status, depKeys, fn, eId } = item;
      // if (status === EFFECT_STOPPED) return;
      // todo, 优化为effectDep模式, 利用differStateKeys去命中执行函数
      var modDepKeys = item.modDepKeys,
          compare = item.compare,
          fn = item.fn,
          eId = item.eId;

      if (modDepKeys) {
        var keysLen = modDepKeys.length;
        if (keysLen === 0) return;
        var mappedSettedKey = mapSettedList(__$$settedList);
        var shouldEffectExecute = false;

        for (var i = 0; i < keysLen; i++) {
          var key = modDepKeys[i];

          if (!compare) {
            if (mappedSettedKey[key]) {
              shouldEffectExecute = true;
              break;
            } else {
              continue;
            }
          }

          var targetCurState = void 0,
              targetPrevState = void 0;

          var _key$split = key.split('/'),
              module = _key$split[0],
              unmoduledKey = _key$split[1];

          if (module !== refModule) {
            var _prevState = getPrevState(module);

            var moduleStateVer = getStateVer(module);

            if (__$$prevMoStateVer[unmoduledKey] === moduleStateVer[unmoduledKey]) {
              continue;
            } else {
              __$$prevMoStateVer[unmoduledKey] = moduleStateVer[unmoduledKey];
            }

            if (!_prevState) {
              warn(key, "module[" + module + "]");
              continue;
            }

            if (!moduleName_stateKeys_[module].includes(unmoduledKey)) {
              warn(key, "unmoduledKey[" + unmoduledKey + "]");
              continue;
            }

            targetCurState = getState(module);
            targetPrevState = _prevState;
          } else {
            targetCurState = curState;
            targetPrevState = prevState;
          }

          if (targetPrevState[unmoduledKey] !== targetCurState[unmoduledKey]) {
            shouldEffectExecute = true;
            break;
          }
        }

        if (shouldEffectExecute) {
          toBeExecutedFns.push({
            fn: fn,
            eId: eId
          });
        }
      } else {
        toBeExecutedFns.push({
          fn: fn,
          eId: eId
        });
      }
    }); // flag isFirstCall as false, start to run state effect fns

    toBeExecutedFns.forEach(makeItemHandler(eid_effectReturnCb_, false, false)); // start handle effect meta data of props keys

    var prevProps = ctx.prevProps;
    var curProps = ctx.props;
    var toBeExecutedPropFns = [];
    effectPropsItems.forEach(function (item) {
      var depKeys = item.depKeys,
          fn = item.fn,
          eId = item.eId;

      if (depKeys) {
        // prop dep key
        var keysLen = depKeys.length;
        if (keysLen === 0) return;
        var shouldEffectExecute = false;

        for (var i = 0; i < keysLen; i++) {
          var key = depKeys[i];

          if (prevProps[key] !== curProps[key]) {
            shouldEffectExecute = true;
            break;
          }
        }

        if (shouldEffectExecute) toBeExecutedPropFns.push({
          fn: fn,
          eId: eId
        });
      } else {
        toBeExecutedPropFns.push({
          fn: fn,
          eId: eId
        });
      }
    }); // flag isFirstCall as false, start to run prop effect fns

    toBeExecutedPropFns.forEach(makeItemHandler(eid_effectPropsReturnCb_, false, false)); // clear settedList

    __$$settedList.length = 0;
  }
}