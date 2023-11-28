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

  test('dict atom', async () => {
    runDictLogic(atom);
  });

  test('share', async () => {
    runDictLogic(share);
  });
});
