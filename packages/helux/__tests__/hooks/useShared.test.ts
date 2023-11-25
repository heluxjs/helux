import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, test } from 'vitest';
import { share, useShared } from '../helux';
import { delay } from '../util';

describe('useShared', () => {
  async function runSetTest(setCb) {
    const [state, topSet] = share({ a: 1, b: 2 });
    const { result } = renderHook(() => {
      const [compState, hookSet] = useShared(state);
      React.useEffect(() => {
        const deferChange = async () => {
          await delay(100);
          // 外部逻辑自己控制如何 set
          act(() => setCb({ topSet, hookSet }));
        };
        deferChange();
      }, []);
      return compState.a;
    });
    expect(result.current).toBe(1);
    await delay(100);
    expect(result.current).toBe(2);
    expect(state.a).toBe(2);
  }

  test('top set by draft cb', async () => {
    await runSetTest((params) => {
      params.topSet((draft) => {
        draft.a = 2;
      });
    });
  });

  test('hook set by draft cb', async () => {
    await runSetTest((params) => {
      params.hookSet((draft) => {
        draft.a = 2;
      });
    });
  });

  test('top set by val', async () => {
    await runSetTest((params) => {
      params.topSet({ a: 2 });
    });
  });

  test('hook set by val', async () => {
    await runSetTest((params) => {
      params.hookSet({ a: 2 });
    });
  });
});
