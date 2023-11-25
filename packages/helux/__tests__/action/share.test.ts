import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom'
import { share, action, actionAsync } from '../helux';
import { delay } from '../util';

describe('create share action', () => {

  test('add num action', async () => {
    const [shared] = share({ a: 1, b: 2 });
    const addA = action(shared)<[toAdd: number]>(({ draft, args }) => {
      draft.a += args[0];
    });

    const snap = addA(10);
    expect(snap.a).toBe(11);
    expect(shared.a).toBe(11);

    const snap2 = addA(10);
    expect(snap2.a).toBe(21);
    expect(shared.a).toBe(21);
  });

  test('add num async action', async () => {
    const [shared] = share({ a: 1, b: 2 });
    const addA = actionAsync(shared)<[toAdd: number]>(async ({ setState, args }) => {
      await delay(100);
      setState(draft => { draft.a += args[0] });
    });

    const snap = await addA(10);
    expect(snap.a).toBe(11);
    expect(shared.a).toBe(11);

    const snap2 = await addA(10);
    expect(snap2.a).toBe(21);
    expect(shared.a).toBe(21);
  });

});
