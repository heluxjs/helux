import '@testing-library/jest-dom';
import { describe, expect, test } from 'vitest';
import { share } from '../helux';

describe('create share', () => {
  test('create shared dict ', async () => {
    const [state] = share({ a: 1, b: 2 });
    expect(state).toBeTruthy();
    expect(state.a === 1).toBeTruthy();
    expect(state.b === 2).toBeTruthy();
  });

  test('create shared dict include list', async () => {
    const [state] = share({ list: [1, 2, 3] });
    expect(state).toBeTruthy();
    expect(state.list.length === 3).toBeTruthy();
    expect(state).toMatchObject({ list: [1, 2, 3] });
  });

  test('create shared dict include map', async () => {
    const [state] = share({
      map: new Map([
        [1, 1],
        [2, 2],
        [3, 3],
      ]),
    });
    expect(state).toBeTruthy();
    expect(state.map.size === 3).toBeTruthy();
    expect(state.map.get(1) === 1).toBeTruthy();
    expect(state.map.get(2) === 2).toBeTruthy();
    expect(state.map.get(3) === 3).toBeTruthy();
  });

  test('create shared dict include set', async () => {
    const [state] = share({ set: new Set([1, 2, 3]) });
    expect(state).toBeTruthy();
    expect(state.set.size === 3).toBeTruthy();
    expect(Array.from(state.set)).toMatchObject([1, 2, 3]);
  });
});
