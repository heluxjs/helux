import React from 'react';
import { $, share, watch } from 'helux';
import { MarkUpdate, Entry } from '../comps';
import { dictFactory, delay } from '../logic/util';

const [state, setState, ctxp] = share(dictFactory, { moduleName: 'Case3', alertDeadCycleErr: false });

// 依赖f，回调里修改f
watch(() => {
  ctxp.reactive.f += 2;
}, () => [ctxp.reactive.f]);

watch(() => {
  setState(draft => { draft.f += 2 });
}, () => [ctxp.reactive.f]);


function changeF() {
  ctxp.setState(draft => { draft.f += 100 });
}

function Price() {
  return <MarkUpdate name="Price">
    {$(state.f)}
  </MarkUpdate>;
}

const Demo = () => (
  <Entry fns={[changeF]}>
    <Price />
    <Price />
  </Entry>
);

export default Demo;
