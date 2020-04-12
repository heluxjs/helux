/**
 * inspired by mobx's <Observer>{state=>state.name}</Observer>
 */
import React from 'react';
import { useConcentForOb } from '../core/hook/use-concent';

const obView = () => 'Ob view';

export default React.memo(function (props) {
  const { module, connect, classKey, render, children } = props;
  if (module && connect) {
    throw new Error(`module, connect can not been supplied both`);
  } else if (!module && !connect) {
    throw new Error(`module or connect should been supplied`);
  }

  const view = render || children || obView;
  const register = module ? { module } : { connect };
  register.lite = 1;
  const ctx = useConcentForOb(register, classKey);

  let state, computed;
  if (module) {
    state = ctx.moduleState;
    computed = ctx.moduleComputed;
  } else {
    state = ctx.connectedState;
    computed = ctx.connectedComputed;
  }

  return view([state, computed]);
})