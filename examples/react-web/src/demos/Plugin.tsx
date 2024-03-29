import { $, addPlugin, share } from 'helux';
import { Entry, MarkUpdate } from './comps';

addPlugin({
  install(pluginCtx) {
    pluginCtx.onStateChanged((info) => {
      // log('Plugin', info);
    });
  },
});

const [sharedState, setState, call] = share({ a: 1, b: { b1: { b2: 200 } } }, { moduleName: 'Plugin' });

function changeA() {
  setState((draft) => {
    draft.a += 1;
  });
}

function SharedDict() {
  return <MarkUpdate>shared.xxx {$(sharedState.a)}</MarkUpdate>;
}

const Demo = () => (
  <Entry fns={[changeA]}>
    <SharedDict />
  </Entry>
);

export default Demo;
