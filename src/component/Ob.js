/**
 * inspired by mobx's <Observer>{state=>state.name}</Observer>
 */
import * as React from 'react';
import { useConcentForOb } from '../core/hook/use-concent';

const obView = () => 'miss render prop or children';

let TargetComp = () => React.createElement('h1', {}, 'Ob component needs react ver lte 16.8');

if (React.memo) {
  TargetComp = React.memo(function (props) {
    const { module, connect, classKey, render, children } = props;
    if (module && connect) {
      throw new Error(`module, connect can not been supplied both`);
    } else if (!module && !connect) {
      throw new Error(`module or connect should been supplied`);
    }

    const view = render || children || obView;
    const register = module ? { module } : { connect };
    // 设置为1，最小化ctx够造过程，仅附加状态数据，衍生数据、和reducer相关函数
    register.lite = 1;
    const ctx = useConcentForOb(register, classKey);
    const { mr, cr, r } = ctx;

    let state, computed;
    if (module) {
      state = ctx.moduleState;
      computed = ctx.moduleComputed;
    } else {
      state = ctx.connectedState;
      computed = ctx.connectedComputed;
    }

    return view([state, computed, { mr, cr, r }]);
  })
}

export default TargetComp;
