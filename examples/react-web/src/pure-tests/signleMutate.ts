import { share, atom } from 'helux';
import { delay } from '../demos/logic/util';

async function test() {
  const [numAtom, setAtom] = atom(1);
  // 有fn，未指定 immediate 时，task 首次不执行
  const [bAtom, , ctx] = atom(0, {
    mutate: [
      {
        deps: () => [numAtom.val],
        fn: (draft, { input: [num], state }) => {
          console.error('trigger fn', draft + num);
          return draft + num;
        },
        task: async ({ setState, input: [num] }) => {
          await delay(100);
          setState((draft) => draft + num);
        },
        desc: 'm1',
      },
    ],
  });
  expect(bAtom.val).toBe(1);
  await delay(120);
  expect(bAtom.val).toBe(1);
  ctx.runMutate('m1');
  expect(bAtom.val).toBe(2);
  await ctx.runMutateTask('m1');
  expect(bAtom.val).toBe(3);
}

test();
