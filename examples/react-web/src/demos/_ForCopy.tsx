import { $, share } from 'helux';
import { Entry, MarkUpdate } from './comps';

const [sharedState, setState, ctx] = share({ a: 1, b: { b1: { b2: 200 } } }, { moduleName: '_ForCopy' });

function changeA() {
  setState((draft) => {
    draft.a += 1;
  });
}

function Comp() {
  return <MarkUpdate>shared.xxx {$(sharedState.a)}</MarkUpdate>;
}

const Demo = () => (
  <Entry fns={[changeA]}>
    <Comp />
  </Entry>
);

export default Demo;
