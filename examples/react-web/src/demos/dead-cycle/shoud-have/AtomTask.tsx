import React from 'react';
import { atom } from 'helux';
import { Entry } from '../../comps';
import { dictFactory } from '../../logic/util';

import { createDcDemo } from '../util';

// copy code to cb body
const Demo = createDcDemo(() => {
  const [state, setAtom] = atom(dictFactory, {
    moduleName: 'doubleAtom',
    mutate: [
      {
        deps: (state) => [state.f],
        task: async ({ draft, input }) => {
          // draft.g = input[0] + 100;
          draft.f = input[0] + 100;
        },
      },
    ],
    alertDeadCycleErr: false,
  });
  const changeF = () => {
    setAtom(draft => { draft.f = Date.now() });
  };

  return function Demo(props: any) {
    const fns = [changeF];
    // const fns:any[] = [];
    return <Entry fns={fns}>
    </Entry>
  }
});

export default Demo;
