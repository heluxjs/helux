import { atom } from 'helux';
import { Entry } from '../../comps';
import { createDcDemo } from '../util';

const Demo = createDcDemo(() => {
  const [, setDouble] = atom(2, {
    moduleName: 'doubleAtom',
    mutate: [
      {
        fn: (draft: any, params: any) => {
          return draft * 2;
        },
        desc: 'atom_xxx',
      },
    ],
    alertDeadCycleErr: false,
  });
  const changeDoubleAtom = () => {
    setDouble((prev) => prev + 100);
  };

  return function Demo(props: any) {
    const fns = [changeDoubleAtom];
    // const fns:any[] = [];
    return <Entry fns={fns}></Entry>;
  };
});

export default Demo;
