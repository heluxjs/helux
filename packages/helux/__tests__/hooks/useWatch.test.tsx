import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { atom, useWatch } from '../helux';

describe('useWatch', () => {
  test('watch atom, set same value', async () => {
    const [numAtom, setAtom] = atom(1);

    let runCount = 0;
    renderHook(() => {
      useWatch(
        () => {
          runCount += 1;
        },
        () => [numAtom],
      );
    });

    expect(runCount).toBe(0);
    setAtom(1);
    expect(runCount).toBe(0);
  });

  test('watch atom, set new value', async () => {
    const [numAtom, setAtom] = atom(1);

    let runCount = 0;
    renderHook(() => {
      useWatch(
        () => {
          runCount += 1;
        },
        () => [numAtom],
      );
    });

    expect(runCount).toBe(0);
    setAtom(2);
    expect(runCount).toBe(1);
  });

  test('watch atom, set immediate = true', async () => {
    const [numAtom, setAtom] = atom(1);

    let runCount = 0;
    renderHook(() => {
      useWatch(
        () => {
          runCount += 1;
        },
        { deps: () => [numAtom], immediate: true },
      );
    });

    expect(runCount).toBe(1); // trigger by immediate=true
    setAtom(1);
    expect(runCount).toBe(1);
  });
});
