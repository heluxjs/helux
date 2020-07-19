"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var checker = _interopRequireWildcard(require("../checker"));

var util = _interopRequireWildcard(require("../../support/util"));

var _privConstant = require("../../support/priv-constant");

var _dispatch = _interopRequireDefault(require("../../api/dispatch"));

function _default(module, reducer) {
  if (reducer === void 0) {
    reducer = {};
  }

  var tip = "module[" + module + "] reducer";

  if (!util.isPJO(reducer)) {
    throw new Error(tip + " " + _privConstant.NOT_A_JSON);
  }

  checker.checkModuleName(module, false, tip + " is invalid");
  var _ccContext$reducer = _ccContext["default"].reducer,
      _reducer = _ccContext$reducer._reducer,
      _caller = _ccContext$reducer._caller,
      _fnName_fullFnNames_ = _ccContext$reducer._fnName_fullFnNames_,
      _module_fnNames_ = _ccContext$reducer._module_fnNames_; // 防止同一个reducer被载入到不同模块时，setState附加逻辑不正确

  var newReducer = Object.assign({}, reducer);
  _reducer[module] = newReducer;
  var subReducerCaller = util.safeGet(_caller, module); // const subReducerRefCaller = util.safeGet(_reducerRefCaller, module);

  var fnNames = util.safeGetArray(_module_fnNames_, module); // 自动附加一个setState在reducer里

  if (!newReducer.setState) newReducer.setState = function (payload) {
    return payload;
  };
  var reducerFnNames = util.okeys(newReducer);
  reducerFnNames.forEach(function (name) {
    // avoid hot reload
    if (!fnNames.includes(name)) fnNames.push(name);
    var fullFnName = module + "/" + name;
    var list = util.safeGetArray(_fnName_fullFnNames_, name); // avoid hot reload

    if (!list.includes(fullFnName)) list.push(fullFnName);

    subReducerCaller[name] = function (payload, renderKeyOrOptions, delay) {
      return (0, _dispatch["default"])(fullFnName, payload, renderKeyOrOptions, delay);
    };

    var reducerFn = newReducer[name];

    if (typeof reducerFn !== 'function') {
      throw new Error("reducer key[" + name + "] 's value is not a function");
    } else {
      var targetFn = reducerFn;

      if (reducerFn.__fnName) {
        // 将某个已载入到模块a的reducer再次载入到模块b
        targetFn = function targetFn(payload, moduleState, actionCtx) {
          return reducerFn(payload, moduleState, actionCtx);
        };

        newReducer[name] = targetFn;
      }

      targetFn.__fnName = name; //!!! 很重要，将真正的名字附记录上，否则名字是编译后的缩写名

      targetFn.__stateModule = module; // AsyncFunction GeneratorFunction Function

      targetFn.__ctName = reducerFn.__ctName || reducerFn.constructor.name;
      targetFn.__isAsync = util.isAsyncFn(reducerFn);
    } // 给函数绑上模块名，方便dispatch可以直接调用函数时，也能知道是更新哪个模块的数据，
    // 暂不考虑，因为cloneModule怎么处理，因为它们指向的是用一个函数
    // reducerFn.stateModule = module;

  });
}