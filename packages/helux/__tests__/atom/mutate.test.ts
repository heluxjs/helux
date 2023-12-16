import type { IPlugin } from '@helux/core';
import '@testing-library/jest-dom';
import { describe, expect, test } from 'vitest';
import { addPlugin, atom, runMutate } from '../helux';

describe('create atom mutate', () => {
  function runReturnLogic(cbLogic: any) {
    const [numAtom, setAtom] = atom(1);
    const [bAtom] = atom(0, {
      mutate: () => cbLogic(numAtom),
    });
    expect(bAtom.val).toBe(11);

    setAtom(10);
    expect(bAtom.val).toBe(20);
  }

  function runReturnLogicAfterAtom(cbLogic: any) {
    const [numAtom, setAtom] = atom(1);
    const [bAtom, , ctx] = atom(0);
    ctx.mutate(() => cbLogic(numAtom, ctx));

    expect(bAtom.val).toBe(11);
    setAtom(10);
    expect(bAtom.val).toBe(20);
  }

  test('single mutate, return result ( cb has no {} )', async () => {
    runReturnLogic((numAtom) => numAtom.val + 10);
  });

  test('single mutate, return result after atom( cb has no {} )', async () => {
    runReturnLogicAfterAtom((numAtom) => numAtom.val + 10);
  });

  test('single mutate, change draft', async () => {
    const [numAtom, setAtom] = atom(1);
    const [bAtom] = atom(0, {
      mutate: (draft) => numAtom.val + 10,
    });
    expect(bAtom.val).toBe(11);

    setAtom(10);
    expect(bAtom.val).toBe(20);
  });

  test('mutate dict(fn), change draft', async () => {
    const [numAtom, setAtom] = atom(1);
    const [bAtom] = atom(
      { a: 0, b: 0 },
      {
        mutate: {
          a: (draft) => {
            draft.a = numAtom.val + 10;
          },
          b: (draft) => {
            draft.b = numAtom.val + 100;
          },
        },
      },
    );
    expect(bAtom.val.a).toBe(11);
    expect(bAtom.val.b).toBe(101);

    setAtom(10);
    expect(bAtom.val.a).toBe(20);
    expect(bAtom.val.b).toBe(110);
  });

  test('mutate dict(fnItem), change draft', async () => {
    const [numAtom, setAtom] = atom(1);
    const [bAtom] = atom(
      { a: 0, b: 0 },
      {
        mutate: {
          a: {
            fn: (draft) => {
              draft.a = numAtom.val + 10;
            },
          },
          b: {
            fn: (draft) => {
              draft.b = numAtom.val + 100;
            },
          },
        },
      },
    );
    expect(bAtom.val.a).toBe(11);
    expect(bAtom.val.b).toBe(101);

    setAtom(10);
    expect(bAtom.val.a).toBe(20);
    expect(bAtom.val.b).toBe(110);
  });

  test('rerun mutate', async () => {
    const [numAtom, setAtom] = atom(1);
    let runCount = 0;
    const [bAtom, , ctx] = atom(
      { a: 0, b: 0 },
      {
        mutate: {
          a: {
            fn: (draft) => {
              runCount += 1;
              draft.a = numAtom.val + 10;
            },
          },
        },
      },
    );
    expect(runCount).toBe(1);
    runMutate(bAtom, 'a');
    expect(runCount).toBe(2);
  });

  test('single mutate, watch self', async () => {
    const [bAtom, setAtom] = atom(
      { a: 1, b: 2 },
      {
        mutate: (draft, { state }) => {
          draft.a = state.b + 10;
        },
      },
    );

    expect(bAtom.val.b).toBe(2);
    expect(bAtom.val.a).toBe(12);

    setAtom((draft) => {
      draft.b = 100;
    });
    expect(bAtom.val.b).toBe(100);
    expect(bAtom.val.a).toBe(110);
  });

  test('multi mutate, watch self', async () => {
    const [bAtom, setAtom] = atom(
      { a: 1, b: 0, c: 0 },
      {
        mutate: {
          changeB: (draft, { state }) => {
            draft.b = state.a + 10;
          },
          changeC: (draft, { state }) => {
            draft.c = state.b + 20;
          },
        },
      },
    );

    expect(bAtom.val.a).toBe(1);
    expect(bAtom.val.b).toBe(11);
    expect(bAtom.val.c).toBe(31);

    // change a, mutate b, c
    setAtom((draft) => {
      draft.a = 2;
    });
    expect(bAtom.val.a).toBe(2);
    expect(bAtom.val.b).toBe(12);
    expect(bAtom.val.c).toBe(32);

    // change b, mutate c
    setAtom((draft) => {
      draft.b = 100;
    });
    expect(bAtom.val.a).toBe(2);
    expect(bAtom.val.b).toBe(100);
    expect(bAtom.val.c).toBe(120);
  });

  test('single mutate, watch self', async () => {
    const [bAtom, setAtom] = atom(
      { a: 1, b: 2 },
      {
        mutate: (draft, { state }) => {
          draft.a = state.b + 10;
        },
      },
    );

    expect(bAtom.val.b).toBe(2);
    expect(bAtom.val.a).toBe(12);

    setAtom((draft) => {
      draft.b = 100;
    });
    expect(bAtom.val.b).toBe(100);
    expect(bAtom.val.a).toBe(110);
  });

  test('multi mutate, watch self state with dead cycle', async () => {
    window.alert = () => { };
    let err: any = null;
    const errPlugin: IPlugin = {
      install(pluginCtx) {
        pluginCtx.on('ON_ERROR_OCCURED', (info) => {
          err = info.data.err;
        });
      },
    };
    addPlugin(errPlugin);

    atom(
      { a: 1, b: 0, c: 0 },
      {
        mutate: {
          changeB: (draft, { state }) => {
            draft.b = state.a + 10;
          },
          changeC: (draft, { state }) => {
            draft.c = state.b + 20;
          },
          changeA: (draft, { state }) => {
            draft.a = state.c + 30;
          },
        },
      },
    );

    // expect(err).toBeTruthy();
    // expect(err.message.includes('dead cycle')).toBeTruthy();
  });

  test('multi mutate, watch self draft with dead cycle', async () => {
    window.alert = () => { };
    let err: any = null;
    const errPlugin: IPlugin = {
      install(pluginCtx) {
        pluginCtx.on('ON_ERROR_OCCURED', (info) => {
          err = info.data.err;
        });
      },
    };
    addPlugin(errPlugin);

    atom(
      { a: 1, b: 0, c: 0 },
      {
        mutate: {
          changeB: (draft) => {
            draft.b = draft.a + 10;
          },
          changeC: (draft) => {
            draft.c = draft.b + 20;
          },
          changeA: (draft) => {
            draft.a = draft.c + 30;
          },
        },
      },
    );

    expect(err).toBeTruthy();
    expect(err.message.includes('dead cycle')).toBeTruthy();
  });
});
