import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, test } from 'vitest';

describe('useShared', () => {
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
});
