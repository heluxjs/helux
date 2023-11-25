import { describe, expect, test } from 'vitest';
import { derive, share } from '../helux';

describe('derive dict', () => {
  test('derive shallow dict', async () => {
    const [state, setState] = share({ a: 1, b: 2 });
    const double = derive(() => ({ num1: state.a * 2, num2: state.b * 2 }));
    const plus100 = derive(() => ({ num1: double.num1 + 100, num2: double.num2 + 100 }));
    expect(double.num1).toBe(2);
    expect(double.num2).toBe(4);
    expect(plus100.num1).toBe(102);
    expect(plus100.num2).toBe(104);

    setState((draft) => {
      draft.a = 10;
      draft.b = 20;
    });
    expect(double.num1).toBe(20);
    expect(double.num2).toBe(40);
    expect(plus100.num1).toBe(120);
    expect(plus100.num2).toBe(140);
  });

  test('derive deep dict', async () => {
    const [state, setState] = share({ a: { a1: { a2: 1 }, a11: { a22: 2 } }, b: 2 });
    const double = derive(() => ({ num1: state.a.a1.a2 * 2, num2: state.b * 2 }));
    const plus100 = derive(() => ({ num1: double.num1 + 100, num2: double.num2 + 100 }));
    expect(double.num1).toBe(2);
    expect(double.num2).toBe(4);
    expect(plus100.num1).toBe(102);
    expect(plus100.num2).toBe(104);

    setState((draft) => {
      draft.a.a1.a2 = 10;
      draft.b = 20;
    });
    expect(double.num1).toBe(20);
    expect(double.num2).toBe(40);
    expect(plus100.num1).toBe(120);
    expect(plus100.num2).toBe(140);
  });
});
