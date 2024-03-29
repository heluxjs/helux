import { $, atom, atomx, useAtom } from 'helux';
import { Entry, MarkUpdate } from '../../comps';
import { createDcDemo } from '../util';

const Demo = createDcDemo(() => {
  const [baseAtom, setAtom] = atom(3000, { moduleName: 'baseAtom' });

  const x = atomx(
    { a: 1, b: 2 },
    {
      moduleName: 'yy',
      alertDeadCycleErr: false,
    },
  );

  x.mutate({
    fn: (draft, { draftRoot }) => {
      console.log('a is', draft.a);
    },
    desc: 'call_changeA_to_change',
  });

  function Price() {
    const [base, , info] = useAtom(baseAtom);
    return (
      <MarkUpdate name="Price" info={info}>
        {base}
      </MarkUpdate>
    );
  }

  function changeA() {
    x.reactive.a += 100;
  }

  return function Demo(props: any) {
    return (
      <Entry fns={[changeA]}>
        <Price />
        {$(x.reactive.a)}
      </Entry>
    );
  };
});

export default Demo;
