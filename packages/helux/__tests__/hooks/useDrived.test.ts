import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { derive, share, useDerived } from '../helux';
import { delay } from '../util';

describe('useDerived', () => {
  test('read and change', async () => {
    const [state, setState] = share({ a: 1, b: 2 });
    const plus1Result = derive(() => ({ num: state.a + 1 }));

    const { result } = renderHook(() => {
      const [plus1] = useDerived(plus1Result);
      return plus1;
    });

    expect(result.current.num).toBe(2);
    setState((draft) => {
      draft.a = 2;
    });
    expect(result.current.num).toBe(3);
  });

  async function runDeriveAsyncLogic(expectedRunCount: number, showLoading?: boolean) {
    const [state, setState] = share({ a: 1, b: 2 });
    const plus1Result = derive({
      fn: () => ({ num: state.a + 1 }),
      task: async () => {
        await delay(100);
        return { num: state.a + 100 };
      },
    });

    let runCount = 0;
    const { result } = renderHook(() => {
      runCount += 1;
      const [plus1] = useDerived(plus1Result, { showLoading });
      return plus1;
    });

    expect(result.current.num).toBe(2);
    expect(runCount).toBe(1);
    setState((draft) => {
      draft.a = 2;
    });
    await delay(120);
    expect(result.current.num).toBe(102); // returned by task
    // if showLoading = true, loading wil trigger one time render
    expect(runCount).toBe(expectedRunCount);
  }

  test('read async and change', async () => {
    await runDeriveAsyncLogic(3);
  });

  test('read async and change, set showLoading=false', async () => {
    await runDeriveAsyncLogic(2, false);
  });
});
