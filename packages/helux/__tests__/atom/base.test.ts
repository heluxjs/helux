import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom'
import { atom } from '../helux';

describe('create atom', () => {

  test('create primitive atom', async () => {
    const [numAtom] = atom(1);
    expect(numAtom).toBeTruthy();
    expect(numAtom.val === 1).toBeTruthy();
  });

  test('create dict atom', async () => {
    const [dictAtom] = atom({ a: 1, b: 2 });
    expect(dictAtom).toBeTruthy();
    expect(dictAtom.val.a === 1).toBeTruthy();
    expect(dictAtom.val.b === 2).toBeTruthy();
  });

  test('create list atom', async () => {
    const [listAtom] = atom([1, 2, 3]);
    expect(listAtom).toBeTruthy();
    expect(listAtom.val.length === 3).toBeTruthy();
    expect(listAtom.val).toMatchObject([1, 2, 3]);
  });

  test('create set atom', async () => {
    const [setAtom] = atom(new Set([1, 2, 3]));
    expect(setAtom).toBeTruthy();
    expect(setAtom.val.size === 3).toBeTruthy();
    expect(Array.from(setAtom.val)).toMatchObject([1, 2, 3]);
  });

  test('create map atom', async () => {
    const [mapAtom] = atom(new Map([[1, 1], [2, 2], [3, 3]]));
    expect(mapAtom).toBeTruthy();
    expect(mapAtom.val.size === 3).toBeTruthy();
    expect(mapAtom.val.get(1) === 1).toBeTruthy();
    expect(mapAtom.val.get(2) === 2).toBeTruthy();
    expect(mapAtom.val.get(3) === 3).toBeTruthy();
  });

});
