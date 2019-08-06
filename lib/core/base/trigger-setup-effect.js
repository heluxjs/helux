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

function _default(ref, callByDidMount) {
  var ctx = ref.ctx;
  var _ctx$effectMeta = ctx.effectMeta,
      effectItems = _ctx$effectMeta.effectItems,
      eid_effectReturnCb_ = _ctx$effectMeta.eid_effectReturnCb_;

  if (callByDidMount) {
    effectItems.forEach(function (item) {
      if (item.immediate === false) return;
      var cb = item.fn(ctx);
      if (cb) eid_effectReturnCb_[item.eId] = cb;
    });
  } else {
    //callByDidUpdate
    var prevState = ctx.prevState;
    var curState = ref.state;
    var toBeExecutedFns = [];
    effectItems.forEach(function (item) {
      // const { status, stateKeys, fn, eId } = item;
      // if (status === EFFECT_STOPPED) return;
      var stateKeys = item.stateKeys,
          fn = item.fn,
          eId = item.eId;

      if (stateKeys) {
        var keysLen = stateKeys.length;
        if (keysLen === 0) return;
        var shouldEffectExecute = false;

        for (var i = 0; i < keysLen; i++) {
          var key = stateKeys[i];
          var targetCurState = void 0,
              targetPrevState = void 0,
              targetKey = void 0;

          if (key.includes('/')) {
            var _key$split = key.split('/'),
                module = _key$split[0],
                unmoduledKey = _key$split[1];

            var _prevState = getPrevState(module);

            if (!_prevState) {
              util.justWarning("key[" + key + "] is invalid, its module[" + module + "] has not been declared in store!");
              continue;
            }

            if (!moduleName_stateKeys_[module].includes(unmoduledKey)) {
              util.justWarning("key[" + key + "] is invalid, its unmoduledKey[" + unmoduledKey + "] has not been declared in state!");
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
    });
    toBeExecutedFns.forEach(function (item) {
      var fn = item.fn,
          eId = item.eId;
      var cb = fn(ctx);
      if (cb) eid_effectReturnCb_[eId] = cb;
    });
  }
}