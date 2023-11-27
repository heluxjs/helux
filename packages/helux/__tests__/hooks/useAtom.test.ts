import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, test } from 'vitest';
import { atom, useAtom } from '../helux';
import { delay } from '../util';

describe('useAtom', () => {
  async function runSetTest(setCb) {
    const [numAtom, setAtom] = atom(1);
    const { result } = renderHook(() => {
      const [num, setNum] = useAtom(numAtom);
      React.useEffect(() => {
        const deferChange = async () => {
          await delay(100);
          // 外部逻辑自己控制如何 set
          act(() => setCb({ topSet: setAtom, hookSet: setNum }));
        };
        deferChange();
      }, []);
      return num;
    });
    expect(result.current).toBe(1);
    await delay(100);
    expect(result.current).toBe(2);
    expect(numAtom.val).toBe(2);
  }

  test('top set by draft cb', async () => {
    await runSetTest((params) => {
      params.topSet(() => 2);
    });
  });

  test('hook set by draft cb', async () => {
    await runSetTest((params) => {
      params.hookSet(() => 2);
    });
  });

  test('top set by val', async () => {
    await runSetTest((params) => {
      params.topSet(2);
    });
  });

  test('hook set by val', async () => {
    await runSetTest((params) => {
      params.hookSet(2);
    });
  });
});
