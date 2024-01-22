import '@testing-library/jest-dom';
import { describe, expect, test } from 'vitest';
import { atom, runMutateTask } from '../helux';
import { delay } from '../util';

describe('create atom mutate', () => {
  test('single mutate, pass (fn,deps)', async () => {
    const [numAtom, setAtom] = atom(1);
    // 有fn，未指定 immediate 时，task 首次不执行
    const [bAtom, , ctx] = atom(0, {
      mutate: [
        {
          deps: () => [numAtom.val],
          fn: (draft, { input: [num] }) => {
            return draft + num;
          },
          task: async ({ setState, input: [num] }) => {
            await delay(100);
            setState((draft) => draft + num);
          },
          desc: 'm1',
        },
      ],
    });
    expect(bAtom.val).toBe(1);
    await delay(120);
    expect(bAtom.val).toBe(1);
    ctx.runMutate('m1');
    expect(bAtom.val).toBe(2);
    await ctx.runMutateTask('m1');
    expect(bAtom.val).toBe(3);
  });

  test('single mutate, pass(fn,deps), set immediate=true', async () => {
    const [numAtom, setAtom] = atom(1);
    // 有fn，未指定 immediate 时，task 首次不执行
    const [bAtom] = atom(0, {
      mutate: [
        {
          deps: () => [numAtom.val],
          fn: (draft, { input: [num] }) => draft + num,
          task: async ({ setState, input: [num] }) => {
            await delay(100);
            setState((draft) => draft + num);
          },
          immediate: true,
          desc: 'changeVal',
        },
      ],
    });
    expect(bAtom.val).toBe(1); // change by fn
    await delay(120);
    expect(bAtom.val).toBe(2); // change by task

    await runMutateTask(bAtom, 'changeVal');
    await delay(120);
    expect(bAtom.val).toBe(3); // change by runMutateTask
  });

  test('single mutate, pass(deps), keep immediate=undefined', async () => {
    const [numAtom, setAtom] = atom(1);
    // 没fn，未指定 immediate 时，task 首次会被执行
    const [bAtom] = atom(0, {
      mutate: [
        {
          deps: () => [numAtom.val],
          task: async ({ setState, input: [num] }) => {
            await delay(100);
            setState((draft) => draft + num);
          },
          // immediate: undefined,
        },
      ],
    });
    await delay(120);
    expect(bAtom.val).toBe(1); // change by task
  });

  test('single mutate, pass(deps), set immediate=false', async () => {
    const [numAtom, setAtom] = atom(1);
    // 没 fn，设定 immediate=false，task 首次不执行
    const [bAtom] = atom(0, {
      mutate: [
        {
          deps: () => [numAtom.val],
          task: async ({ setState, input: [num] }) => {
            await delay(100);
            setState((draft) => draft + num);
          },
          immediate: false,
        },
      ],
    });
    await delay(120);
    expect(bAtom.val).toBe(0); // change by task

    await runMutateTask(bAtom);
    await delay(120);
    expect(bAtom.val).toBe(1); // change by runMutateTask
  });

  test('runMutateTask with extraArgs', async () => {
    const [numAtom, setAtom] = atom(1);
    // 有fn，未指定 immediate 时，task 首次不执行
    return new Promise<void>((resolve) => {
    const [bAtom, , ctx] = atom(0, {
      mutate: [
        {
          deps: () => [numAtom.val],
          task: async ({ extraArgs }) => {
            expect(extraArgs).toBe(1);
            resolve()
          },
          desc: 'm1',
        },
      ],
    });
    ctx.runMutateTask({desc:'m1',extraArgs: 1 });
    });
  });


});
