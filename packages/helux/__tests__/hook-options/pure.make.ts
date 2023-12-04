import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { atom, useAtom } from '../helux';
import { dictFictory, getDepKey, noop } from '../util';

interface IMakeOptions {
  pure?: boolean;
  label: string;
  atom: typeof atom;
  useAtom: typeof useAtom;
}

export function makeTest(options: IMakeOptions) {
  const { label, pure, atom, useAtom } = options;
  const pureStr = `${pure}`;

  describe(`${label} options.pure=${pureStr}`, () => {
    test(`use root val, update a.b.c`, async () => {
      const [dictAtom, setDictAtom, { rootValKey }] = atom(dictFictory);

      let renderCount = 0;
      const { result } = renderHook(() => {
        renderCount += 1;
        const [state, , info] = useAtom(dictAtom, { pure });
        return { info, beforeEffectDepKeys: info.getDeps() };
      });
      const { info, beforeEffectDepKeys } = result.current;

      expect(info.getDeps()).toMatchObject([rootValKey]);
      expect(beforeEffectDepKeys).toMatchObject([rootValKey]);

      setDictAtom((draft) => {
        draft.a.b.c = 100;
      });

      expect(renderCount).toBe(2);
    });

    test(`read state.a, update a.b.c`, async () => {
      const [dictAtom, setDictAtom, { rootValKey }] = atom(dictFictory);

      let renderCount = 0;
      const { result } = renderHook(() => {
        renderCount += 1;
        const [state, , info] = useAtom(dictAtom, { pure });
        noop(state.a);
        return info.getDeps();
      });

      // 为 false 时，收集所有读依赖
      const depKeys =
        pure === false
          ? [getDepKey(rootValKey), getDepKey(rootValKey, 'a')]
          : // 为 ture 时，收集最长读依赖
            [getDepKey(rootValKey, 'a')];

      expect(result.current).toMatchObject(depKeys);
      expect(renderCount).toBe(1);

      setDictAtom((draft) => {
        draft.desc = 'new desc';
      });
      // 非 pure 时，读取 state.a 依赖的实例实际依赖是 state, stat.a
      // 修改了 desc 也会触发实例更新，因为 state 自身改变了
      const afterSetDescRenderCount = pure === false ? 2 : 1;
      expect(renderCount).toBe(afterSetDescRenderCount);

      setDictAtom((draft) => {
        draft.a.b.c = 100;
      });
      // 更新 a.b.c ，触发依赖是 ( state state.a ) 和 ( state.a ) 的实例更新
      const afterSetAbcRenderCount = pure === false ? 3 : 2;
      expect(renderCount).toBe(afterSetAbcRenderCount);
    });

    test(`read state.a.b.c, update a`, async () => {
      const [dictAtom, setDictAtom, { rootValKey }] = atom(dictFictory);

      let renderCount = 0;
      const { result } = renderHook(() => {
        renderCount += 1;
        const [state, , info] = useAtom(dictAtom, { pure });
        noop(state.a.b.c);
        return info.getDeps();
      });

      // 非 pure 时，收集所有读依赖
      const depKeys =
        pure === false
          ? [getDepKey(rootValKey), getDepKey(rootValKey, 'a'), getDepKey(rootValKey, 'a.b'), getDepKey(rootValKey, 'a.b.c')]
          : [getDepKey(rootValKey, 'a.b.c')]; // 为 ture 时，收集最长读依赖

      expect(result.current).toMatchObject(depKeys);
      expect(renderCount).toBe(1);

      setDictAtom((draft) => {
        draft.a = { ...draft.a };
      });
      // 非 pure 时，实例包含了所有节点依赖，更新 a，实例更新
      // pure 时，实例只包含 a.b.c 依赖，更新 a 但 a.b.c 无变化，实例不更新
      const afterSetDescRenderCount = pure === false ? 2 : 1;
      // 更新 a，但 a.b.c 无变化，故实例不会更新
      expect(renderCount).toBe(afterSetDescRenderCount);
    });
  });
}
