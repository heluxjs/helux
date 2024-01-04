/**
 * compact: true
 * defaultShowCode: true
 */
import { share, watch } from 'helux';

const [priceState] = share({ a: 1 });

// 观察 priceState.a 的变化
watch(
  () => {
    console.log(`found price.a changed: () => [priceState.a]`);
  },
  () => [priceState.a],
  // 或写为
  // { deps: () => [priceState.a] }
);

export default () => ''; // 辅助渲染
