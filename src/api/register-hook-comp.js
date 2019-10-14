import React from 'react';
import useConcent from './use-concent';

export default function registerHookComp(options, ccClassKey) {
  let _options;
  if (typeof options === 'string') {
    _options = { module: options };
  } else {
    _options = Object.assign({}, options);
  }

  function buildCcHookComp(Dumb) {
    const { memo = true } = _options;
    delete _options.memo;

    const getComp = () => {
      return function CcHookComp(props) {
        _options.props = props;
        const ctx = useConcent(_options, ccClassKey);

        // 和registerDumb保持一致，如果定义了mapProps，传递mapProps的结果给Dumb
        if (_options.mapProps) {
          return React.createElement(Dumb, ctx.mapped);
        } else {
          return React.createElement(Dumb, ctx);
        }
      }
    }

    if (memo && React.memo) {
      return React.memo(getComp());
    } else {
      return getComp();
    }
  }

  let Dumb = _options.render;
  if (Dumb) {
    return buildCcHookComp(Dumb);
  } else {
    return Dumb => buildCcHookComp(Dumb);
  }
}