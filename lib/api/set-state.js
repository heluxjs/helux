"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _setState = _interopRequireDefault(require("../core/state/set-state"));

function throwApiCallError() {
  throw new Error("api doc: cc.setState(module:string, state:Object, lazyMs?:Number, throwError?:Boolean)");
}

function _default(module, state, lazyMs, throwError) {
  if (lazyMs === void 0) {
    lazyMs = -1;
  }

  if (throwError === void 0) {
    throwError = false;
  }

  if (module === undefined && state === undefined) {
    throwApiCallError();
  }

  if (typeof module !== 'string') {
    throwApiCallError();
  }

  (0, _setState["default"])(module, state, lazyMs, throwError);
}

;