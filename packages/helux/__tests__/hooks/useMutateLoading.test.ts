import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { atom, mutate, useMutateLoading } from '../helux';
import { delay } from '../util';

describe('useMutateLoading', () => {
  async function testLoading(fn, deps, useLoading) {
    const witness = fn({
      deps,
      task: async ({ setState }) => {
        await delay(1200);
        setState((draft) => {
          draft.b = 100;
        });
      },
      desc: 'mutate1',
    });

    await delay(110);

    let runCount = 0;
    const { result } = renderHook(() => {
      runCount += 1;
      const [ld] = useLoading();
      return ld['mutate1'].loading;
    });
    expect(runCount).toBe(1);
    expect(result.current).toBe(false);
    witness.run();
    // still be 1
    expect(runCount).toBe(1);
    expect(result.current).toBe(false);

    await witness.runTask();
    // ATTENTION: if task pass delay ms <= 100 to delay(), here will be 3
    // the new 3 render times: loading true ---> draft.b = 100 ---> loading false
    expect(runCount).toBe(4);
    expect(result.current).toBe(false);
  }

  test('ctx.mutate, ctx.useMutateLoading 1', async () => {
    const [state, , ctx] = atom({ a: 1, b: 2 });
    await testLoading(ctx.mutate, () => [state.val.a], ctx.useMutateLoading);
  });

  test('topApi.atomMutate, ctx.useMutateLoading', async () => {
    const [state, , ctx] = atom({ a: 1, b: 2 });
    await testLoading(mutate(state), () => [state.val.a], ctx.useMutateLoading);
  });

  test('ctx.mutate, topApi.useMutateLoading', async () => {
    const [state, , ctx] = atom({ a: 1, b: 2 });
    const useLoading = () => useMutateLoading(state);
    await testLoading(ctx.mutate, () => [state.val.a], useLoading);
  });

  test('topApi.atomMutate, topApi.useMutateLoading 1', async () => {
    const [state, , ctx] = atom({ a: 1, b: 2 });
    const useLoading = () => useMutateLoading(state);
    await testLoading(mutate(state), () => [state.val.a], useLoading);
  });
});
