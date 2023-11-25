import '@testing-library/jest-dom';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, test } from 'vitest';

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
