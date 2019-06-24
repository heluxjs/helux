import CcFragment from '../component/CcFragment';
import * as util from '../support/util';
import React from 'react';


function _connectDumb(mapProps, module, connect, state, setup, bindCtxToMethod, mapState, alias, Dumb, props) {
  const render = (ctx) => {
    const { connectedState } = ctx;
    if (mapProps) {
      //和mapState保持参数一致
      const generatedProps = mapProps(ctx);
      if(mapState) throw new Error('mapState is not allowed when you specify mapProps in args');
      return React.createElement(Dumb, generatedProps);
    } else {
      let mappedState = {};
      if (mapState) {
        if (mapState === true) {
          mappedState = util.flatObject(connectedState, alias);
        } else {
          //mapState重点强调映射state，所以前三位参数都是给用户选择的，最后一个才是ctx
          mappedState = mapState(ctx) || {};
        }
      }

      ctx.mappedState = mappedState;//将mappedState绑在ctx上，方便其他地方使用
      return React.createElement(Dumb, { mappedState, ctx, props });
    }
  };

  //ccKey由实例化的Dumb组件props上透传下来
  return React.createElement(CcFragment, { key:props.key, ccKey: props.ccKey, props, module, connect, state, setup, bindCtxToMethod, render });
}

export default ({ mapProps, mapState, module, connect, state, setup, bindCtxToMethod, alias = {} }) => Dumb => {
  //这样写可以避免react dev tool显示的dom为Unknown
  const ConnectedFragment = props => _connectDumb(mapProps, module, connect, state, setup, bindCtxToMethod, mapState, alias, Dumb, props);
  return ConnectedFragment;
}
