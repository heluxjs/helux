import React from 'react';
import {
  CC_FRAGMENT_PREFIX, MODULE_DEFAULT,
} from '../support/constant';
import * as util from '../support/util';
import mapRegistrationInfo from '../core/base/map-registration-info';
import triggerSetupEffect from '../core/base/trigger-setup-effect';
import beforeUnmount from '../core/base/before-unmount';
import beforeMount from '../core/base/before-mount';
import buildRefCtx from '../core/base/build-ref-ctx';
import getOutProps from '../core/base/get-out-props';
import getStoredKeys from '../core/base/get-stored-keys';
import ccContext from '../cc-context';

const { shallowDiffers } = util;
const { moduleName_stateKeys_ } = ccContext;

export default class CcFragment extends React.Component {
  constructor(props, context) {
    super(props, context);

    // 非registerDumb调用，即直接使用<CcFragment />做初始化， 把组件的注册信息映射到ccContext
    if (props.__$$regDumb !== true) {
      const {
        module = MODULE_DEFAULT, ccClassKey: propsCcClassKey, ccKey, ccTag,
        watchedKeys = '*', ccOption = {}, connect = {}, reducerModule, state = {}, isSingle,
      } = props;
      //直接使用<CcFragment />构造的cc实例，把ccOption.storedKeys当作registerStoredKeys
      const { _module, _reducerModule, _watchedKeys, _ccClassKey, _connect } = mapRegistrationInfo(
        module, propsCcClassKey, CC_FRAGMENT_PREFIX, watchedKeys, ccOption.storedKeys, connect, reducerModule, true
      );

      const storedKeys = getStoredKeys(state, moduleName_stateKeys_[_module], ccOption.storedKeys, []);
      buildRefCtx(this, {
        isSingle, ccKey, connect: _connect, state, module: _module, reducerModule: _reducerModule,
        storedKeys, watchedKeys: _watchedKeys, tag: ccTag, ccClassKey: _ccClassKey, ccOption
      });
    } else {
      const outProps = getOutProps(props);
      const ccOption = outProps.ccOption || props.ccOption;
      const storedKeys = getStoredKeys(props.state, moduleName_stateKeys_[props.module], ccOption.storedKeys, props.storedKeys);
      const params = Object.assign({}, props, { storedKeys, ccOption });
      buildRefCtx(this, params);
    }

    this.setState = this.ctx.setState;
    this.forceUpdate = this.ctx.forceUpdate;
    beforeMount(this, props.setup, props.bindCtxToMethod);
  }

  componentDidMount() {
    triggerSetupEffect(this, true);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState || shallowDiffers(getOutProps(nextProps), getOutProps(this.props));
  }

  componentWillUpdate(nextProps, nextState) {
    //注意这里，一定要每次都取最新的绑在ctx上，确保交给renderProps的ctx参数里的state和props是最新的
    this.ctx.props = getOutProps(nextProps);
    this.ctx.state = nextState;
  }

  // componentDidUpdate(prevProps, prevState) {
  componentDidUpdate() {
    triggerSetupEffect(this);
    //!!! 将最新的state记录为prevState，方便下一轮渲染完毕执行triggerSetupEffect时做比较用
    this.ctx.prevState = this.state;
    // this.ctx.prevProps = this.ctx.props;
  }

  componentWillUnmount() {
    beforeUnmount(this);
    if (super.componentWillUnmount) super.componentWillUnmount();
  }

  render() {
    const { children, render } = this.props
    const view = render || children;
    
    if (typeof view === 'function') {
      // return view(this.ctx) || React.createElement(Fragment);
      return view(this.ctx) || React.createElement('span', { style: { display: 'none' } });
    } else {
      if (React.isValidElement(view)) {
        util.justWarning(`you are trying to specify a react dom to be CcFragment's children, it will never been rendered again no matter how your state changed!!!`);
      }
      return view;
    }
  }

}