import { action, atom } from 'helux';

const [numAtom] = atom(1);
const addAtom = action(numAtom)<[toAdd: number]>()(({ draft, payload }) => {
  return draft + payload[0];
});

// const { snap } = addAtom([10]);
// console.log(snap.val); // 11
// const { snap: snap2 } = addAtom([10]);
// console.log(snap2.val); // 21
const ret = addAtom([10]);
console.log(ret.snap);

const Demo = () => <h1>see add</h1>;

export default Demo;
