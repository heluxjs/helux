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
    getState = _ccContext$store.getState;
var frag1 = 'has not been declared in';

function _default(ref, callByDidMount) {
  var ctx = ref.ctx;
  var _ctx$effectMeta = ctx.effectMeta,
      effectItems = _ctx$effectMeta.effectItems,
      eid_effectReturnCb_ = _ctx$effectMeta.eid_effectReturnCb_,
      effectPropsItems = _ctx$effectMeta.effectPropsItems,
      eid_effectPropsReturnCb_ = _ctx$effectMeta.eid_effectPropsReturnCb_;

  var makeItemHandler = function makeItemHandler(eid_cleanCb_, isDidMount, needJudgeImmediate) {
    return function (item) {
      var fn = item.fn,
          eId = item.eId,
          immediate = item.immediate;

      if (needJudgeImmediate) {
        if (immediate === false) return;
      }

      var cb = fn(ctx, isDidMount);
      if (cb) eid_cleanCb_[eId] = cb;
    };
  };

  if (callByDidMount) {
    // flag isDidMount as true
    effectItems.forEach(makeItemHandler(eid_effectReturnCb_, true, true));
    effectPropsItems.forEach(makeItemHandler(eid_effectPropsReturnCb_, true, true));
  } else {
    // callByDidUpdate
    // start handle effect meta data of state keys
    var prevState = ctx.prevState;
    var curState = ref.state;
    var toBeExecutedFns = [];
    effectItems.forEach(function (item) {
      // const { status, depKeys, fn, eId } = item;
      // if (status === EFFECT_STOPPED) return;
      // todo, 优化为effectDep模式, 利用differStateKeys去命中执行函数
      var depKeys = item.depKeys,
          fn = item.fn,
          eId = item.eId;

      if (depKeys) {
        var keysLen = depKeys.length;
        if (keysLen === 0) return;
        var shouldEffectExecute = false;

        for (var i = 0; i < keysLen; i++) {
          var key = depKeys[i];
          var targetCurState = void 0,
              targetPrevState = void 0,
              targetKey = void 0;

          if (key.includes('/')) {
            var _key$split = key.split('/'),
                module = _key$split[0],
                unmoduledKey = _key$split[1];

            var _prevState = getPrevState(module);

            if (!_prevState) {
              util.justWarning("effect: key[" + key + "] is invalid, its module[" + module + "] " + frag1 + " store!");
              continue;
            }

            if (!moduleName_stateKeys_[module].includes(unmoduledKey)) {
              util.justWarning("effect: key[" + key + "] is invalid, its unmoduledKey[" + unmoduledKey + "] " + frag1 + " state!");
              continue;
            }

            targetCurState = getState(module);
            targetPrevState = _prevState;
            targetKey = unmoduledKey;
          } else {
            targetCurState = curState;
            targetPrevState = prevState;
            targetKey = key;
          }

          if (targetPrevState[targetKey] !== targetCurState[targetKey]) {
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
    }); // flag isDidMount as false, means effect triggered in didUpdate period

    toBeExecutedFns.forEach(makeItemHandler(eid_effectReturnCb_, false, false)); // start handle effect meta data of props keys

    var prevProps = ctx.prevProps;
    var curProps = ctx.props;
    var toBeExecutedPropFns = [];
    effectPropsItems.forEach(function (item) {
      var depKeys = item.depKeys,
          fn = item.fn,
          eId = item.eId;

      if (depKeys) {
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
    });
    toBeExecutedPropFns.forEach(makeItemHandler(eid_effectPropsReturnCb_, false, false));
  }
}