import { getSnap, share, action, atom, flush, $ } from 'helux';
import { isDiff } from 'limu';

const [state, setState] = share({ a: { a1: { a2: 1 }, a11: { a22: 2 } }, b: 2 });
setState((draft) => {
  draft.a.a1.a2 = 2;
});
console.log(state.a.a1.a2);

const prev = getSnap(state);
// 孩子节点变化，两者应该不等了
console.log(isDiff(state.a.a11, prev.a.a11));
console.log('isDiff(state.a.a11, prev.a.a11)', isDiff(state.a.a11, prev.a.a11));
console.log('state.a.a11 === prev.a.a11', state.a.a11 === prev.a.a11);


const Demo = () => (
  <h1>see print: 'a', 'a11', Symbol(V)</h1>
);

export default Demo;
