import * as React from 'react';
import useConcent from './use-concent';
import { getRegisterOptions } from '../support/util';

export default function registerHookComp(options, ccClassKey) {
  let _options = getRegisterOptions(options);
  if (typeof _options.state === 'function') {
    _options = Object.assign({}, _options);
    _options.state = _options.state();
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

  const Dumb = _options.render;
  if (Dumb) {
    return buildCcHookComp(Dumb);
  } else {
    return Dumb => buildCcHookComp(Dumb);
  }
}
