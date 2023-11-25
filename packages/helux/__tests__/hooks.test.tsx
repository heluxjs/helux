import * as React from 'react'
import { describe, test, expect, afterEach } from 'vitest';
import { render, renderHook, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { pfstr } from './util'
import { useShared } from '../src';

describe('useShared', () => {
  test('useShared', async () => {
    const { result } = renderHook(() => {
      const [name, setName] = React.useState('')
      React.useEffect(() => {
        setName('Alice')
      }, [])

      return name
    })
    await waitFor(() => {
      expect(result.current).toBe('Alice')
    });
  });
});
