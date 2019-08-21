"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _util = _interopRequireDefault(require("../../support/util"));

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _pickOneRef = _interopRequireDefault(require("../../core/ref/pick-one-ref"));

function _default(isLazy, action, payLoadWhenActionIsString, renderKey, delay, _temp) {
  if (renderKey === void 0) {
    renderKey = '';
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
        dispatchFn = isLazy ? targetRef.ctx.lazyDispatch : targetRef.ctx.dispatch;
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

      dispatchFn = isLazy ? ref.ctx.lazyDispatch : ref.ctx.dispatch;
    }

    if (typeof action === 'string' && action.startsWith('*')) {
      var reducerModName = action.split('/').pop();
      var fullFnNames = _ccContext["default"].reducer._reducerFnName_fullFnNames_[reducerModName];
      if (!fullFnNames) return;
      var tasks = [];
      fullFnNames.forEach(function (fullFnName) {
        tasks.push(dispatchFn(fullFnName, payLoadWhenActionIsString, renderKey, delay));
      });
      return Promise.all(tasks);
    } else {
      return dispatchFn(action, payLoadWhenActionIsString, renderKey, delay);
    }
  } catch (err) {
    if (throwError) throw err;else _util["default"].justWarning(err.message);
  }
}