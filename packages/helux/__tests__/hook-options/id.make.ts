import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { atom, useAtom } from '../helux';
import { dictFictory, noop, randomStr } from '../util';

const getRootValDep = (rootValKey) => [rootValKey];

export function makeTest(options: { label: string; atom: typeof atom; useAtom: typeof useAtom }) {
  const { label, atom, useAtom } = options;

  async function testUpdateRoot() {
    const [dictAtom, setDictAtom] = atom(dictFictory, {
      rules: [
        {
          when: (state) => [state],
          ids: ['updateRoot'],
        },
      ],
    });

    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount += 1;
      const [state, , info] = useAtom(dictAtom, { id: 'updateRoot' });
      noop(state.info);
      return info.getDeps();
    });
    expect(renderCount).toBe(1);

    setDictAtom((draft) => {
      draft.a.b.c += 1;
    });
    expect(renderCount).toBe(2);

    setDictAtom((draft) => {
      draft.desc = randomStr();
    });
    expect(renderCount).toBe(3);

    setDictAtom((draft) => {
      draft.extra = { ...draft.extra };
    });
    expect(renderCount).toBe(4);
  }

  async function testLevel1UpdateA() {
    const [dictAtom, setDictAtom] = atom(dictFictory, {
      rules: [
        {
          when: (state) => [state.a.b.c],
          ids: ['updateA'],
        },
      ],
    });

    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount += 1;
      const [state, , info] = useAtom(dictAtom, { id: 'updateA' });
      noop(state.info);
      return info.getDeps();
    });
    console.log(result.current);
    expect(renderCount).toBe(1);

    setDictAtom((draft) => {
      draft.desc = randomStr();
    });
    expect(renderCount).toBe(1); // still be 1
    setDictAtom((draft) => {
      draft.extra = { ...draft.extra };
    });
    expect(renderCount).toBe(1); // still be 1

    setDictAtom((draft) => {
      draft.a.b.c += 1;
    });
    expect(renderCount).toBe(2);
    setDictAtom((draft) => {
      draft.a.b = { ...draft.a.b };
    });
    expect(renderCount).toBe(2); // a.b.c not change, so sitll be 1
  }

  describe(`${label} id for root`, () => {
    test('update root', async () => {
      await testUpdateRoot();
    });
  });

  // describe(`${label} id for state.a.b.c`, () => {
  //   test('update root', async () => {
  //     await testLevel1UpdateA();
  //   });
  // });
}
