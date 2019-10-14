"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = registerHookComp;

var _react = _interopRequireDefault(require("react"));

var _useConcent = _interopRequireDefault(require("./use-concent"));

function registerHookComp(options, ccClassKey) {
  var _options;

  if (typeof options === 'string') {
    _options = {
      module: options
    };
  } else {
    _options = Object.assign({}, options);
  }

  function buildCcHookComp(Dumb) {
    var _options2 = _options,
        _options2$memo = _options2.memo,
        memo = _options2$memo === void 0 ? true : _options2$memo;
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