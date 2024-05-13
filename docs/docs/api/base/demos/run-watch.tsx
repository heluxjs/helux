/**
 * defaultShowCode: true
 */
import { share, watch } from 'helux';

const [priceState, setState] = share({ a: 1, c: 0 });

// 观察整个 priceState 的变化
const ret = watch(
  () => {
    console.log(`found price changed: [ priceState ]`);
  },
  () => [priceState],
);

ret.unwatch(); // 取消观察后，watch 不会再被自动触发

function changeState() {
  setState(draft => void (draft.a += 100));
}

function run() {
  ret.run(); // 人工触发始终有效，和 unwatch 是否执行没关系
}

// for react demo renderer
export default () => (
  <div>
    <h1>after calling unwatch</h1>
    <button type="button" onClick={changeState}>change state will not trigger watch</button>
    <br />
    <br />
    <button type="button" onClick={run}>run will still trigger watch</button>
  </div>
);
