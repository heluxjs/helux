import { $, share } from 'helux';
import { Entry, MarkUpdate } from '../comps';

const [shared, setShared, { reactive }] = share({
  a: {
    b: { c: 1 },
    b1: { c1: 1 },
  },
  info: { name: 'helux', age: 1 },
  desc: 'awesome lib',
  extra: {
    mark: 'extra',
  },
});

const changeABC = () => {
  console.log('reactive changeABC');
  reactive.a.b.c += 1;
};

// setInterval(() => reactive.a.b.c++, 1000);

function Info() {
  return (
    <MarkUpdate>
      <h2>reactive.a.b.c {$(reactive.a.b.c)}</h2>
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry fns={[changeABC]}>
    <Info />
  </Entry>
);

export default Demo;
