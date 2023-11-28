import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { atom, atomActionAsync, useActionLoading, useAtom } from '../helux';
import { delay } from '../util';

describe('useActionLoading', () => {
  async function testLoading(numAtom, asyncAction, useActionLoading) {
    const action1 = asyncAction(async ({ setState }) => {
      await delay(100);
      setState(() => 100);
    }, 'action1');

    let runCount = 0;
    const { result } = renderHook(() => {
      runCount += 1;
      const [ld] = useActionLoading();
      return ld['action1'].loading;
    });

    expect(runCount).toBe(1);
    expect(result.current).toBe(false);

    await action1();
    expect(numAtom.val).toBe(100);
    // the new 2 render times: loading true ---> val=100 ---> loading false
    expect(runCount).toBe(3);
  }

  async function testLoadingWithReadAtom(numAtom, asyncAction, useActionLoading) {
    const action1 = asyncAction(async ({ setState }) => {
      await delay(100);
      setState(() => 100);
    }, 'action1');

    let runCount = 0;
    const { result } = renderHook(() => {
      runCount += 1;
      useAtom(numAtom);
      const [ld] = useActionLoading();
      return ld['action1'].loading;
    });

    expect(runCount).toBe(1);
    expect(result.current).toBe(false);

    await action1();
    expect(numAtom.val).toBe(100);

    // the new 3 render times: loading true ---> val=100 ---> loading false
    expect(runCount).toBe(4);
    expect(result.current).toBe(false);
  }

  test('ctx.asyncAction, ctx.useActionLoading', async () => {
    const [numAtom, , ctx] = atom(1);
    await testLoading(numAtom, ctx.actionAsync, ctx.useActionLoading);
  });

  test('topApi.asyncAction, ctx.useActionLoading', async () => {
    const [numAtom, , ctx] = atom(1);
    await testLoading(numAtom, atomActionAsync(numAtom), ctx.useActionLoading);
  });

  test('ctx.asyncAction, topApi.useActionLoading', async () => {
    const [numAtom, , ctx] = atom(1);
    await testLoading(numAtom, ctx.actionAsync, () => useActionLoading(numAtom));
  });

  test('topApi.asyncAction, topApi.useActionLoading', async () => {
    const [numAtom] = atom(1);
    await testLoading(numAtom, atomActionAsync(numAtom), () => useActionLoading(numAtom));
  });

  test('useAtom: ctx.asyncAction, ctx.useActionLoading', async () => {
    const [numAtom, , ctx] = atom(1);
    await testLoadingWithReadAtom(numAtom, ctx.actionAsync, ctx.useActionLoading);
  });

  test('useAtom: topApi.asyncAction, ctx.useActionLoading', async () => {
    const [numAtom, , ctx] = atom(1);
    await testLoadingWithReadAtom(numAtom, atomActionAsync(numAtom), ctx.useActionLoading);
  });

  test('useAtom: ctx.asyncAction, topApi.useActionLoading', async () => {
    const [numAtom, , ctx] = atom(1);
    await testLoadingWithReadAtom(numAtom, ctx.actionAsync, () => useActionLoading(numAtom));
  });

  test('useAtom: topApi.asyncAction, topApi.useActionLoading', async () => {
    const [numAtom] = atom(1);
    await testLoadingWithReadAtom(numAtom, atomActionAsync(numAtom), () => useActionLoading(numAtom));
  });
});
