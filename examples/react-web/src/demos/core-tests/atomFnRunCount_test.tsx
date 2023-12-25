import React from 'react';
import { atom, $ } from 'helux';
import { MarkUpdate, Entry } from '../comps';
import { log, delay, random } from '../logic/util';


const [numAtom, setAtom] = atom(1, { moduleName: 'mod1' });
// 有fn，未指定 immediate 时，task 首次不执行
const [bAtom] = atom(0, {
  moduleName: 'mod2',
  mutate: [
    {
      deps: () => [numAtom.val],
      fn: (draft, { input: [num] }) => {
        return draft + num;
      },
      task: async ({ setState, input: [num] }) => {
        console.log('trigger task!!');
        await delay(100);
        setState((draft) => draft + num);
      },
    },
  ],
});

const changeNum = () => setAtom(prev => prev + 1);

function Demo(props: any) {
  const fns: any[] = [changeNum];
  return <Entry fns={fns}>
    {$(numAtom)}
    <br />
    {$(bAtom)}
  </Entry>
}

export default Demo;
