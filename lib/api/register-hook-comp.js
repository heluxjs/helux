"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = registerHookComp;

var _react = _interopRequireDefault(require("react"));

var _useConcent = _interopRequireDefault(require("./use-concent"));

function registerHookComp(options) {
  function buildCcHookComp(Dumb) {
    var _options$memo = options.memo,
        memo = _options$memo === void 0 ? true : _options$memo;
    delete options.memo;

    var getComp = function getComp() {
      return function CcHookComp(props) {
        options.props = props;
        var ctx = (0, _useConcent["default"])(options); // 和registerDumb保持一致，如果定义了mapProps，传递mapProps的结果给Dumb

        if (options.mapProps) {
          return _react["default"].createElement(Dumb, ctx.mapped);
        } else {
          return _react["default"].createElement(Dumb, ctx);
        }
      };
    };

    if (memo && _react["default"].memo) {
      return _react["default"].memo(getComp());
    } else {
      return getComp();
    }
  }

  var Dumb = options.render;

  if (Dumb) {
    return buildCcHookComp(Dumb);
  } else {
    return function (Dumb) {
      return buildCcHookComp(Dumb);
    };
  }
}