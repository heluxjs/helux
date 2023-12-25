import { atom } from 'helux';
import { MarkUpdate, Entry } from '../comps';
import { dictFactory, delay } from '../logic/util';

const [state] = atom(
  { a: 1, b: 0, c: 0 },
  {
    mutate: {
      changeB: (draft) => {
        draft.b = draft.a + 10;
      },
      changeC: (draft) => {
        draft.c = draft.b + 20;
      },
      changeA: (draft) => {
        draft.a = draft.c + 30;
      },
    },
    alertDeadCycleErr: false,
  },
);

const Demo = () => (
  <Entry fns={[]}>
    should found DC
    {state.val.a}
  </Entry>
);

export default Demo;
