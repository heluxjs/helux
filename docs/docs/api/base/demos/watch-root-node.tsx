/**
 * compact: true
 * defaultShowCode: true
 */
import { atom, share, watch } from 'helux';

const [priceState] = share({ a: 1 });
const [numAtom] = atom(3000);

// 观察整个 priceState 的变化
watch(
  () => {
    console.log(`found price changed: [ priceState ]`);
  },
  () => [priceState],
);

// 观察整个 priceState 和 numAtom 的变化
watch(
  () => {
    console.log(`found price or numAtom changed: ()=>[ priceState, numAtom ]`);
  },
  () => [priceState, numAtom],
);

export default () => ''; // 辅助渲染
