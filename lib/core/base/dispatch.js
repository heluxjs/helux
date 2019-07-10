"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = _interopRequireDefault(require("../../support/util"));

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _pickOneRef = _interopRequireDefault(require("../../core/ref/pick-one-ref"));

function _default(isLazy, action, payLoadWhenActionIsString, delay, identity, _temp) {
  if (identity === void 0) {
    identity = '';
  }

  var _ref = _temp === void 0 ? {} : _temp,
      ccClassKey = _ref.ccClassKey,
      ccKey = _ref.ccKey,
      throwError = _ref.throwError;

  if (action === undefined && payLoadWhenActionIsString === undefined) {
    throw new Error("api doc: cc.dispatch(action:Action|String, payload?:any, delay?:number, idt?:string), when action is String, second param means payload");
  }

  var dispatchFn;

  try {
    if (ccClassKey && ccKey) {
      var uKey = _util["default"].makeUniqueCcKey(ccClassKey, ccKey);

      var targetRef = _ccContext["default"].refs[uKey];

      if (!targetRef) {
        throw new Error("no ref found for uniqueCcKey:" + uKey + "!");
      } else {
        dispatchFn = isLazy ? targetRef.$$lazyDispatch : targetRef.$$dispatch;
      }
    } else {
      var module = '';

      if (typeof action == 'string' && action.includes('/')) {
        module = action.split('/')[0];
      }

      var ref;

      if (module !== '*') {
        ref = (0, _pickOneRef["default"])(module);
      } else {
        ref = (0, _pickOneRef["default"])();
      }

      if (ref.cc.ccState.ccClassKey.startsWith(_constant.CC_FRAGMENT_PREFIX)) {
        dispatchFn = isLazy ? ref.__fragmentParams.lazyDispatch : ref.__fragmentParams.dispatch;
      } else {
        dispatchFn = isLazy ? ref.$$lazyDispatch : ref.$$dispatch;
      }
    }

    if (typeof action === 'string' && action.startsWith('*')) {
      var reducerName = action.split('/').pop();
      var rnList_ = _ccContext["default"].reducer._reducerName_FullReducerNameList_[reducerName];
      var tasks = [];
      rnList_.forEach(function (fullReducerName) {
        tasks.push(dispatchFn(fullReducerName, payLoadWhenActionIsString, delay, identity));
      });
      return Promise.all(tasks);
    } else {
      return dispatchFn(action, payLoadWhenActionIsString, delay, identity);
    }
  } catch (err) {
    if (throwError) throw err;else _util["default"].justWarning(err.message);
  }
}