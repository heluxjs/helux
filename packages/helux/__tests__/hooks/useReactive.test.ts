import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { share, useReactive } from '../helux';
import { dictFictory } from '../util';

describe('useReactive', () => {
  test('simple use', async () => {
    const [state, setState] = share(dictFictory);

    const { result } = renderHook(() => {
      const [shared] = useReactive(state);
      return shared.a.b.c;
    });

    expect(result.current).toBe(1);
  });
});
