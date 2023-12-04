import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { atom, share, useGlobalId } from '../helux';

describe('useGlobalId', () => {
  test('pritimive atom', async () => {
    const [, setAtom] = atom(1, {
      rules: [
        {
          when: (draft) => [draft],
          globalIds: ['justUpdate'],
        },
      ],
    });

    let runCount = 0;
    renderHook(() => {
      runCount += 1;
      useGlobalId('justUpdate');
    });

    expect(runCount).toBe(1);
    setAtom(2);
    expect(runCount).toBe(2);
  });

  function runDictLogic(api: any) {
    const [, setDict] = (api as typeof atom)(
      { a: 1, b: { b1: 1 } },
      {
        rules: [
          {
            when: (draft) => [draft.b.b1],
            globalIds: ['justUpdate'],
          },
        ],
      },
    );

    let runCount = 0;
    renderHook(() => {
      runCount += 1;
      useGlobalId('justUpdate');
    });

    expect(runCount).toBe(1);
    setDict((draft) => {
      draft.b.b1 = 100;
    });
    expect(runCount).toBe(2);
  }

  const dataFactory = () => ({
    a: 1,
    b: { b1: 1 },
    c: { c1: { c2: 1 } },
    map: new Map([
      [1, { id: 1, name: 'helux1' }],
      [2, { id: 2, name: 'helux2' }],
    ]),
  });

  function runDictSubNodeLogic(api: any, options: { setLogic: (draft: ReturnType<typeof dataFactory>) => void; afterSetRunCount: number }) {
    const [, setDict] = (api as typeof atom)(dataFactory, {
      rules: [
        {
          when: (draft) => [draft.c],
          globalIds: ['justUpdate'],
        },
      ],
    });
    const { setLogic, afterSetRunCount } = options;

    let runCount = 0;
    renderHook(() => {
      runCount += 1;
      useGlobalId('justUpdate');
    });

    expect(runCount).toBe(1);
    setDict(setLogic);
    expect(runCount).toBe(afterSetRunCount);
  }

  test('atom dict', async () => {
    runDictLogic(atom);
  });

  test('atom dict, sub node changed', async () => {
    runDictSubNodeLogic(atom, { setLogic: (draft) => (draft.c.c1.c2 += 1), afterSetRunCount: 2 });
  });

  test('atom dict, sub node not changed', async () => {
    runDictSubNodeLogic(atom, { setLogic: (draft) => (draft.c.c1.c2 = draft.c.c1.c2), afterSetRunCount: 1 });
  });

  test('atom dict, change node not draft.c ', async () => {
    runDictSubNodeLogic(atom, { setLogic: (draft) => (draft.b = { ...draft.b }), afterSetRunCount: 1 });
  });

  test('share', async () => {
    runDictLogic(share);
  });

  test('share, sub node changed', async () => {
    runDictSubNodeLogic(share, { setLogic: (draft) => (draft.c.c1.c2 += 1), afterSetRunCount: 2 });
  });

  test('share, sub node not changed', async () => {
    runDictSubNodeLogic(share, { setLogic: (draft) => (draft.c.c1.c2 = draft.c.c1.c2), afterSetRunCount: 1 });
  });

  test('share, change map node', async () => {
    runDictSubNodeLogic(share, {
      setLogic: (draft) => {
        const item = draft.map.get(1);
        if (item) {
          item.name = 'new';
        }
      },
      afterSetRunCount: 1,
    });
  });

  test('share, change node not draft.c ', async () => {
    runDictSubNodeLogic(share, { setLogic: (draft) => (draft.b = { ...draft.b }), afterSetRunCount: 1 });
  });
});
