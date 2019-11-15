"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _constant = require("../../support/constant");

var _ccContext = _interopRequireDefault(require("../../cc-context"));

var keyWord = 'at Object.configure';

function getDupLocation(errStack) {
  if (!errStack) errStack = '';
  var arr = errStack.split('\n');
  var len = arr.length;
  var locationStr = '';

  for (var i = 0; i < len; i++) {
    var strPiece = arr[i];

    if (strPiece.includes(keyWord)) {
      var _ret = function () {
        // 这句话是具体调用configure的地方
        // "    at Object.configure (http://localhost:3001/static/js/main.chunk.js:13750:80)"
        var arr2 = strPiece.split(':');
        var lastIdx = arr2.length - 1;
        var locationStrArr = [];
        arr2.forEach(function (str, idx) {
          if (idx !== lastIdx) locationStrArr.push(str);
        }); // "    at Object.configure (http://localhost:3001/static/js/main.chunk.js:13750)"

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