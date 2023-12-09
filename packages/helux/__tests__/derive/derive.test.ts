import { describe, expect, test } from 'vitest';
import { atom, derive } from '../helux';

describe('derive atom', () => {
  test('derive primitive', async () => {
    const [numAtom, setAtom] = atom(1);
    const double = derive(() => numAtom.val * 2);
    const plus100 = derive(() => double.val + 100);
    expect(double.val).toBe(2);
    expect(plus100.val).toBe(102);

    setAtom(10);
    expect(double.val).toBe(20);
    expect(plus100.val).toBe(120);
  });

  test('derive dict', async () => {
    const [dictAtom, setAtom] = atom({ a: 1, b: 2 });
    const result1 = derive(() => ({ plus100: dictAtom.val.a + 100, plus200: dictAtom.val.a + 200 }));
    const result2 = derive(() => ({ plus100Double: result1.val.plus100 * 2, plus200Double: result1.val.plus200 * 2 }));
    expect(result1.val.plus100).toBe(101);
    expect(result1.val.plus200).toBe(201);
    expect(result2.val.plus100Double).toBe(202);
    expect(result2.val.plus200Double).toBe(402);

    setAtom((draft) => {
      draft.a = 10;
    });
    expect(result1.val.plus100).toBe(110);
    expect(result1.val.plus200).toBe(210);
    expect(result2.val.plus100Double).toBe(220);
    expect(result2.val.plus200Double).toBe(420);
  });
});
