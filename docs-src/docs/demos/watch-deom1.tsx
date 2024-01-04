/**
 * title: 点击 changeA 按钮，观察 tip 变化
 * defaultShowCode: true
 */
import { getSnap, share, useWatch } from 'helux';
import React from 'react';
const [priceState, setPrice] = share({ a: 1 });

function changeA() {
  setPrice((draft) => void (draft.a += 1));
}

function Comp() {
  const [tip, setTip] = React.useState('');
  // watch 回调随组件销毁会自动取消监听
  useWatch(
    () => {
      setTip(
        `priceState.a changed from ${getSnap(priceState).a} to ${priceState.a}`,
      );
    },
    () => [priceState.a],
  );

  return <h1>watch tip: {tip}</h1>;
}

export default () => (
  <div>
    <Comp />
    <button type="button" onClick={changeA}>
      changeA
    </button>
  </div>
);
