"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.useConcent = exports.appendState = exports.cst = exports.CcFragment = exports.clearContextIfHot = exports.lazyReducer = exports.reducer = exports.getRefs = exports.executeAll = exports.execute = exports.createDispatcher = exports.ccContext = exports.lazyDispatch = exports.dispatch = exports.off = exports.emit = exports.getComputed = exports.getConnectedState = exports.getGlobalState = exports.getState = exports.setValue = exports.set = exports.setState = exports.setGlobalState = exports.call = exports.configure = exports.registerHookComp = exports.registerDumb = exports.register = exports.connectDumb = exports.connect = exports.run = exports.cloneModule = exports.startup = void 0;

var _startup2 = _interopRequireDefault(require("./api/startup"));

var _cloneModule2 = _interopRequireDefault(require("./api/clone-module"));

var _run2 = _interopRequireDefault(require("./api/run"));

var _connect2 = _interopRequireDefault(require("./api/connect"));

var _connectDumb2 = _interopRequireDefault(require("./api/connect-dumb"));

var _register2 = _interopRequireDefault(require("./api/register"));

var _registerDumb2 = _interopRequireDefault(require("./api/register-dumb"));

var _registerHookComp2 = _interopRequireDefault(require("./api/register-hook-comp"));

var _configure2 = _interopRequireDefault(require("./api/configure"));

var _call2 = _interopRequireDefault(require("./api/call"));

var _setGlobalState2 = _interopRequireDefault(require("./api/set-global-state"));

var _setState2 = _interopRequireDefault(require("./api/set-state"));

var _set2 = _interopRequireDefault(require("./api/set"));

var _setVal = _interopRequireDefault(require("./api/set-val"));

var _getState2 = _interopRequireDefault(require("./api/get-state"));

var _getGlobalState2 = _interopRequireDefault(require("./api/get-global-state"));

var _getComputed2 = _interopRequireDefault(require("./api/get-computed"));

var _emit2 = _interopRequireDefault(require("./api/emit"));

var _off2 = _interopRequireDefault(require("./api/off"));

var _dispatch2 = _interopRequireDefault(require("./api/dispatch"));

var _lazyDispatch2 = _interopRequireDefault(require("./api/lazy-dispatch"));

var _ccContext2 = _interopRequireDefault(require("./cc-context"));

var _createDispatcher2 = _interopRequireDefault(require("./api/create-dispatcher"));

var _execute2 = _interopRequireDefault(require("./api/execute"));

var _executeAll2 = _interopRequireDefault(require("./api/execute-all"));

var _getRefs2 = _interopRequireDefault(require("./api/get-refs"));

var _getConnectedState2 = _interopRequireDefault(require("./api/get-connected-state"));

var _appendState2 = _interopRequireDefault(require("./api/append-state"));

var _reducer2 = _interopRequireDefault(require("./api/reducer"));

var _lazyReducer2 = _interopRequireDefault(require("./api/lazy-reducer"));

var _clearContextIfHot2 = _interopRequireDefault(require("./api/clear-context-if-hot"));

var _CcFragment2 = _interopRequireDefault(require("./component/CcFragment"));

var _useConcent2 = _interopRequireDefault(require("./api/use-concent"));

var _cst = _interopRequireWildcard(require("./support/constant"));

var util = _interopRequireWildcard(require("./support/util"));

