import React, { useEffect, useState } from 'react'
import { describe,test,expect,afterEach } from 'vitest';
import { render, renderHook,screen,waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

//import { useShared } from '../src';

describe('useShared', () => {

  test('渲染组件', async () => {
    const table = document.createElement('table')

    const result = render(<div>hello</div>);
    // result是返回的渲染后的内容，以上可以进行断言
    // 参阅 https://testing-library.com/docs/react-testing-library/api#render-result


  });
  test('useState', async () => {
    const {result} = renderHook(() => {
      const [name, setName] = useState('')
      React.useEffect(() => {
        setName('Alice')
      }, [])

      return name
    })
   await waitFor(() => {
      expect(result.current).toBe('Alice')
    });

  });


  test('useState1', async () => {
    const CustomHookComponent = () => {
      const [name, setName] = useState('');

      useEffect(() => {
        setName('Alice');
      }, []);

      return <div>{name}</div>;
    };

    render(<CustomHookComponent />);

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBe("Alice")
    });
  });
});
