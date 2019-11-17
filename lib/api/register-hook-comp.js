"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = registerHookComp;

var _react = _interopRequireDefault(require("react"));

var _useConcent = _interopRequireDefault(require("./use-concent"));

var _util = require("../support/util");

function registerHookComp(options, ccClassKey) {
  var _options = (0, _util.getRegisterOptions)(options);

  if (typeof _options.state === 'function') {
    _options.state = _options.state();
  }

  function buildCcHookComp(Dumb) {
    var _options$memo = _options.memo,
        memo = _options$memo === void 0 ? true : _options$memo;
    delete _options.memo;

    var getComp = function getComp() {
      return function CcHookComp(props) {
        _options.props = props;
        var ctx = (0, _useConcent["default"])(_options, ccClassKey); // 和registerDumb保持一致，如果定义了mapProps，传递mapProps的结果给Dumb

        if (_options.mapProps) {
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

  var Dumb = _options.render;

  if (Dumb) {
    return buildCcHookComp(Dumb);
  } else {
    return function (Dumb) {
      return buildCcHookComp(Dumb);
    };
  }
}