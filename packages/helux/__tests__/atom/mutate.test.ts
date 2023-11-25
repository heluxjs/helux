import '@testing-library/jest-dom';
import { describe, expect, test } from 'vitest';
import { atom, runMutate } from '../helux';

describe('create atom mutate', () => {
  test('single mutate, return result', async () => {
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
      mutate: (draft) => (draft.val = numAtom.val + 10),
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
            draft.val.a = numAtom.val + 10;
          },
          b: (draft) => {
            draft.val.b = numAtom.val + 100;
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
              draft.val.a = numAtom.val + 10;
            },
          },
          b: {
            fn: (draft) => {
              draft.val.b = numAtom.val + 100;
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
              draft.val.a = numAtom.val + 10;
            },
          },
        },
      },
    );
    expect(runCount).toBe(1);
    runMutate(bAtom, 'a');
    expect(runCount).toBe(2);
  });
});
