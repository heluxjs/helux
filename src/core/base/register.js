import React from 'react';
// import hoistNonReactStatic from 'hoist-non-react-statics';
import {
  MODULE_DEFAULT, CC_DISPATCHER, CC_CLASS, CC_CUSTOMIZE,
} from '../../support/constant';
import ccContext from '../../cc-context';
import * as util from '../../support/util';
import catchCcError from './catch-cc-error';
import * as hf from '../state/handler-factory';
import mapRegistrationInfo from './map-registration-info';
import buildRefCtx from '../ref/build-ref-ctx';
import beforeMount from './before-mount';
import didMount from './did-mount';
import didUpdate from './did-update';
import beforeUnMount from './before-unmount';
import beforeRender from '../ref/before-render';

const { ccClassDisplayName, styleStr, color, getPassToMapWaKeys, shallowDiffers, evalState } = util;
const { runtimeVar } = ccContext;
const cl = color;
const ss = styleStr;
const setupErr = info => new Error('can not defined setup both in register options and class body ' + '--verbose:' + info);

export default function register({
  module = MODULE_DEFAULT,
  state = {},
  watchedKeys = '-',
  storedKeys = [],
  setup = null,
  persistStoredKeys,
  connect = {},
  tag,
  lite,
  isPropsProxy = false,
  isSingle = false,
  renderKeyClasses,
  __checkStartUp = true,
  compareProps = true,
  __calledBy,
} = {}, ccClassKey = '') {
  try {

    const { _module, _ccClassKey, _connect } = mapRegistrationInfo(
      module, ccClassKey, renderKeyClasses, CC_CLASS, getPassToMapWaKeys(watchedKeys), storedKeys, connect,  __checkStartUp, __calledBy
    );

    return function (ReactClass) {
      if (ReactClass.prototype && ReactClass.prototype.$$attach) {
        throw new Error(`register a cc class is prohibited!`);
      }
      // const isClsPureComponent = ReactClass.prototype.isPureReactComponent;

      const ToBeExtendedClass = isPropsProxy === false ? ReactClass : React.Component;
      const staticSetup = ToBeExtendedClass.$$setup;

      const _CcClass = class CcClass extends ToBeExtendedClass {

        constructor(props, context) {
          try {
            super(props, context);
            const optState = evalState(state);
            const thisState = this.state || {};
            const privState  = Object.assign(thisState, optState);

            this.$$attach = this.$$attach.bind(this);

            // props.ccOption
            const params = Object.assign({}, props, {
              isSingle, module: _module, tag, state: privState, type: CC_CLASS, insType: CC_CUSTOMIZE,
              watchedKeys, ccClassKey: _ccClassKey, connect: _connect, storedKeys, persistStoredKeys
            });
            buildRefCtx(this, params, lite);
            this.ctx.reactSetState = hf.makeRefSetState(this);
            this.ctx.reactForceUpdate = hf.makeRefForceUpdate(this);

            if (setup && (this.$$setup || staticSetup)) {
              throw setupErr('ccUniqueKey ' + this.ctx.ccUniqueKey);
            }

            
            if (!isPropsProxy) {
              if (this.$$setup) this.$$setup = this.$$setup.bind(this);
              beforeMount(this, setup || this.$$setup || staticSetup, false);
            }
            // isPropsProxy为true时，延迟到$$attach里执行beforeMount

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
          const ctx = this.ctx;
          ctx.childRef = childRef;
          childRef.ctx = ctx;

          ctx.reactSetState = childRef.setState.bind(childRef);;
          ctx.reactForceUpdate = childRef.forceUpdate.bind(childRef);

          // 让孩子引用的setState forceUpdate 指向父容器事先构造好的setState forceUpdate
          childRef.setState = ctx.setState;
          childRef.forceUpdate = ctx.forceUpdate;
          
          //替换掉ctx.__$$ccSetState ctx.__$$ccForceUpdate, 让changeRefState正确的更新目标实例
          ctx.__$$ccSetState = hf.makeCcSetStateHandler(childRef, this);
          ctx.__$$ccForceUpdate = hf.makeCcForceUpdateHandler(childRef);

          if (!childRef.state) childRef.state = {};
          const childRefState = childRef.state;
          const thisState = this.state;
          Object.assign(childRefState, thisState);
          beforeRender(childRef);
          
          //避免提示 Warning: Expected {Component} state to match memoized state before componentDidMount
          // const newState = Object.assign({}, childRefState, thisState);
          // this.state = newState; // bad writing
          // okeys(newState).forEach(key => thisState[key] = newState[key]);

          if (childRef.$$setup) childRef.$$setup = childRef.$$setup.bind(childRef);
          if (setup && (childRef.$$setup || staticSetup)) throw setupErr('ccUniqueKey ' + ctx.ccUniqueKey);
          beforeMount(childRef, setup || childRef.$$setup || staticSetup, false);
        }

        componentDidMount() {
          if (super.componentDidMount) super.componentDidMount();
          didMount(this);


          // 代理模式不再强制检查$$attach是否给调用
          // if (isPropsProxy === true && !this.ctx.childRef) {
          //   throw new Error('you forgot to call this.props.$$attach(this) in constructor, you must call it after state assign expression next line!');
          // }
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
          if (super.componentDidUpdate) super.componentDidUpdate(prevProps, prevState, snapshot);
          didUpdate(this);
        }

        componentWillUnmount() {
          if (super.componentWillUnmount) super.componentWillUnmount();
          beforeUnMount(this);
        }

        render() {
          this.ctx.prevProps = this.ctx.props;
          this.ctx.props = this.props;

          if (runtimeVar.isDebug) {
            console.log(ss(`@@@ render ${ccClassDisplayName(_ccClassKey)}`), cl());
          }
          if (isPropsProxy === false) {
            beforeRender(this);
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
