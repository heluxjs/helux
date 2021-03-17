import * as React from 'react';
import useConcent from './use-concent';
import { getRegisterOptions, isFn } from '../support/util';

export default function registerHookComp(options, ccClassKey) {
  let _options = getRegisterOptions(options);
  if (isFn(_options.state)) {
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
        return React.createElement(Dumb, ctx.__$$mapped);
      };
    };

    const Comp = getComp();
    if (memo && React.memo) {
      return React.memo(Comp);
    } else {
      return Comp;
    }
  }

  const Dumb = _options.render;
  if (Dumb) {
    return buildCcHookComp(Dumb);
  } else {
    return Dumb => buildCcHookComp(Dumb);
  }
}
