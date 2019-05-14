"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = exports.CcFragment = exports.createDispatcher = exports.ccContext = exports.dispatch = exports.connect = exports.off = exports.emitWith = exports.emit = exports.getState = exports.setState = exports.setGlobalState = exports.invokeSingle = exports.invoke = exports.configure = exports.registerSingleClassToDefault = exports.registerToDefault = exports.r = exports.register = exports.startup = void 0;

var _startup2 = _interopRequireDefault(require("./core/startup"));

var _register2 = _interopRequireDefault(require("./core/register"));

var _r2 = _interopRequireDefault(require("./core/r"));

var _registerToDefault2 = _interopRequireDefault(require("./core/register-to-default"));

var _registerSingleClassToDefault2 = _interopRequireDefault(require("./core/register-single-class-to-default"));

var _configure2 = _interopRequireDefault(require("./core/configure"));

var _invoke2 = _interopRequireDefault(require("./core/invoke"));

var _invokeSingle2 = _interopRequireDefault(require("./core/invoke-single"));

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

var startup = _startup2.default;
exports.startup = startup;
var register = _register2.default;
exports.register = register;
var r = _r2.default;
exports.r = r;
var registerToDefault = _registerToDefault2.default;
exports.registerToDefault = registerToDefault;
var registerSingleClassToDefault = _registerSingleClassToDefault2.default;
exports.registerSingleClassToDefault = registerSingleClassToDefault;
var configure = _configure2.default;
exports.configure = configure;
var invoke = _invoke2.default;
exports.invoke = invoke;
var invokeSingle = _invokeSingle2.default;
exports.invokeSingle = invokeSingle;
var setGlobalState = _setGlobalState2.default;
exports.setGlobalState = setGlobalState;
var setState = _setState2.default;
exports.setState = setState;
var getState = _getState2.default;
exports.getState = getState;
var emit = _emit2.default;
exports.emit = emit;
var emitWith = _emitWith2.default;
exports.emitWith = emitWith;
var off = _off2.default;
exports.off = off;
var connect = _connect2.default;
exports.connect = connect;
var dispatch = _dispatch2.default;
exports.dispatch = dispatch;
var ccContext = _ccContext2.default;
exports.ccContext = ccContext;
var createDispatcher = _createDispatcher2.default;
exports.createDispatcher = createDispatcher;
var CcFragment = _CcFragment2.default;
exports.CcFragment = CcFragment;
var defaultExport = {
  emit: _emit2.default,
  emitWith: _emitWith2.default,
  off: _off2.default,
  connect: _connect2.default,
  dispatch: _dispatch2.default,
  startup: _startup2.default,
  register: _register2.default,
  r: _r2.default,
  registerToDefault: _registerToDefault2.default,
  registerSingleClassToDefault: _registerSingleClassToDefault2.default,
  configure: _configure2.default,
  invoke: _invoke2.default,
  invokeSingle: _invokeSingle2.default,
  setGlobalState: _setGlobalState2.default,
  setState: _setState2.default,
  getState: _getState2.default,
  ccContext: _ccContext2.default,
  createDispatcher: _createDispatcher2.default,
  CcFragment: _CcFragment2.default
};

if (window) {
  window.cc = defaultExport;
}

var _default = defaultExport;
exports.default = _default;