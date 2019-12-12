"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var checker = _interopRequireWildcard(require("../checker"));

var util = _interopRequireWildcard(require("../../support/util"));

var _dispatch = _interopRequireDefault(require("../../api/dispatch"));

var _lazyDispatch = _interopRequireDefault(require("../../api/lazy-dispatch"));

var _guessDuplicate = _interopRequireDefault(require("../base/guess-duplicate"));

function _default(module, reducer, rootReducerCanNotContainInputModule, tag) {
  if (rootReducerCanNotContainInputModule === void 0) {
    rootReducerCanNotContainInputModule = true;
  }

  if (!reducer) return;

  try {
    if (rootReducerCanNotContainInputModule) checker.checkReducerModuleName(module);else checker.checkModuleNameBasically(module);
  } catch (err) {
    (0, _guessDuplicate["default"])(err, module, 'reducer');
  }

  var _ccContext$reducer = _ccContext["default"].reducer,
      _reducer = _ccContext$reducer._reducer,
      _reducerCaller = _ccContext$reducer._reducerCaller,
      _lazyReducerCaller = _ccContext$reducer._lazyReducerCaller,
      _reducerFnName_fullFnNames_ = _ccContext$reducer._reducerFnName_fullFnNames_,
      _reducerModule_fnNames_ = _ccContext$reducer._reducerModule_fnNames_; // 防止同一个reducer被载入到不同模块时，setState附加逻辑不正确

  var newReducer = Object.assign({}, reducer);
  _reducer[module] = newReducer;
  var subReducerCaller = util.safeGetObjectFromObject(_reducerCaller, module);
  var subLazyReducerCaller = util.safeGetObjectFromObject(_lazyReducerCaller, module); // const subReducerRefCaller = util.safeGetObjectFromObject(_reducerRefCaller, module);
  // const subLazyReducerRefCaller = util.safeGetObjectFromObject(_lazyReducerRefCaller, module);

  var fnNames = util.safeGetArrayFromObject(_reducerModule_fnNames_, module); // 自动附加一个setState在reducer里

  if (!newReducer.setState) newReducer.setState = function (payload) {
    return payload;
  };
  var reducerNames = util.okeys(newReducer);
  reducerNames.forEach(function (name) {
    // avoid hot reload
    if (!fnNames.includes(name)) fnNames.push(name);
    var fullFnName = module + "/" + name;

    subReducerCaller[name] = function (payload, renderKey, delay) {
      return (0, _dispatch["default"])(fullFnName, payload, renderKey, delay);
    };

    subLazyReducerCaller[name] = function (payload, renderKey, delay) {
      return (0, _lazyDispatch["default"])(fullFnName, payload, renderKey, delay);
    }; // function wrappedReducerFn(payload, delay, idt){
    // }
    // subReducerRefCaller[name] = wrappedReducerFn;
    // function wrappedLazyReducerFn(payload, delay, idt) {
    // }
    // subLazyReducerRefCaller[name] = wrappedLazyReducerFn;


    var reducerFn = newReducer[name];

    if (typeof reducerFn !== 'function') {
      throw new Error("reducer key[" + name + "] 's value is not a function");
    } else {
      var targetFn = reducerFn;

      if (reducerFn.__fnName) {
        // 将某个已载入到模块a的reducer再次载入到模块b
        // if (util.isGenFn(reducerFn)) {
        //   targetFn = function* (payload, moduleState, actionCtx) { return reducerFn(payload, moduleState, actionCtx) };
        // } else {
        //   targetFn = (payload, moduleState, actionCtx) => reducerFn(payload, moduleState, actionCtx);
        // }
        targetFn = function targetFn(payload, moduleState, actionCtx) {
          return reducerFn(payload, moduleState, actionCtx);
        };

        newReducer[name] = targetFn;
      }

      targetFn.__fnName = name; //!!! 很重要，将真正的名字附记录上，否则名字是编译后的缩写名

      targetFn.__stateModule = module;
      targetFn.__reducerModule = module;
    } // 给函数绑上模块名，方便dispatch可以直接调用函数时，也能知道是更新哪个模块的数据，
    // 暂不考虑，因为cloneModule怎么处理，因为它们指向的是用一个函数
    // reducerFn.stateModule = module;


    var list = util.safeGetArrayFromObject(_reducerFnName_fullFnNames_, name); // avoid hot reload

    if (!list.includes(fullFnName)) list.push(fullFnName);
  });
}