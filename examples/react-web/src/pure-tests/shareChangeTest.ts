import { share, atom } from 'helux';

const [state, setState] = share({ a: 1, b: 2 });
setState((draft) => {
  draft.b = draft.b + 1;
  return { a: draft.a + 1 };
});
expect(state.a).toBe(2);
expect(state.b).toBe(3);

// const [listAtom, setAtom] = atom([
//   { a: 1, b: { name: 2 } },
//   { a: 2, b: { name: 4 } },
// ]);
// expect(listAtom).toBeTruthy();
// setAtom(() => {
//   return [{ a: 6, b: { name: 8 } }];
// });
// expect(listAtom.val).toMatchObject([{ a: 6, b: { name: 8 } }]);
