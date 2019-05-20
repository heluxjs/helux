import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import register from '../core/helper/register';
import React from 'react';
import { CC_DISPATCHER } from '../support/constant';
import ccContext from '../cc-context';
import util from '../support/util';
export default function (CustomizedComponent) {
  var DefaultComponent =
  /*#__PURE__*/
  function (_React$Component) {
    _inheritsLoose(DefaultComponent, _React$Component);

    function DefaultComponent(props, context) {
      return _React$Component.call(this, props, context) || this;
    }

    var _proto = DefaultComponent.prototype;

    _proto.render = function render() {
      return this.props.children || React.createElement('span', {
        style: {
          display: 'none'
        }
      });
    };

    return DefaultComponent;
  }(React.Component);

  if (ccContext.refs[CC_DISPATCHER]) {
    if (util.isHotReloadMode()) {
      util.justTip("hot reload mode, CC_DISPATCHER existed");
    } else {
      throw new Error("CcDispatcher can only be initialize one time");
    }
  }

  var TargetComponent = CustomizedComponent || DefaultComponent;
  return register(CC_DISPATCHER, {
    isSingle: true,
    __checkStartUp: false,
    __calledBy: 'cc'
  })(TargetComponent);
}