var startup = _startup2["default"];
exports.startup = startup;
var cloneModule = _cloneModule2["default"];
exports.cloneModule = cloneModule;
var run = _run2["default"];
exports.run = run;
var connect = _connect2["default"];
exports.connect = connect;
var connectDumb = _connectDumb2["default"];
exports.connectDumb = connectDumb;
var register = _register2["default"];
exports.register = register;
var registerDumb = _registerDumb2["default"];
exports.registerDumb = registerDumb;
var registerHookComp = _registerHookComp2["default"];
exports.registerHookComp = registerHookComp;
var configure = _configure2["default"];
exports.configure = configure;
var call = _call2["default"];
exports.call = call;
var setGlobalState = _setGlobalState2["default"];
exports.setGlobalState = setGlobalState;
var setState = _setState2["default"];
exports.setState = setState;
var set = _set2["default"];
exports.set = set;
var setValue = _setVal["default"];
exports.setValue = setValue;
var getState = _getState2["default"];
exports.getState = getState;
var getGlobalState = _getGlobalState2["default"];
exports.getGlobalState = getGlobalState;
var getConnectedState = _getConnectedState2["default"];
exports.getConnectedState = getConnectedState;
var getComputed = _getComputed2["default"];
exports.getComputed = getComputed;
var emit = _emit2["default"];
exports.emit = emit;
var off = _off2["default"];
exports.off = off;
var dispatch = _dispatch2["default"];
exports.dispatch = dispatch;
var lazyDispatch = _lazyDispatch2["default"];
exports.lazyDispatch = lazyDispatch;
var ccContext = _ccContext2["default"];
exports.ccContext = ccContext;
var createDispatcher = _createDispatcher2["default"];
exports.createDispatcher = createDispatcher;
var execute = _execute2["default"];
exports.execute = execute;
var executeAll = _executeAll2["default"];
exports.executeAll = executeAll;
var getRefs = _getRefs2["default"];
exports.getRefs = getRefs;
var reducer = _reducer2["default"];
exports.reducer = reducer;
var lazyReducer = _lazyReducer2["default"];
exports.lazyReducer = lazyReducer;
var clearContextIfHot = _clearContextIfHot2["default"];
exports.clearContextIfHot = clearContextIfHot;
var CcFragment = _CcFragment2["default"];
exports.CcFragment = CcFragment;
var cst = _cst;
exports.cst = cst;
var appendState = _appendState2["default"];
exports.appendState = appendState;
var useConcent = _useConcent2["default"];
exports.useConcent = useConcent;
var defaultExport = {
  cloneModule: cloneModule,
  emit: emit,
  off: off,
  connect: connect,
  connectDumb: connectDumb,
  register: register,
  registerDumb: registerDumb,
  registerHookComp: registerHookComp,
  configure: configure,
  dispatch: dispatch,
  lazyDispatch: lazyDispatch,
  startup: startup,
  run: run,
  call: call,
  setGlobalState: setGlobalState,
  setState: setState,
  set: set,
  setValue: setValue,
  getGlobalState: getGlobalState,
  getState: getState,
  getComputed: getComputed,
  getConnectedState: getConnectedState,
  ccContext: ccContext,
  createDispatcher: createDispatcher,
  execute: execute,
  executeAll: executeAll,
  getRefs: getRefs,
  reducer: reducer,
  lazyReducer: lazyReducer,
  clearContextIfHot: clearContextIfHot,
  CcFragment: CcFragment,
  cst: cst,
  appendState: appendState,
  useConcent: useConcent
};
var winCc = window.cc;

if (winCc) {
  if (winCc.ccContext && winCc.ccContext.info) {
    var existedVersion = winCc.ccContext.info.version;
    var nowVersion = ccContext.info.version; //webpack-dev-server模式下，有些引用了concent的插件或者中间件模块，如果和当前concent版本不一致的话，会保留另外一个concent在其包下
    //路径如 node_modules/concent-middleware-web-devtool/node_modules/concent（注，在版本一致时，不会出现此问题）
    //这样的就相当于隐形的实例化两个concent 上下文，这是不允许的

    if (existedVersion !== nowVersion) {
      throw new Error("a existed version concent " + existedVersion + " is different with current about to import concent " + nowVersion + ", \n      it may caused by some of your concent-eco-module with older version concent, please reinstall them (concent-*** module)");
    }
  }
}

util.bindToWindow('cc', defaultExport);
var _default = defaultExport;
exports["default"] = _default;