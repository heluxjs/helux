import '@testing-library/jest-dom';
import { describe, expect, test } from 'vitest';
import { atom, atomAction, atomActionAsync } from '../helux';
import { delay } from '../util';

describe('create atom action', () => {
  test('add num action', async () => {
    const [numAtom] = atom(1);
    const addAtom = atomAction(numAtom)<[toAdd: number]>(({ draft, payload }) => {
      return draft + payload[0];
    });

    const [snap] = addAtom([10]);
    expect(snap.val).toBe(11);
    expect(numAtom.val).toBe(11);

    const [snap2] = addAtom([10]);
    expect(snap2.val).toBe(21);
    expect(numAtom.val).toBe(21);
  });

  test('add num async action', async () => {
    const [numAtom] = atom(1);
    const addAtom = atomActionAsync(numAtom)<[toAdd: number]>(async ({ setState, payload }) => {
      await delay(100);
      setState((draft) => draft + payload[0]);
    });

    const [snap] = await addAtom([10]);
    expect(snap.val).toBe(11);
    expect(numAtom.val).toBe(11);

    const [snap2] = await addAtom([10]);
    expect(snap2.val).toBe(21);
    expect(numAtom.val).toBe(21);
  });
});
