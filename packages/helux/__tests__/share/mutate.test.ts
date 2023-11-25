import '@testing-library/jest-dom';
import { describe, expect, test } from 'vitest';
import { share } from '../helux';

describe('create share mutate', () => {
  test('multi mutate dict, change draft', async () => {
    const [state, setState] = share({ num: 1 });
    const [bShared] = share(
      { a: { val: 0 }, b: { val: 0 } },
      {
        mutate: {
          a: (draft) => {
            draft.a.val = state.num + 10;
          },
          b: (draft) => {
            draft.b.val = state.num + 100;
          },
        },
      },
    );
    expect(bShared.a.val).toBe(11);
    expect(bShared.b.val).toBe(101);

    setState((draft) => {
      draft.num = 10;
    });
    expect(bShared.a.val).toBe(20);
    expect(bShared.b.val).toBe(110);
  });
});
