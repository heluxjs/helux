import '@testing-library/jest-dom';
import { describe, expect, test } from 'vitest';
import { atom } from '../helux';

// 依赖自己修改自己，触发死循环
describe('primitive atom mutate fn change self by returning a new value', () => {
  test('width deps', async () => {
    const [numAtom, setAtom] = atom(1);
    const [bAtom] = atom(0, {
      mutate: [
        {
          deps: () => [numAtom.val],
          fn: (draft, { input: [num] }) => draft + num,
        },
      ],
    });
    expect('no dc').toBeTruthy();
  });

  test('with fnItem no deps', async () => {
    const [numAtom, setAtom] = atom(1);
    const [bAtom] = atom(0, {
      mutate: [
        {
          fn: (draft, { input: [num] }) => draft + numAtom.val,
        },
      ],
    });
    expect('no dc').toBeTruthy();
  });

  test('with normal fn ', async () => {
    const [numAtom, setAtom] = atom(1);
    const [bAtom] = atom(0, {
      mutate: [(draft, { input: [num] }) => draft + numAtom.val],
    });
    expect('no dc').toBeTruthy();
  });
});
