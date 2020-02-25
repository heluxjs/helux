import React from 'react';
import { CC_FRAGMENT_PREFIX } from '../support/constant';
import * as util from '../support/util';
import mapRegistrationInfo from '../core/base/map-registration-info';
import beforeUnmount from '../core/base/before-unmount';
import beforeMount from '../core/base/before-mount';
import didMount from '../core/base/did-mount';
import didUpdate from '../core/base/did-update';
import buildRefCtx from '../core/ref/build-ref-ctx';
import getOutProps from '../core/base/get-out-props';
import ccContext from '../cc-context';

const { shallowDiffers, getRegisterOptions } = util;
const nullSpan = React.createElement('span', { style: { display: 'none' } });

class CcFragment extends React.Component {
  constructor(props, context) {
    super(props, context);
    const registerOptions = getRegisterOptions(props.register);
    const {
      module, renderKeyClasses, tag, lite, compareProps = true, setup, bindCtxToMethod,
      watchedKeys = '*', connect = {}, isSingle, storedKeys = []
    } = registerOptions;

    let state = registerOptions.state || {};
    if (typeof state === 'function') {
      state = state();
    }
  
    const { ccClassKey, ccKey, ccOption = {} } = props;

    let target_watchedKeys = watchedKeys;
    let target_ccClassKey = ccClassKey;
    let target_connect = connect;

    //直接使用<CcFragment />构造的cc实例, 尝试提取storedKeys, 然后映射注册信息，（注：registerDumb创建的组件已在外部调用过mapRegistrationInfo）
    if (props.__$$regDumb !== true) {
      const {_watchedKeys, _ccClassKey, _connect } = mapRegistrationInfo(
        module, ccClassKey, renderKeyClasses, CC_FRAGMENT_PREFIX, watchedKeys, storedKeys, connect, true
      );
      target_watchedKeys = _watchedKeys;
      target_ccClassKey = _ccClassKey;
      target_connect = _connect;
    }
    //直接使用<CcFragment />构造的cc实例，把ccOption.storedKeys当作registerStoredKeys

    buildRefCtx(this, {
      isSingle, ccKey, connect: target_connect, state, module,
      storedKeys, watchedKeys: target_watchedKeys, tag, ccClassKey: target_ccClassKey, ccOption, type: CC_FRAGMENT_PREFIX
    }, lite);

    this.__$$compareProps = compareProps;
    //对于concent来说，ctx在constructor里构造完成，此时就可以直接把ctx传递给beforeMount了，
    //无需在将要给废弃的componentWillMount里调用beforeMount
    beforeMount(this, setup, bindCtxToMethod);
  }

  componentDidMount() {
    didMount(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const isPropsChanged = this.__$$compareProps ? shallowDiffers(getOutProps(nextProps), getOutProps(this.props)) : false;
    return this.state !== nextState || isPropsChanged;
  }

  // componentDidUpdate(prevProps, prevState) {
  componentDidUpdate() {
    didUpdate(this);
  }

  componentWillUnmount() {
    if (super.componentWillUnmount) super.componentWillUnmount();
    beforeUnmount(this);
  }

  render() {
    //注意这里，一定要每次都取最新的绑在ctx上，确保交给renderProps的ctx参数里的state和props是最新的
    const thisProps = this.props;
    this.ctx.prevProps = this.ctx.props;
    this.ctx.props = getOutProps(thisProps);

    const { children, render } = thisProps;
    const view = render || children;

    if (typeof view === 'function') {
      const { __$$regDumb, register = {} } = thisProps;
      const ctx = this.ctx;

      if (__$$regDumb !== true && register.mapProps) {//直接使用<CcFragment />实例化
        ctx.mapped = register.mapProps(ctx) || {};
        return view(ctx.mapped) || nullSpan;
      }

      return view(ctx) || nullSpan;
    } else {
      if (React.isValidElement(view)) {
        //直接传递dom，无论state怎么改变都不会再次触发渲染
        throw new Error(`CcFragment's children can not b a react dom `);
      }
      return view;
    }
  }

}

export default CcFragment;