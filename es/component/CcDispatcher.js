import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import register from '../core/helper/register';
import React from 'react';
import { CC_DISPATCHER } from '../support/constant';
export default register(CC_DISPATCHER, {
  isSingle: true,
  checkStartUp: false
})(
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(_class, _React$Component);

  function _class(props, context) {
    return _React$Component.call(this, props, context) || this;
  }

  var _proto = _class.prototype;

  _proto.render = function render() {
    return this.props.children || '';
  };

  return _class;
}(React.Component));