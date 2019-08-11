import React from 'react';
import {
  CC_FRAGMENT_PREFIX, MODULE_DEFAULT,
} from '../support/constant';
import * as util from '../support/util';
import mapRegistrationInfo from '../core/base/map-registration-info';
import triggerSetupEffect from '../core/base/trigger-setup-effect';
import beforeUnmount from '../core/base/before-unmount';
import beforeMount from '../core/base/before-mount';
import buildRefCtx from '../core/ref/build-ref-ctx';
import getOutProps from '../core/base/get-out-props';
import getStoredKeys from '../core/base/get-stored-keys';
import ccContext from '../cc-context';

const { shallowDiffers } = util;
const { moduleName_stateKeys_ } = ccContext;
const nullSpan = React.createElement('span', { style: { display: 'none' } });

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
        storedKeys, watchedKeys: _watchedKeys, tag: ccTag, ccClassKey: _ccClassKey, ccOption, type: CC_FRAGMENT_PREFIX
      });
    } else {
      const outProps = getOutProps(props);
      const ccOption = outProps.ccOption || props.ccOption;
      const storedKeys = getStoredKeys(props.state, moduleName_stateKeys_[props.module], ccOption.storedKeys, props.storedKeys);
      const params = Object.assign({}, props, { storedKeys, ccOption, type: CC_FRAGMENT_PREFIX });
      buildRefCtx(this, params);
    }

    this.setState = this.ctx.setState;
    this.forceUpdate = this.ctx.forceUpdate;
    this.__$$compareProps = props.compareProps || true;

    //对于concent来说，ctx在constructor里构造完成，此时就可以直接把ctx传递给beforeMount了，
    //无需在将要给废弃的componentWillMount里调用beforeMount
    beforeMount(this, props.setup, props.bindCtxToMethod);
    // if (props.beforeMount) props.beforeMount(this.ctx);
  }

  componentDidMount() {
    triggerSetupEffect(this, true);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const isPropsChanged = this.__$$compareProps ? shallowDiffers(getOutProps(nextProps), getOutProps(this.props)) : false;
    return this.state !== nextState || isPropsChanged;
  }

  componentWillUpdate(nextProps) {
    //注意这里，一定要每次都取最新的绑在ctx上，确保交给renderProps的ctx参数里的state和props是最新的
    this.ctx.props = getOutProps(nextProps);
  }

  // componentDidUpdate(prevProps, prevState) {
  componentDidUpdate() {
    triggerSetupEffect(this);
    //!!! 将最新的state记录为prevState，方便下一轮渲染完毕执行triggerSetupEffect时做比较用
    
    //这里刻意用assign，让prevState指向一个新引用
    // this.ctx.prevState = Object.assign({}, this.state);

    //不采用上面的写法了，因为makeCcSetStateHandler里放弃了okeys写法，总是直接赋值最新的state引用
    this.ctx.prevState = this.state;
  }

  componentWillUnmount() {
    beforeUnmount(this);
    if (super.componentWillUnmount) super.componentWillUnmount();
  }

  render() {
    const { children, render } = this.props
    const view = render || children;

    if (typeof view === 'function') {
      const { __$$regDumb, mapProps } = this.props;
      const ctx = this.ctx;
      if (__$$regDumb !== true && mapProps) {//直接使用<CcFragment />实例化
        return view(mapProps(ctx)) || nullSpan;
      } else {
        return view(ctx) || nullSpan;
      }
    } else {
      if (React.isValidElement(view)) {
        //直接传递dom，无论state怎么改变都不会再次触发渲染
        throw new Error(`CcFragment's children can not b a react dom `);
      }
      return view;
    }
  }

}