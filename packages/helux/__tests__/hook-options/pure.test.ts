import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { atom, useAtom } from '../helux';
import { dictFictory, getDepKey, noop } from '../util';

describe('useAtom options.pure', () => {
  test('pure=undefined', async () => {
    const [dictAtom, setDictAtom, { rootValKey }] = atom(dictFictory);

    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount += 1;
      const [state, , info] = useAtom(dictAtom);
      return info.getDeps();
    });

    expect(result.current).toMatchObject([rootValKey]);
    expect(renderCount).toBe(1);

    setDictAtom((draft) => {
      draft.a.b.c = 100;
    });
    expect(renderCount).toBe(1);
  });

  test('pure=undefined, read state.a, update a.b.c', async () => {
    const [dictAtom, setDictAtom, { rootValKey }] = atom(dictFictory);

    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount += 1;
      const [state, , info] = useAtom(dictAtom);
      noop(state.a);
      return info.getDeps();
    });

    expect(result.current).toMatchObject([getDepKey(rootValKey, 'a')]);
    expect(renderCount).toBe(1);

    setDictAtom((draft) => {
      draft.a.b.c = 100;
    });
    // 更新 a.b.c ，通过 rootValKey 配合不对称记录机制，能查到依赖 a 的示例并触发更新
    expect(renderCount).toBe(2);
  });

  test('pure=undefined, read state.a.b.c, update a', async () => {
    const [dictAtom, setDictAtom, { rootValKey }] = atom(dictFictory);

    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount += 1;
      const [state, , info] = useAtom(dictAtom);
      noop(state.a.b.c);
      return info.getDeps();
    });

    expect(result.current).toMatchObject([getDepKey(rootValKey, 'a.b.c')]);
    expect(renderCount).toBe(1);

    setDictAtom((draft) => {
      draft.a = { ...draft.a };
    });
    // 更新 a，但 a.b.c 无变化，故实例不会更新
    expect(renderCount).toBe(1);
  });
});
