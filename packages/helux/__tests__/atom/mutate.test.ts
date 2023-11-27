import '@testing-library/jest-dom';
import { describe, expect, test } from 'vitest';
import { atom, runMutate } from '../helux';

describe('create atom mutate', () => {
  test('single mutate, return result 1121', async () => {
    const [numAtom, setAtom] = atom(1);
    const [bAtom] = atom(0, {
      mutate: () => numAtom.val + 10,
    });
    expect(bAtom.val).toBe(11);

    setAtom(10);
    expect(bAtom.val).toBe(20);
  });

  test('single mutate, change draft', async () => {
    const [numAtom, setAtom] = atom(1);
    const [bAtom] = atom(0, {
      mutate: (draft) => numAtom.val + 10,
    });
    expect(bAtom.val).toBe(11);

    setAtom(10);
    expect(bAtom.val).toBe(20);
  });

  test('mutate dict(fn), change draft', async () => {
    const [numAtom, setAtom] = atom(1);
    const [bAtom] = atom(
      { a: 0, b: 0 },
      {
        mutate: {
          a: (draft) => {
            draft.a = numAtom.val + 10;
          },
          b: (draft) => {
            draft.b = numAtom.val + 100;
          },
        },
      },
    );
    expect(bAtom.val.a).toBe(11);
    expect(bAtom.val.b).toBe(101);

    setAtom(10);
    expect(bAtom.val.a).toBe(20);
    expect(bAtom.val.b).toBe(110);
  });

  test('mutate dict(fnItem), change draft', async () => {
    const [numAtom, setAtom] = atom(1);
    const [bAtom] = atom(
      { a: 0, b: 0 },
      {
        mutate: {
          a: {
            fn: (draft) => {
              draft.a = numAtom.val + 10;
            },
          },
          b: {
            fn: (draft) => {
              draft.b = numAtom.val + 100;
            },
          },
        },
      },
    );
    expect(bAtom.val.a).toBe(11);
    expect(bAtom.val.b).toBe(101);

    setAtom(10);
    expect(bAtom.val.a).toBe(20);
    expect(bAtom.val.b).toBe(110);
  });

  test('rerun mutate', async () => {
    const [numAtom, setAtom] = atom(1);
    let runCount = 0;
    const [bAtom, , ctx] = atom(
      { a: 0, b: 0 },
      {
        mutate: {
          a: {
            fn: (draft) => {
              runCount += 1;
              draft.a = numAtom.val + 10;
            },
          },
        },
      },
    );
    expect(runCount).toBe(1);
    runMutate(bAtom, 'a');
    expect(runCount).toBe(2);
  });

  test('single mutate, watch self', async () => {
    const [bAtom, setAtom] = atom(
      { a: 1, b: 2 },
      {
        mutate: (draft, { state }) => {
          draft.a = state.b + 10;
        },
      },
    );

    expect(bAtom.val.b).toBe(2);
    expect(bAtom.val.a).toBe(12);

    setAtom((draft) => {
      draft.b = 100;
    });
    console.log('---> setAtom ', bAtom.val.b);
    expect(bAtom.val.b).toBe(100);
    expect(bAtom.val.a).toBe(110);
  });
});
