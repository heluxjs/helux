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

  const dataFactory = () => ({ a: 1, b: { b1: 1 }, c: { c1: { c2: 1 } } });

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

  test('dict atom', async () => {
    runDictLogic(atom);
  });

  test('dict atom, sub node changed', async () => {
    runDictSubNodeLogic(atom, { setLogic: (draft) => (draft.c.c1.c2 += 1), afterSetRunCount: 2 });
  });

  test('dict atom, sub node not changed', async () => {
    runDictSubNodeLogic(atom, { setLogic: (draft) => (draft.c.c1.c2 = draft.c.c1.c2), afterSetRunCount: 1 });
  });

  test('dict atom, change node not draft.c ', async () => {
    runDictSubNodeLogic(atom, { setLogic: (draft) => (draft.b = { ...draft.b }), afterSetRunCount: 1 });
  });

  test('share', async () => {
    runDictLogic(share);
  });

  test('share atom, sub node changed', async () => {
    runDictSubNodeLogic(atom, { setLogic: (draft) => (draft.c.c1.c2 += 1), afterSetRunCount: 2 });
  });

  test('share atom, sub node not changed', async () => {
    runDictSubNodeLogic(atom, { setLogic: (draft) => (draft.c.c1.c2 = draft.c.c1.c2), afterSetRunCount: 1 });
  });

  test('share atom, change node not draft.c ', async () => {
    runDictSubNodeLogic(atom, { setLogic: (draft) => (draft.b = { ...draft.b }), afterSetRunCount: 1 });
  });
});
