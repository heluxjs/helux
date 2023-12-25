import { share, atom } from 'helux';

function runMultiMutateLogic(changeC: any, changeD: any) {
  const [numAtom, setAtom] = atom({ a: 1, b: 2 });
  const [bAtom] = atom(
    { c: 0, d: 0 },
    {
      mutate: {
        changeC: (draft) => {
          // console.log('1 draft is ', draft);
          return changeC(draft, numAtom);
        },
        changeD: (draft) => {
          // console.log('2 draft is ', draft);
          return changeD(draft, numAtom)
        },
      },
    },
  );
  expect(bAtom.val.c).toBe(11);
  expect(bAtom.val.d).toBe(12);

  setAtom((draft) => {
    draft.a = 10;
    draft.b = 20;
  });
  expect(bAtom.val.c).toBe(20);
  expect(bAtom.val.d).toBe(30);
}

runMultiMutateLogic(
  (draft: any, numAtom: any) => (draft.c = numAtom.val.a + 10),
  (draft: any, numAtom: any) => (draft.d = numAtom.val.b + 10),
);