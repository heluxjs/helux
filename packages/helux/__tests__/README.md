## renderHook 注意事项

### useEffect 会在外部调用前调用

// 打印顺序 1 2 3 4

```ts
renderHook(() => {
  console.log('1');
  useEffect(() => {
    console.log('3');
  }, []);
  console.log('2');
});
console.log('4');
```

## 奇怪的测试结果

### atom 数组变化

如下代码

```ts
const [listAtom, setAtom] = atom([
  { a: 1, b: { name: 2 } },
  { a: 2, b: { name: 4 } },
]);
function changeItem() {
  const prevItem0 = listAtom.val[0];
  const prevItem1 = listAtom.val[1];
  setAtom((draft) => {
    draft.val[0].b.name = Date.now();
  });
  const currItem0 = listAtom.val[0];
  const currItem1 = listAtom.val[1];
  console.log('prevItem0===currItem0 ', prevItem0 === currItem0);
  console.log('prevItem1===currItem1 ', prevItem1 === currItem1);
}
changeItem();
```

浏览器里 或 jest 里执行

```text
prevItem0===currItem0  false
prevItem1===currItem1  true
```

vitest 里执行

```text
prevItem0===currItem0  false
prevItem1===currItem1  false
```

## 可参考的测试代码

```ts
import * as React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { pfstr } from './util';
import { useShared } from '../src';

describe('useShared', () => {
  let idCounter = 1;

  const NumberDisplay = ({ number }) => {
    const id = React.useRef(idCounter++); // to ensure we don't remount a different instance

    return (
      <div>
        <span data-testid="number-display">{number}</span>
        <span data-testid="instance-id">{id.current}</span>
      </div>
    );
  };

  test('calling render with the same component on the same container does not remount', () => {
    const { rerender } = render(<NumberDisplay number={1} />);
    expect(screen.getByTestId('number-display')).toHaveTextContent('1');

    // re-render the same component with different props
    rerender(<NumberDisplay number={2} />);
    expect(screen.getByTestId('number-display')).toHaveTextContent('2');
    expect.extend;
    expect(screen.getByTestId('instance-id')).toHaveTextContent('1');
  });

  test('渲染组件', async () => {
    const table = document.createElement('table');

    const result = render(<div>hello</div>);
    // result是返回的渲染后的内容，以上可以进行断言
    // 参阅 https://testing-library.com/docs/react-testing-library/api#render-result
  });

  test('useShared', async () => {
    const { result } = renderHook(() => {
      const [name, setName] = React.useState('');
      React.useEffect(() => {
        setName('Alice');
      }, []);

      return name;
    });
    await waitFor(() => {
      expect(result.current).toBe('Alice');
    });
  });

  test('useState1', async () => {
    const CustomHookComponent = () => {
      const [name, setName] = React.useState('');
      React.useEffect(() => {
        setName('Alice');
      }, []);
      return <div>{name}</div>;
    };

    render(<CustomHookComponent />);

    await waitFor(() => {
      expect(screen.getByText('Alice').textContent).toBe('Alice');
    });
  });
});
```
