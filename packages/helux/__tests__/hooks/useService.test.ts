import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { atom, useAtom, useService } from '../helux';

describe('useService', () => {
  test('read and change', async () => {
    const [numAtom, setAtom] = atom(1);

    let renderCount = 0;
    const { result } = renderHook(() => {
      renderCount += 1;
      useAtom(numAtom);
      const srv = useService({
        a() {
          return 'stable fn q';
        },
        b() {
          return 'stable fn b';
        },
      });
      // srv and its sub methods is stable
      return srv;
    });

    expect(renderCount).toBe(1);
    const prevSrv = result.current;
    const prevFnA = prevSrv.a;
    const prevFnB = prevSrv.b;
    setAtom(Date.now());
    expect(renderCount).toBe(2);
    const currSrv = result.current;
    const currFnA = currSrv.a;
    const currFnB = currSrv.b;
    expect(prevSrv).toBe(currSrv);
    expect(prevFnA).toBe(currFnA);
    expect(prevFnB).toBe(currFnB);
  });
});
