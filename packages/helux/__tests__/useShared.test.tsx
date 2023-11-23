import React from 'react'
import { renderHook,render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useShared } from '../src';


describe('useShared', () => {
  test('渲染组件', () => {
    render(<div>hello</div>);
    expect(screen.getByText).toBeDefined();

  });
  test('should increment the count', () => {
    const { result } = renderHook(() => useShared({ count: 0}));
    let [ share,setShare ] = result.current
    expect(share.count).toBe(0);
  });
});
