import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { atom, atomActionAsync, useActionLoading } from '../helux';
import { delay } from '../util';

describe('useDerivedAtom', () => {
  async function testLoading(asyncAction, useActionLoading) {
    const action1 = asyncAction(async ({ setState }) => {
      await delay(100);
      setState((draft) => {
        draft.val = 100;
      });
    }, 'action1');

    let runCount = 0;
    const { result } = renderHook(() => {
      runCount += 1;
      const [ld] = useActionLoading();
      return ld['action1'].loading;
    });

    expect(runCount).toBe(1);
    expect(result.current).toBe(false);
    act(() => {
      action1();
    });
    expect(runCount).toBe(2);
    expect(result.current).toBe(true); // loading
    await delay(120);
    expect(runCount).toBe(3);
    expect(result.current).toBe(false); // loading canceled
  }

  test('ctx.asyncAction, ctx.useActionLoading', async () => {
    const [, , ctx] = atom(1);
    testLoading(ctx.actionAsync, ctx.useActionLoading);
  });

  test('topApi.asyncAction, ctx.useActionLoading', async () => {
    const [numAtom, , ctx] = atom(1);
    testLoading(atomActionAsync(numAtom), ctx.useActionLoading);
  });

  test('ctx.asyncAction, topApi.useActionLoading', async () => {
    const [numAtom, , ctx] = atom(1);
    testLoading(ctx.actionAsync, () => useActionLoading(numAtom));
  });

  test('topApi.asyncAction, topApi.useActionLoading', async () => {
    const [numAtom] = atom(1);
    testLoading(atomActionAsync(numAtom), () => useActionLoading(numAtom));
  });
});
