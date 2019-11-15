"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var keyWord = '.checkModuleNameAndState';

function getDupLocation(errStack) {
  if (!errStack) errStack = '';
  /** stack may like this: at CodeSandbox
  Error: module name duplicate! --verbose-info: module[SetupDemo]
    at makeError (https://xvcej.csb.app/node_modules/concent/src/support/util.js:128:15)
    at checkModuleName (https://xvcej.csb.app/node_modules/concent/src/core/checker/index.js:71:15)
  >>  at Object.checkModuleNameAndState (https://xvcej.csb.app/node_modules/concent/src/core/checker/index.js:90:3)
    at _default (https://xvcej.csb.app/node_modules/concent/src/core/state/init-module-state.js:25:13)
    at _default (https://xvcej.csb.app/node_modules/concent/src/api/configure.js:96:35)
  >>  at evaluate (https://xvcej.csb.app/src/pages/SetupDemo/model/index.js:13:24)
    at Jn (https://codesandbox.io/static/js/sandbox.fb6f2fde.js:1:146799)
    at e.value (https://codesandbox.io/static/js/sandbox.fb6f2fde.js:1:162063)
    at e.value (https://codesandbox.io/static/js/sandbox.fb6f2fde.js:1:202119)
    at t (https://codesandbox.io/static/js/sandbox.fb6f2fde.js:1:161805)
    ...
   or: at local web-dev-server
   Error: module name duplicate! --verbose-info: module[batchAddGroup]
    at makeError (http://localhost:3001/static/js/main.chunk.js:20593:17)
    at checkModuleName (http://localhost:3001/static/js/main.chunk.js:17256:15)
  >>  at Module.checkModuleNameAndState (http://localhost:3001/static/js/main.chunk.js:17273:3)
    at http://localhost:3001/static/js/main.chunk.js:19804:106
    at Object.configure (http://localhost:3001/static/js/main.chunk.js:13750:80)
  >>  at Module../src/components/layer/BatchOpGroup/model/index.js (http://localhost:3001/static/js/main.chunk.js:8374:55)
    at __webpack_require__ (http://localhost:3001/static/js/bundle.js:782:30)
    at fn (http://localhost:3001/static/js/bundle.js:150:20)
   */

  var arr = errStack.split('\n');
  var len = arr.length;
  var locationStr = '';

  for (var i = 0; i < len; i++) {
    var strPiece = arr[i];

    if (strPiece.includes(keyWord)) {
      var _ret = function () {
        var callConfigureIdx = i + 3; // 向下3句就是调用处
        // 这句话是具体调用configure的地方
        // at Module../src/components/layer/BatchOpGroup/model/index.js (http://localhost:3001/static/js/main.chunk.js:8374:55)

        var targetStrPiece = arr[callConfigureIdx];
        var arr2 = targetStrPiece.split(':');
        var lastIdx = arr2.length - 1;
        var locationStrArr = [];
        arr2.forEach(function (str, idx) {
          if (idx !== lastIdx) locationStrArr.push(str);
        }); // at Module../src/components/layer/BatchOpGroup/model/index.js (http://localhost:3001/static/js/main.chunk.js:8374

        locationStr = locationStrArr.join(':');
        return "break";
      }();

      if (_ret === "break") break;
    }
  }

  return locationStr;
}

var module_dupLocation_ = {};

var _default = function _default(err, module, tag) {
  if (err.code === _constant.ERR.CC_MODULE_NAME_DUPLICATE && _ccContext["default"].isHotReloadMode()) {
    var dupLocation = getDupLocation(err.stack);
    var key = tag + "|--link--|" + module;
    var prevLocation = !module_dupLocation_[key];

    if (!prevLocation) {
      // 没有记录过
      module_dupLocation_[key] = dupLocation;
    } else if (dupLocation !== prevLocation) {
      throw err;
    }
  } else {
    throw err;
  }
};

exports["default"] = _default;