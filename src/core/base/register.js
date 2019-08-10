import React from 'react';
// import hoistNonReactStatic from 'hoist-non-react-statics';
import {
  MODULE_DEFAULT, ERR, CC_DISPATCHER, CC_CLASS_PREFIX
} from '../../support/constant';
import ccContext from '../../cc-context';
import util, { okeys, shallowDiffers } from '../../support/util';
import catchCcError from './catch-cc-error';
import * as hf from '../state/handler-factory';
import mapRegistrationInfo from './map-registration-info';
import buildRefCtx from '../ref/build-ref-ctx';
import beforeMount from './before-mount';
import beforeUnMount from './before-unmount';
import triggerSetupEffect from './trigger-setup-effect';
import triggerComputedAndWatch from './trigger-computed-and-watch';
import getStoredKeys from './get-stored-keys';


const { moduleName_stateKeys_ } = ccContext;
const {  ccClassDisplayName, styleStr, color, verboseInfo, makeError } = util;
const cl = color;
const ss = styleStr;
const me = makeError;
const vbi = verboseInfo;

export default function register({
  module = MODULE_DEFAULT,
  watchedKeys: inputWatchedKeys = '*',
  storedKeys: inputStoredKeys = [],
  persistStoredKeys,
  connect = {},
  tag = '',
  reducerModule,
  isPropsProxy = false,
  isSingle = false,
  __checkStartUp = true,
  compareProps = true,
  __calledBy,
} = {}, ccClassKey = '') {
  try {

    const { _module, _reducerModule, _watchedKeys, _ccClassKey, _connect } = mapRegistrationInfo(
      module, ccClassKey, CC_CLASS_PREFIX, inputWatchedKeys, inputStoredKeys, connect, reducerModule, __checkStartUp, __calledBy
    );

    return function (ReactClass) {
      if (ReactClass.prototype && ReactClass.prototype.$$attach) {
        throw me(ERR.CC_REGISTER_A_CC_CLASS, vbi(`CcClass can not been registered!`));
      }
      // const isClsPureComponent = ReactClass.prototype.isPureReactComponent;

      const ToBeExtendedClass = isPropsProxy === false ? ReactClass : React.Component;
      const _CcClass = class CcClass extends ToBeExtendedClass {

        constructor(props, context) {
          try {
            super(props, context);
            this.state = this.state || {};
            this.$$attach = this.$$attach.bind(this);
            const _tag = props.ccTag || tag;
            const ccOption = props.ccOption || { persistStoredKeys };

            const declaredState = this.state;
            const _storedKeys = getStoredKeys(declaredState, moduleName_stateKeys_[_module], ccOption.storedKeys, inputStoredKeys);
            const params = Object.assign({}, props, {
              isSingle, module: _module, reducerModule: _reducerModule, tag: _tag, state: declaredState, type: CC_CLASS_PREFIX,
              watchedKeys: _watchedKeys, ccClassKey: _ccClassKey, connect: _connect, storedKeys: _storedKeys, ccOption
            });
            buildRefCtx(this, params);

            if (this.$$setup) this.$$setup = this.$$setup.bind(this);
            beforeMount(this, this.$$setup, false);
          } catch (err) {
            catchCcError(err);
          }
        }

        // 如果代理组件或者继承组件没有没有实现scu，则同时比较nextState nextProps
        // 因为nextProps不同也会导致重渲染，所以需要约束用户不要把可变数据从props传下来，以提高性能
        shouldComponentUpdate(nextProps, nextState) {
          const childRef = this.ctx.childRef;
          if (childRef && childRef.shouldComponentUpdate) {
            return childRef.shouldComponentUpdate(nextProps, nextState);
          } else if (super.shouldComponentUpdate) {
            return super.shouldComponentUpdate(nextProps, nextState);
          }
          const isPropsChanged = compareProps ? shallowDiffers(this.props, nextProps) : false;
          return this.state !== nextState || isPropsChanged;
        }

        //!!! 存在多重装饰器时, 或者用户想使用this.props.***来用concent类时
        //!!! 必需在类的【constructor】 里调用 this.props.$$attach(this),紧接着state定义之后
        $$attach(childRef) {
          this.ctx.reactSetState = childRef.setState.bind(childRef);;
          this.ctx.reactForceUpdate = childRef.forceUpdate.bind(childRef);

          // childRef.childRefRea
          ['setState', 'forceUpdate'].forEach(m => {
            childRef[m] = this[m].bind(this);
          });
          
          const ctx = this.ctx;
          ctx.childRef = childRef;
          childRef.ctx = ctx;
          //替换掉cc.__$$ccSetState cc.__$$ccForceUpdate, 让changeRefState正确的更新目标实例
          ctx.__$$ccSetState = hf.makeCcSetStateHandler(childRef, this);
          ctx.__$$ccForceUpdate = hf.makeCcForceUpdateHandler(childRef);

          let childRefState = childRef.state;
          const thisState = this.state;
          if(!childRefState) childRefState = childRef.state = {};
          const newState = Object.assign({}, childRefState, thisState);
          childRef.state = newState;//在childRef进入首次render流程前，提前赋值
          ctx.state = newState;
          
          //避免提示 Warning: Expected {Component} state to match memoized state before componentDidMount
          // this.state = newState; // bad writing
          okeys(newState).forEach(key => thisState[key] = newState[key]);
          beforeMount(childRef, childRef.$$setup);
        }

        componentDidMount() {
          if (super.componentDidMount) super.componentDidMount();
          
          // 代理模式不再强制检查$$attach是否给调用
          // if (isPropsProxy === true && !this.ctx.childRef) {
          //   throw new Error('you forgot to call this.props.$$attach(this) in constructor, you must call it after state assign expression next line!');
          // }
          triggerSetupEffect(this, true);
        }

        componentDidUpdate() {
          if (super.componentDidUpdate) super.componentDidUpdate();
          triggerSetupEffect(this);
          this.ctx.prevState = Object.assign({}, this.state);
        }

        componentWillUnmount() {
          if (super.componentWillUnmount) super.componentWillUnmount();
          beforeUnMount(this);
        }

        render() {
          if (ccContext.isDebug) {
            console.log(ss(`@@@ render ${ccClassDisplayName(_ccClassKey)}`), cl());
          }
          if (isPropsProxy === false) {
            //now cc class extends ReactClass, call super.render()
            return super.render();
          } else {
            //将$$attach传递下去，让用户在构造器里紧接着super之后调this.props.$$attach()
            return React.createElement(ReactClass, { ctx: this.ctx, $$attach: this.$$attach });
          }
        }
      }

      if (_ccClassKey === CC_DISPATCHER) _CcClass.displayName = 'CcDispatcher';
      else _CcClass.displayName = ccClassDisplayName(_ccClassKey);
      return _CcClass;
    }
  } catch (err) {
    catchCcError(err);
  }
}
