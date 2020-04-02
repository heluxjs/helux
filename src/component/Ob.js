/**
 * inspired by mobx's <Observer>{state=>state.name}</Observer>
 */
import React from 'react';
import useConcent from '../api/use-concent';

export default React.memo(function (props) {
  const firstProps = React.useRef(props);
  const { module, connect, render, children } = firstProps.current;
  if (module && connect) {
    throw new Error(`module, connect can not been supplied both`);
  } else if (!module && !connect) {
    throw new Error(`module or connect should been supplied`);
  }

  const view = render || children;
  const register = module ? { module } : { connect };
  register.lite = 1;
  const ctx = useConcent(register);
  
  let state, computed;
  if (module) {
    state = ctx.moduleState;
    computed = ctx.moduleComputed;
  } else {
    state = ctx.connectedState;
    computed = ctx.connectedComputed;
  }

  return view({ state, computed });
})