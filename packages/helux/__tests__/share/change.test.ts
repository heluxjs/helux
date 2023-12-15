import '@testing-library/jest-dom';
import { isDiff } from 'limu';
import { describe, expect, test } from 'vitest';
import { getSnap, share } from '../helux';

describe('change shared', () => {
  test('change shared dict by passing new state', async () => {
    const [state, setState] = share({ a: 1, b: 2 });
    setState({ a: 2, b: 3 });
    expect(state.a).toBe(2);
    expect(state.b).toBe(3);
  });

  test('change shared dict by draft cb', async () => {
    const [state, setState] = share({ a: 1, b: 2 });
    setState((draft) => {
      draft.a += 1;
    });
    expect(state.a).toBe(2);
    expect(state.b).toBe(2);
  });

  test('change shared dict by return partial', async () => {
    const [state, setState] = share({ a: 1, b: 2 });
    setState((draft) => ({ a: draft.a + 1 }));
    expect(state.a).toBe(2);
    expect(state.b).toBe(2);
  });

  test('return partial and operate draft both', async () => {
    const [state, setState] = share({ a: 1, b: 2 });
    setState((draft) => {
      draft.b = draft.b + 1;
      return { a: draft.a + 1 };
    });
    expect(state.a).toBe(2);
    expect(state.b).toBe(3);
  });

  test('change deep', async () => {
    const [state, setState] = share({ a: { a1: { a2: 1 }, a11: { a22: 2 } }, b: 2 });
    setState((draft) => {
      draft.a.a1.a2 = 2;
    });
    expect(state.a.a1.a2).toBe(2);

    const prev = getSnap(state);
    // 孩子节点变化，两者应该不等
    expect(isDiff(state.a.a11, prev.a.a11)).toBeTruthy();
  });
});
