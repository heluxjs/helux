import '@testing-library/jest-dom';
import { describe, expect, test } from 'vitest';
import { atom } from '../helux';

// 依赖自己修改自己，触发死循环
describe('atom mutate fn change self by using self throw dead cycle error', () => {
  test('width deps', async () => {
    try {
      const [numAtom, setAtom] = atom(1);
      const [bAtom] = atom(0, {
        mutate: [
          {
            deps: () => [numAtom.val],
            fn: (draft, { input: [num], draftRoot }) => (draftRoot.val = draftRoot.val + num),
            task: async (params) => {
              params.draftRoot.val = 200;
            },
          },
        ],
      });
    } catch (err) {
      expect(err.message.includes('DEAD_CYCLE')).toBeTruthy();
    }
  });

  test('with fnItem no deps', async () => {
    try {
      const [numAtom, setAtom] = atom(1);
      const [bAtom] = atom(0, {
        mutate: [
          {
            fn: (draft, { input: [num], draftRoot }) => (draftRoot.val = draftRoot.val + numAtom.val),
          },
        ],
      });
    } catch (err) {
      expect(err.message.includes('DEAD_CYCLE')).toBeTruthy();
    }
  });

  test('with normal fn ', async () => {
    try {
      const [numAtom, setAtom] = atom(1);
      const [bAtom] = atom(0, {
        mutate: [(draft, { input: [num], draftRoot }) => (draftRoot.val = draftRoot.val + numAtom.val)],
      });
    } catch (err) {
      expect(err.message.includes('DEAD_CYCLE')).toBeTruthy();
    }
  });
});
