"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var checker = _interopRequireWildcard(require("../checker"));

var util = _interopRequireWildcard(require("../../support/util"));

var _constant = require("../../support/constant");

var _configureDepFns = _interopRequireDefault(require("../base/configure-dep-fns"));

var _pickDepFns2 = _interopRequireDefault(require("../base/pick-dep-fns"));

var safeGetObjectFromObject = util.safeGetObjectFromObject,
    isPlainJsonObject = util.isPlainJsonObject;

function _default(module, computed, append, configureDep) {
  if (append === void 0) {
    append = false;
  }

  if (configureDep === void 0) {
    configureDep = true;
  }

  if (!isPlainJsonObject(computed)) {
    throw new Error("StartUpOption.computed." + module + "'s value is not a plain json object!");
  }

  checker.checkModuleName(module, false, "computed." + module + " is invalid");
  var ccComputed = _ccContext["default"].computed;

  var rootState = _ccContext["default"].store.getState();

  var rootComputedValue = ccComputed.getRootComputedValue();
  var rootComputedDep = ccComputed.getRootComputedDep();
  var rootComputedRaw = ccComputed.getRootComputedRaw();

  if (append) {
    var ori = rootComputedRaw[module];
    if (ori) Object.assign(ori, computed);else rootComputedRaw[module] = computed;
  } else {
    rootComputedRaw[module] = computed;
  }

  var moduleState = rootState[module];

  if (configureDep === true) {
    (0, _configureDepFns["default"])(_constant.CATE_MODULE, {
      module: module,
      state: moduleState,
      dep: rootComputedDep
    }, computed);
  }

  var _pickDepFns = (0, _pickDepFns2["default"])(true, _constant.CATE_MODULE, 'computed', rootComputedDep, module, moduleState, moduleState),
      pickedFns = _pickDepFns.pickedFns,
      setted = _pickDepFns.setted,
      changed = _pickDepFns.changed;

  pickedFns.forEach(function (_ref) {
    var retKey = _ref.retKey,
        fn = _ref.fn,
        depKeys = _ref.depKeys;
    var fnCtx = {
      retKey: retKey,
      setted: setted,
      changed: changed,
      stateModule: module,
      refModule: null,
      oldState: moduleState,
      committedState: moduleState,
      refCtx: null
    };
    var fistDepKey = depKeys[0];
    var computedValue;

    if (depKeys.length === 1 && fistDepKey !== '*') {
      computedValue = fn(moduleState[fistDepKey], moduleState[fistDepKey], fnCtx);
    } else {
      computedValue = fn(moduleState, moduleState, fnCtx);
    }

    var moduleComputedValue = safeGetObjectFromObject(rootComputedValue, module);
    ;
    moduleComputedValue[retKey] = computedValue;
  });
}