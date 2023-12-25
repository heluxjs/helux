import { atom, share } from 'helux';
import { delay, log } from './util';

export const [baseAtom] = atom(3000);

export const [priceState, setPrice] = share({ a: 1, b: 100 }, { moduleName: 'Price' });

export function changePrice() {
  setPrice(
    draft => { draft.a += 100 },
    { desc: 'changePrice' },
  );
}

export const [idealPriceState, , idealPriceCtx] = share({ loading: false, retA: 0, retB: 1 }, {
  moduleName: 'IdealPrice',
  mutate: {
    retB: (draft) => draft.retB = priceState.b + 2 + baseAtom.val,
    retA: {
      deps: () => [priceState.a, baseAtom.val] as const,
      fn: (draft, { input: [a, b] }) => draft.retA = a + b,
      task: async ({ setState, input: [a, b] }) => {
        setState({ loading: true });
        await delay(1000);
        setState(draft => {
          draft.retA = priceState.a + baseAtom.val;
          draft.loading = false;
        });
      },
    }
  },
});

export const [finalPriceState] = share({ loading: false, retA: 0, time: 0 }, {
  moduleName: 'FinalPriceState',
  mutate: {
    // retA: draft => draft.retA = idealPriceState.retA - 600,
    retA: {
      deps: () => [idealPriceState.retA],
      task: async ({ setState }) => {
        setState({ loading: true });
        await delay(1000);
        setState(draft => {
          draft.retA = idealPriceState.retA - 600;
          draft.loading = false;
        });
      },
    }
  },
  before({ desc, draft }) {
    draft.time = Date.now();
    log('finalPriceState', `desc is ${desc}`);
  },
});
