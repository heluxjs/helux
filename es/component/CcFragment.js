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
import getStoredKeys from '../core/base/get-stored-keys';
import ccContext from '../cc-context';

const { shallowDiffers, getRegisterOptions } = util;
const { moduleName_stateKeys_ } = ccContext;
const nullSpan = React.createElement('span', { style: { display: 'none' } });

export default class CcFragment extends React.Component {
  constructor(props, context) {
    super(props, context);
    const registerOptions = getRegisterOptions(props.register);
    const {
      module, renderKeyClasses, tag, lite, compareProps = true, setup, bindCtxToMethod,
      watchedKeys = '*', connect = {}, reducerModule, state = {}, isSingle, storedKeys
    } = registerOptions;

    const { ccClassKey, ccKey, ccOption = {} } = props;

    let target_storedKeys = storedKeys;
    let target_reducerModule = reducerModule;
    let target_watchedKeys = watchedKeys;
    let target_ccClassKey = ccClassKey;
    let target_connect = connect;

    //直接使用<CcFragment />构造的cc实例, 尝试提取storedKeys, 然后映射注册信息，（注：registerDumb已在外部注册过）
    if (props.__$$regDumb !== true) {
      const _storedKeys = getStoredKeys(state, moduleName_stateKeys_[module], ccOption.storedKeys, registerOptions.storedKeys);

      const { _reducerModule, _watchedKeys, _ccClassKey, _connect } = mapRegistrationInfo(
        module, ccClassKey, renderKeyClasses, CC_FRAGMENT_PREFIX, watchedKeys, _storedKeys, connect, reducerModule, true
      );
      target_storedKeys = _storedKeys;
      target_reducerModule = _reducerModule;
      target_watchedKeys = _watchedKeys;
      target_ccClassKey = _ccClassKey;
      target_connect = _connect;
    }
    //直接使用<CcFragment />构造的cc实例，把ccOption.storedKeys当作registerStoredKeys


    buildRefCtx(this, {
      isSingle, ccKey, connect: target_connect, state, module, reducerModule: target_reducerModule,
      storedKeys: target_storedKeys, watchedKeys: target_watchedKeys, tag, ccClassKey: target_ccClassKey, ccOption, type: CC_FRAGMENT_PREFIX
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