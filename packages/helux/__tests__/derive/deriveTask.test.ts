import { describe, expect, test } from 'vitest';
import { deriveDict, runDeriveTask, share } from '../helux';
import { delay } from '../util';

describe('derive async', () => {
  test('immediate=undefined, pass fn and task 2', async () => {
    const [state, setState] = share({ a: 1, b: 2 });
    const double = deriveDict({
      fn: () => ({ num1: state.a * 2, num2: state.b * 2 }),
      task: async () => {
        await delay(100);
        return { num1: state.a * 4, num2: state.b * 4 };
      },
    });
    expect(double.num1).toBe(2);
    expect(double.num2).toBe(4);
    setState((draft) => {
      draft.a = 10;
      draft.b = 20;
    });
    await delay(200);
    expect(double.num1).toBe(40);
    expect(double.num2).toBe(80);
  });

  test('immediate=undefined, only pass task', async () => {
    const [state] = share({ a: 1, b: 2 });
    try {
      const double = deriveDict({
        task: async () => {
          await delay(100);
          return { num1: state.a * 4, num2: state.b * 4 };
        },
      });
    } catch (err) {
      expect(err.message.includes('ERR_NON_FN: derive need fn arg')).toBeTruthy();
    }
  });

  test('immediate=undefined, only pass task and deps', async () => {
    const [state] = share({ a: 1, b: 2 });
    try {
      const double = deriveDict({
        deps: () => [state.a, state.b],
        task: async ({ input: [a, b] }) => {
          await delay(100);
          return { num1: a * 4, num2: b * 4 };
        },
      });
    } catch (err) {
      expect(err.message.includes('ERR_NON_FN: derive need fn arg')).toBeTruthy();
    }
  });

  test('immediate=true', async () => {
    const [state, setState] = share({ a: 1, b: 2 });
    let funRunCount = 0;
    const double = deriveDict({
      fn: () => {
        funRunCount += 1;
        return { num1: state.a * 2, num2: state.b * 2 };
      },
      task: async () => {
        await delay(100);
        return { num1: state.a * 4, num2: state.b * 4 };
      },
      immediate: true,
    });
    expect(funRunCount).toBe(1);
    expect(double.num1).toBe(2);
    expect(double.num2).toBe(4);
    await delay(200);
    expect(funRunCount).toBe(1);
    expect(double.num1).toBe(4); // result form task 1 * 4
    expect(double.num2).toBe(8); // result form task 2 * 4

    setState((draft) => {
      draft.a = 10;
      draft.b = 20;
    });
    await delay(200);
    // trigger task
    expect(funRunCount).toBe(1);
    expect(double.num1).toBe(40);
    expect(double.num2).toBe(80);
  });

  test('immediate=false, pass deps', async () => {
    const [state] = share({ a: 1, b: 2 });
    const double = deriveDict({
      deps: () => [state.a, state.b],
      fn: ({ input: [a, b] }) => ({ num1: a * 2, num2: b * 2 }),
      task: async ({ input: [a, b] }) => {
        await delay(100);
        return { num1: a * 4, num2: b * 4 };
      },
      immediate: false,
    });
    expect(double.num1).toBe(2);
    expect(double.num2).toBe(4);
    await delay(200);
    expect(double.num1).toBe(2);
    expect(double.num2).toBe(4);

    // rerun derive task
    runDeriveTask(double);
    await delay(200);
    expect(double.num1).toBe(4);
    expect(double.num2).toBe(8);
  });
});
