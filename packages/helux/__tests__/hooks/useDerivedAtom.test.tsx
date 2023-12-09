import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { atom, derive as deriveAtom, useDerived as useDerivedAtom } from '../helux';
import { delay } from '../util';

describe('useDerivedAtom', () => {
  test('read and change', async () => {
    const [numAtom, setAtom] = atom(1);
    const plus1Result = deriveAtom(() => numAtom.val + 1);

    const { result } = renderHook(() => {
      const [plus1] = useDerivedAtom(plus1Result);
      return plus1;
    });

    expect(result.current).toBe(2);
    // TODO: why here must wrap act?
    // setAtom(2);
    act(() => {
      setAtom(2);
    });
    expect(result.current).toBe(3);
  });

  test('read async and change', async () => {
    const [numAtom, setAtom] = atom(1);
    const plus1Result = deriveAtom({
      fn: () => numAtom.val + 1,
      task: async () => {
        await delay(100);
        return numAtom.val + 100;
      },
    });

    let runCount = 0;
    const { result } = renderHook(() => {
      runCount += 1;
      const [plus1] = useDerivedAtom(plus1Result);
      return plus1;
    });

    expect(result.current).toBe(2);
    expect(runCount).toBe(1);
    setAtom(2);
    await delay(120);
    expect(result.current).toBe(102); // returned by task
    expect(runCount).toBe(3); // loading wil trigger one time render
  });

  test('read async, set showLoading=false', async () => {
    const [numAtom, setAtom] = atom(1);
    const plus1Result = deriveAtom({
      fn: () => numAtom.val + 1,
      task: async () => {
        await delay(100);
        return numAtom.val + 100;
      },
    });

    let runCount = 0;
    const { result } = renderHook(() => {
      runCount += 1;
      const [plus1] = useDerivedAtom(plus1Result, { showLoading: false });
      return plus1;
    });

    expect(result.current).toBe(2);
    expect(runCount).toBe(1);
    setAtom(2);
    await delay(120);
    expect(result.current).toBe(102); // returned by task
    expect(runCount).toBe(2); // now only render 2 times
  });
});
