import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { action, actionAsync, atom, atomActionAsync, isAtom, share, useActionLoading, useAtom, useShared } from '../helux';
import { delay, noop } from '../util';

async function testLoading(state, asyncAction, useActionLoading) {
  const action1 = asyncAction()(async ({ setState }) => {
    await delay(100);
    if (isAtom(state)) {
      setState(() => 100);
    } else {
      setState((draft) => (draft.val = 100));
    }
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
  expect(state.val).toBe(100);
  // the new 2 render times: loading true ---> loading false
  expect(runCount).toBe(3);
}

async function testLoadingWithUseStateHook(state, asyncAction, useActionLoading, useStateFn?: any) {
  const useState = useStateFn || useAtom;
  const action1 = asyncAction()(async ({ setState }) => {
    await delay(100);
    if (isAtom(state)) {
      setState(() => 100);
    } else {
      setState((draft) => (draft.val = 100));
    }
  }, 'action1');

  let runCount = 0;
  const { result } = renderHook(() => {
    runCount += 1;
    const [obj] = useState(state);
    if (!isAtom(state)) {
      noop(obj.val); // trigger read
    }
    const [ld] = useActionLoading();
    return ld['action1'].loading;
  });

  expect(runCount).toBe(1);
  expect(result.current).toBe(false);

  await action1();
  expect(state.val).toBe(100);

  // the new 3 render times: loading true ---> val=100 ---> loading false
  expect(runCount).toBe(4);
  expect(result.current).toBe(false);
}

describe('atom useActionLoading', () => {
  test('ctx.actionAsync, ctx.useActionLoading', async () => {
    const [numAtom, , ctx] = atom(1);
    await testLoading(numAtom, ctx.action, ctx.useActionLoading);
  });

  test('topApi.asyncAction, ctx.useActionLoading', async () => {
    const [numAtom, , ctx] = atom(1);
    await testLoading(numAtom, action(numAtom), ctx.useActionLoading);
  });

  test('ctx.actionAsync, topApi.useActionLoading', async () => {
    const [numAtom, , ctx] = atom(1);
    await testLoading(numAtom, ctx.action, () => useActionLoading(numAtom));
  });

  test('topApi.asyncAction, topApi.useActionLoading', async () => {
    const [numAtom] = atom(1);
    await testLoading(numAtom, atomActionAsync(numAtom), () => useActionLoading(numAtom));
  });

  test('useAtom: ctx.actionAsync, ctx.useActionLoading', async () => {
    const [numAtom, , ctx] = atom(1);
    await testLoadingWithUseStateHook(numAtom, ctx.action, ctx.useActionLoading);
  });

  test('useAtom: topApi.asyncAction, ctx.useActionLoading', async () => {
    const [numAtom, , ctx] = atom(1);
    await testLoadingWithUseStateHook(numAtom, atomActionAsync(numAtom), ctx.useActionLoading);
  });

  test('useAtom: ctx.actionAsync, topApi.useActionLoading', async () => {
    const [numAtom, , ctx] = atom(1);
    await testLoadingWithUseStateHook(numAtom, ctx.action, () => useActionLoading(numAtom));
  });

  test('useAtom: topApi.asyncAction, topApi.useActionLoading', async () => {
    const [numAtom] = atom(1);
    await testLoadingWithUseStateHook(numAtom, atomActionAsync(numAtom), () => useActionLoading(numAtom));
  });
});

describe('share useActionLoading', () => {
  test('ctx.actionAsync, ctx.useActionLoading', async () => {
    const [state, , ctx] = share({ val: 1 });
    await testLoading(state, ctx.action, ctx.useActionLoading);
  });

  test('topApi.asyncAction, ctx.useActionLoading', async () => {
    const [state, , ctx] = share({ val: 1 });
    await testLoading(state, actionAsync(state), ctx.useActionLoading);
  });

  test('ctx.actionAsync, topApi.useActionLoading', async () => {
    const [state, , ctx] = share({ val: 1 });
    await testLoading(state, ctx.action, () => useActionLoading(state));
  });

  test('topApi.asyncAction, topApi.useActionLoading', async () => {
    const [state, , ctx] = share({ val: 1 });
    await testLoading(state, actionAsync(state), () => useActionLoading(state));
  });

  test('useShared: ctx.actionAsync, ctx.useActionLoading', async () => {
    const [state, , ctx] = share({ val: 1 });
    await testLoadingWithUseStateHook(state, ctx.action, ctx.useActionLoading, useShared);
  });

  test('useShared: topApi.asyncAction, ctx.useActionLoading', async () => {
    const [state, , ctx] = share({ val: 1 });
    await testLoadingWithUseStateHook(state, actionAsync(state), ctx.useActionLoading, useShared);
  });

  test('useShared: ctx.actionAsync, topApi.useActionLoading', async () => {
    const [state, , ctx] = share({ val: 1 });
    await testLoadingWithUseStateHook(state, ctx.action, () => useActionLoading(state), useShared);
  });

  test('useShared: topApi.asyncAction, topApi.useActionLoading', async () => {
    const [state, , ctx] = share({ val: 1 });
    await testLoadingWithUseStateHook(state, actionAsync(state), () => useActionLoading(state), useShared);
  });
});
