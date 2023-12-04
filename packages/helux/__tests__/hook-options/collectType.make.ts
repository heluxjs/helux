import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { atom, useAtom } from '../helux';
import { dictFictory, getDepKey, noop } from '../util';

export function makeTest(options: { label: string; atom: typeof atom; useAtom: typeof useAtom }) {
  const { label, atom, useAtom } = options;

  const getFristDeps = (rootValKey) => [getDepKey(rootValKey, 'num'), getDepKey(rootValKey, 'a.b.c'), getDepKey(rootValKey, 'desc')];
  const getSecondDeps = (rootValKey) => [getDepKey(rootValKey, 'num'), getDepKey(rootValKey, 'a.b'), getDepKey(rootValKey, 'extra.list')];

  async function testLogic(
    collectType?: 'first' | 'every' | 'no',
    options?: {
      firstMatch?: (rootValKey: string) => any[];
      secondMatch?: (rootValKey: string) => any[];
    },
  ) {
    const [dictAtom, setDictAtom, { rootValKey }] = atom(dictFictory);
    const optionsVar = options || {};

    const { result } = renderHook(() => {
      const [state, , info] = useAtom(dictAtom, { collectType });
      if (state.num === 1) {
        noop(state.a.b.c);
        noop(state.desc);
      } else {
        noop(state.a.b);
        noop(state.extra.list);
      }

      return info.getDeps();
    });
    const matchObj1 = optionsVar.firstMatch?.(rootValKey) || getFristDeps(rootValKey);
    expect(result.current).toMatchObject(matchObj1);

    setDictAtom((draft) => {
      draft.num = 2;
    });
    const matchObj2 = optionsVar.secondMatch?.(rootValKey) || getSecondDeps(rootValKey);
    expect(result.current).toMatchObject(matchObj2);
  }

  describe(`${label} collectType`, () => {
    test('collectType=undefined', async () => {
      await testLogic();
    });

    test('collectType=every', async () => {
      await testLogic('every');
    });

    test('collectType=first', async () => {
      await testLogic('first', { firstMatch: getFristDeps, secondMatch: getFristDeps });
    });

    test('collectType=no 1', async () => {
      await testLogic('no', { firstMatch: () => [], secondMatch: () => [] });
    });
  });
}
