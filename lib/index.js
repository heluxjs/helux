"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.CcFragment = exports.createDispatcher = exports.ccContext = exports.dispatch = exports.connect = exports.off = exports.emitWith = exports.emit = exports.getState = exports.setState = exports.setGlobalState = exports.call = exports.configure = exports.registerSingleClassToDefault = exports.registerToDefault = exports.r = exports.register = exports.run = exports.load = exports.startup = void 0;

var _startup2 = _interopRequireDefault(require("./core/startup"));

var _load2 = _interopRequireDefault(require("./core/load"));

var _register2 = _interopRequireDefault(require("./core/register"));

var _r2 = _interopRequireDefault(require("./core/r"));

var _registerToDefault2 = _interopRequireDefault(require("./core/register-to-default"));

var _registerSingleClassToDefault2 = _interopRequireDefault(require("./core/register-single-class-to-default"));

var _configure2 = _interopRequireDefault(require("./core/configure"));

var _call2 = _interopRequireDefault(require("./core/call"));

var _setGlobalState2 = _interopRequireDefault(require("./core/set-global-state"));

var _setState2 = _interopRequireDefault(require("./core/set-state"));

var _getState2 = _interopRequireDefault(require("./core/get-state"));

var _emit2 = _interopRequireDefault(require("./core/emit"));

var _emitWith2 = _interopRequireDefault(require("./core/emit-with"));

var _off2 = _interopRequireDefault(require("./core/off"));

var _connect2 = _interopRequireDefault(require("./core/connect"));

var _dispatch2 = _interopRequireDefault(require("./core/dispatch"));

var _ccContext2 = _interopRequireDefault(require("./cc-context"));

var _createDispatcher2 = _interopRequireDefault(require("./core/create-dispatcher"));

var _CcFragment2 = _interopRequireDefault(require("./component/CcFragment"));

var startup = _startup2["default"];
exports.startup = startup;
var load = _load2["default"];
exports.load = load;
var run = _load2["default"];
exports.run = run;
var register = _register2["default"];
exports.register = register;
var r = _r2["default"];
exports.r = r;
var registerToDefault = _registerToDefault2["default"];
exports.registerToDefault = registerToDefault;
var registerSingleClassToDefault = _registerSingleClassToDefault2["default"];
exports.registerSingleClassToDefault = registerSingleClassToDefault;
var configure = _configure2["default"];
exports.configure = configure;
var call = _call2["default"];
exports.call = call;
var setGlobalState = _setGlobalState2["default"];
exports.setGlobalState = setGlobalState;
var setState = _setState2["default"];
exports.setState = setState;
var getState = _getState2["default"];
exports.getState = getState;
var emit = _emit2["default"];
exports.emit = emit;
var emitWith = _emitWith2["default"];
exports.emitWith = emitWith;
var off = _off2["default"];
exports.off = off;
var connect = _connect2["default"];
exports.connect = connect;
var dispatch = _dispatch2["default"];
exports.dispatch = dispatch;
var ccContext = _ccContext2["default"];
exports.ccContext = ccContext;
var createDispatcher = _createDispatcher2["default"];
exports.createDispatcher = createDispatcher;
var CcFragment = _CcFragment2["default"];
exports.CcFragment = CcFragment;
var defaultExport = {
  emit: emit,
  emitWith: emitWith,
  off: off,
  connect: connect,
  dispatch: dispatch,
  startup: startup,
  load: load,
  run: run,
  register: register,
  r: r,
  registerToDefault: registerToDefault,
  registerSingleClassToDefault: registerSingleClassToDefault,
  configure: configure,
  call: call,
  setGlobalState: setGlobalState,
  setState: setState,
  getState: getState,
  ccContext: ccContext,
  createDispatcher: createDispatcher,
  CcFragment: CcFragment
};

if (window) {
  window.cc = defaultExport;
}

var _default = defaultExport;
exports["default"] = _default;