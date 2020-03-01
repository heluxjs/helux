"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

exports.__esModule = true;
exports["default"] = _default;

var util = _interopRequireWildcard(require("../../support/util"));

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var _pickOneRef = _interopRequireDefault(require("../../core/ref/pick-one-ref"));

var makeUniqueCcKey = util.makeUniqueCcKey,
    justWarning = util.justWarning;

function _default(action, payLoadWhenActionIsString, rkOrOptions, delay, _temp) {
  if (rkOrOptions === void 0) {
    rkOrOptions = '';
  }

  var _ref = _temp === void 0 ? {} : _temp,
      ccClassKey = _ref.ccClassKey,
      ccKey = _ref.ccKey,
      throwError = _ref.throwError,
      _ref$refModule = _ref.refModule,
      refModule = _ref$refModule === void 0 ? '' : _ref$refModule;

  if (action === undefined && payLoadWhenActionIsString === undefined) {
    throw new Error("params type error");
  }

  var dispatchFn,
      module = '',
      fnName = '';

  try {
    if (ccClassKey && ccKey) {
      var uKey = makeUniqueCcKey(ccClassKey, ccKey);
      var targetRef = _ccContext["default"].refs[uKey];

      if (!targetRef) {
        justWarning("no ref found for ccUniqueKey:" + uKey + "!");
        return;
      } else {
        dispatchFn = targetRef.ctx.dispatch;
      }
    } else {
      if (typeof action == 'string') {
        if (action.includes('/')) {
          var _action$split = action.split('/'),
              m = _action$split[0],
              name = _action$split[1];

          module = m;
          fnName = name;
        } else {
          fnName = action;
        }
      }

      var ref;

      if (module && module !== '*') {
        ref = (0, _pickOneRef["default"])(module);
      } else if (refModule) {
        ref = (0, _pickOneRef["default"])(refModule);
      } else {
        ref = (0, _pickOneRef["default"])();
      }

      if (!ref) {
        justWarning("no ref found");
        return;
      }

      dispatchFn = ref.ctx.dispatch;
    }

    if (module === '*') {
      var fullFnNames = _ccContext["default"].reducer._fnName_fullFnNames_[fnName];
      if (!fullFnNames) return;
      var tasks = [];
      fullFnNames.forEach(function (fullFnName) {
        var _fullFnName$split = fullFnName.split('/'),
            fnModule = _fullFnName$split[0];

        if (excludeModules.includes(fnModule)) return;
        tasks.push(dispatchFn(fullFnName, payLoadWhenActionIsString, rkOrOptions, delay));
      });
      return Promise.all(tasks);
    } else {
      return dispatchFn(action, payLoadWhenActionIsString, rkOrOptions, delay);
    }
  } catch (err) {
    if (throwError) throw err;else {
      justWarning(err.message);
      return Promise.resolve();
    }
  }
}