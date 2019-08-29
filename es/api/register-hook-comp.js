import React from 'react';
import useConcent from './use-concent';

export default function registerHookComp(options) {

  function buildCcHookComp(Dumb) {
    return function CcHookComp(props) {
      options.props = props;
      const ctx = useConcent(options);

      // 和registerDumb保持一致，如果定义了mapProps，传递mapProps的结果给Dumb
      if (options.mapProps) {
        return React.createElement(Dumb, ctx.mapped);
      } else {
        return React.createElement(Dumb, ctx);
      }
    }
  }

  let Dumb = options.render;
  if (Dumb) {
    return buildCcHookComp(Dumb);
  } else {
    return Dumb => buildCcHookComp(Dumb);
  }
}