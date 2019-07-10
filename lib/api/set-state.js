"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = _default;

var _setState = _interopRequireDefault(require("../core/state/set-state"));

function throwApiCallError() {
  throw new Error("api doc: cc.setState(module:string, state:object, delayMs?:number, skipMiddleware?:boolean, throwError?:boolean)");
}

function _default(module, state, delayMs, identity, skipMiddleware, throwError) {
  if (delayMs === void 0) {
    delayMs = -1;
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

  (0, _setState["default"])(module, state, delayMs, identity, skipMiddleware, throwError);
}