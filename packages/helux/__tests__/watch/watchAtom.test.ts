import '@testing-library/jest-dom';
import { describe, expect, test } from 'vitest';
import { atom, watch } from '../helux';

describe('watch atom', () => {
  function setDeps(setAtom, deps) {
    let triggerCount = 0;
    watch(
      () => {
        triggerCount += 1;
      },
      { deps },
    );
    expect(triggerCount).toBe(0);
    setAtom(2);
    expect(triggerCount).toBe(1);

    setAtom(2);
    setAtom(2);
    // value not change, so triggerCount still should be one
    expect(triggerCount).toBe(1);
  }

  test('trigger one time ( no unbox )', async () => {
    const [numAtom, setAtom] = atom(1);
    setDeps(setAtom, () => [numAtom]);
  });

  test('trigger one time ( unbox )', async () => {
    const [numAtom, setAtom] = atom(1);
    setDeps(setAtom, () => [numAtom.val]);
  });

  test('change list item', async () => {
    const [bookStoreAtom, setAtom] = atom({ books: [{ name: 'book1' }], charger: 'fancy' });
    let triggerCount = 0;
    watch(
      () => {
        triggerCount += 1;
      },
      { deps: () => [bookStoreAtom.val.books] },
    );

    let w2TriggerCount = 0;
    watch(
      () => {
        w2TriggerCount += 1;
      },
      { deps: () => [bookStoreAtom] },
    );

    setAtom((draft) => {
      draft.val.books.push({ name: 'book2' });
    });

    expect(triggerCount).toBe(1);
    expect(w2TriggerCount).toBe(1);
  });
});
