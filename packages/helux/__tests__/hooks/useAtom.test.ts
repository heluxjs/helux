import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, test } from 'vitest';
import { atom, useAtom } from '../helux';
import { delay, dictFictory, DictState, noop } from '../util';

describe('useAtom primitive', () => {
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

type SetCb = (draft: DictState) => void;
type SetFn = (cb: SetCb) => void;

describe('useAtom dict', () => {
  async function runSetTest(options: {
    setCb: (params: { topSet: SetFn; hookSet: SetFn }) => void;
    expectedName: string;
    afterSetRenderCount: number;
  }) {
    const [dictAtom, setDict] = atom(dictFictory);
    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount += 1;
      const [dict, setDictInner, info] = useAtom(dictAtom);
      noop(dict.extra.map.get(1));
      React.useEffect(() => {
        const deferChange = async () => {
          await delay(100);
          // 外部逻辑自己控制如何 set
          act(() => options.setCb({ topSet: setDict, hookSet: setDictInner }));
        };
        deferChange();
      }, []);
      return dict.extra.map;
    });
    expect(renderCount).toBe(1);

    expect(result.current.get(1)?.name).toBe('helux1');
    await delay(110);
    expect(result.current.get(1)?.name).toBe(options.expectedName);
    expect(renderCount).toBe(options.afterSetRenderCount);
  }

  test('top set by draft cb, change map', async () => {
    await runSetTest({
      setCb: (params) => {
        params.topSet((draft) => {
          const item = draft.extra.map.get(1);
          if (item) {
            item.name = 'new';
          }
        });
      },
      expectedName: 'new',
      afterSetRenderCount: 2,
    });
  });

  test('top set by draft cb, not change map', async () => {
    await runSetTest({
      setCb: (params) => {
        params.topSet((draft) => {
          const item = draft.extra.map.get(1);
          if (item) {
            item.name = item.name;
          }
        });
      },
      expectedName: 'helux1',
      afterSetRenderCount: 1,
    });
  });
});
