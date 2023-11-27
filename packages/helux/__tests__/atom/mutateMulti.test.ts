import '@testing-library/jest-dom';
import { describe, expect, test } from 'vitest';
import { atom } from '../helux';

describe('create object atom multi mutate', () => {
  function runMultiMutateLogic(changeC, changeD) {
    const [numAtom, setAtom] = atom({ a: 1, b: 2 });
    const [bAtom] = atom(
      { c: 0, d: 0 },
      {
        mutate: {
          changeC: (draft) => changeC(draft, numAtom),
          changeD: (draft) => changeD(draft, numAtom),
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

  test('mutate dict: 2 mutate fns ( cb body has no {} )', async () => {
    runMultiMutateLogic(
      (draft, numAtom) => (draft.c = numAtom.val.a + 10),
      (draft, numAtom) => (draft.d = numAtom.val.b + 10),
    );
  });

  test('mutate dict: 2 mutate fns ( cb body has {} )', async () => {
    runMultiMutateLogic(
      (draft, numAtom) => {
        draft.c = numAtom.val.a + 10;
      },
      (draft, numAtom) => {
        draft.d = numAtom.val.b + 10;
      },
    );
  });

  function assertLogic(numAtom, setAtom, bAtom) {
    expect(bAtom.val.c).toBe(11);
    expect(bAtom.val.d).toBe(12);

    setAtom((draft) => {
      draft.a = 10;
      draft.b = 20;
    });
    expect(bAtom.val.c).toBe(20);
    expect(bAtom.val.d).toBe(30);
  }

  test('mutate dict: 2 mutate fnItems ( cb body has no {} )', async () => {
    const [numAtom, setAtom] = atom({ a: 1, b: 2 });
    const [bAtom] = atom(
      { c: 0, d: 0 },
      {
        mutate: {
          changeC: {
            fn: (draft) => (draft.c = numAtom.val.a + 10),
          },
          changeD: {
            fn: (draft) => (draft.d = numAtom.val.b + 10),
          },
        },
      },
    );
    assertLogic(numAtom, setAtom, bAtom);
  });

  test('mutate dict: 2 mutate fnItems ( cb body has {} )', async () => {
    const [numAtom, setAtom] = atom({ a: 1, b: 2 });
    const [bAtom] = atom(
      { c: 0, d: 0 },
      {
        mutate: {
          changeC: {
            fn: (draft) => {
              draft.c = numAtom.val.a + 10;
            },
          },
          changeD: {
            fn: (draft) => {
              draft.d = numAtom.val.b + 10;
            },
          },
        },
      },
    );
    assertLogic(numAtom, setAtom, bAtom);
  });

  test('mutate list: 2 fns', async () => {
    const [numAtom, setAtom] = atom({ a: 1, b: 2 });
    const [bAtom] = atom(
      { c: 0, d: 0 },
      {
        mutate: [
          (draft) => {
            draft.c = numAtom.val.a + 10;
          },
          (draft) => {
            draft.d = numAtom.val.b + 10;
          },
        ],
      },
    );
    assertLogic(numAtom, setAtom, bAtom);
  });

  test('mutate list: 2 fnItems', async () => {
    const [numAtom, setAtom] = atom({ a: 1, b: 2 });
    const [bAtom] = atom(
      { c: 0, d: 0 },
      {
        mutate: [
          {
            fn: (draft) => {
              draft.c = numAtom.val.a + 10;
            },
          },
          {
            fn: (draft) => {
              draft.d = numAtom.val.b + 10;
            },
          },
        ],
      },
    );
    assertLogic(numAtom, setAtom, bAtom);
  });

  test('mutate list: 1 fn, 1 fnItem', async () => {
    const [numAtom, setAtom] = atom({ a: 1, b: 2 });
    const [bAtom] = atom(
      { c: 0, d: 0 },
      {
        mutate: [
          (draft) => {
            draft.c = numAtom.val.a + 10;
          },
          {
            fn: (draft) => {
              draft.d = numAtom.val.b + 10;
            },
          },
        ],
      },
    );
    assertLogic(numAtom, setAtom, bAtom);
  });
});
