// @ts-nocheck
import { share } from 'helux';
import { delay } from './logic/util';

console.log('===========> share');

// TODO 解决这个死循环
const [finalPriceState] = share(
  { loading: false, retA: 0, time: 0 },
  {
    mutate: {
      // retA: draft => draft.retA = idealPriceState.retA - 600,
      retA11: {
        // deps: () => [idealPriceState.retA] as const,
        task: async ({ setState }) => {
          console.error('call task logic ');
          setState({ loading: true });
          console.error('call setState({ loading: true })');
          await delay(100);
          setState((draft) => {
            // draft.retA = idealPriceState.retA - 600;
            draft.loading = false;
            draft.time = 1;
          });
        },
      },
    },
    // before({ desc, draft }) {
    //   draft.time = Date.now();
    //   log('finalPriceState', `desc is ${desc}`, draft);
    // },
  },
);

const Demo = () => <h1>call task immediately lead a dead cycle( fixed )</h1>;

export default Demo;
