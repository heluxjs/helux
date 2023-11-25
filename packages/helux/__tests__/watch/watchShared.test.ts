import '@testing-library/jest-dom';
import { describe, expect, test } from 'vitest';
import { share, watch } from '../helux';

describe('watch atom', () => {
  test('trigger one time', async () => {
    const [state, setState] = share({ num: 1 });
    let triggerCount = 0;
    watch(
      () => {
        triggerCount += 1;
      },
      { deps: () => [state] },
    );
    expect(triggerCount).toBe(0);
    setState((draft) => {
      draft.num = 2;
    });
    expect(triggerCount).toBe(1);

    setState((draft) => {
      draft.num = 2;
    });
    // value not change, so triggerCount still should be one
    expect(triggerCount).toBe(1);
  });

  test('sort list num', async () => {
    const [state, setState] = share({ ids: [2, 1, 4, 5], charger: 'fancy' });
    let triggerCount = 0;
    watch(
      () => {
        triggerCount += 1;
      },
      { deps: () => [state.ids] },
    );

    let w2TriggerCount = 0;
    watch(
      () => {
        w2TriggerCount += 1;
      },
      { deps: () => [state] },
    );

    // add one book
    setState((draft) => {
      draft.ids.sort();
    });
    expect(triggerCount).toBe(1);
    expect(w2TriggerCount).toBe(1);
  });

  test('change list item', async () => {
    const [bookStore, setState] = share({ books: [{ name: 'book1' }], charger: 'fancy' });
    let triggerCount = 0;
    watch(
      () => {
        triggerCount += 1;
      },
      { deps: () => [bookStore.books] },
    );

    let w2TriggerCount = 0;
    watch(
      () => {
        w2TriggerCount += 1;
      },
      { deps: () => [bookStore] },
    );

    // add one book
    setState((draft) => {
      draft.books.push({ name: 'book2' });
    });
    expect(triggerCount).toBe(1);
    expect(w2TriggerCount).toBe(1);

    // clear all book
    setState((draft) => {
      draft.books.length = 0;
    });
    expect(bookStore.books.length).toBe(0);
    expect(triggerCount).toBe(2);
    expect(w2TriggerCount).toBe(2);
  });
});
