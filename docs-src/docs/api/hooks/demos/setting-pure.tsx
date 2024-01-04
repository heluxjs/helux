/**
 * defaultShowCode: true
 */
import { MarkUpdate } from '@helux/demo-utils';
import { atom, useAtom } from 'helux';
import { dictFactory } from './data';

const [dictAtom] = atom(dictFactory);

function PureDemo(props: { pure: boolean }) {
  // pure 不写，默认为 true
  const [state, , info] = useAtom(dictAtom, { pure: props.pure });
  const { extra, name, desc } = state;
  // 这里继续下钻读取了 state.extra 的子节点，故state.extra 算作一个中间态的依赖
  const { list, mark } = extra;

  return (
    <MarkUpdate info={info}>
      <div>{name}</div>
      <div>{desc}</div>
      <div>{list.length}</div>
      <div>{mark}</div>
    </MarkUpdate>
  );
}

export default () => (
  <>
    <PureDemo pure={true} />
    <PureDemo pure={false} />
  </>
);
