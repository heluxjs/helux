import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { atom } from '../helux';

describe('use atom', () => {
  test('read primitive', async () => {
    const [, , ctx] = atom(1);
    const Comp = () => {
      const [state] = ctx.useState();
      return <div data-testid="box">{state}</div>;
    };
    render(<Comp />);
    await waitFor(() => {
      expect(screen.getByTestId('box').textContent).toBe('1');
    });
  });

  test('read dict', async () => {
    const [, , ctx] = atom({ a: 1, b: 2 });
    const Comp = () => {
      const [state] = ctx.useState();
      return <div data-testid="box">{state.a}</div>;
    };
    render(<Comp />);
    await waitFor(() => {
      expect(screen.getByTestId('box').textContent).toBe('1');
    });
  });

  /** 测试精确更新 */
  test('exact update', async () => {
    const [, setAtom, ctx] = atom({ a: 1, b: 2 });
    let aRenderCount = 0;
    let bRenderCount = 0;
    const CompA = (props) => {
      aRenderCount += 1;
      const [state] = ctx.useState();
      return <div data-testid={props.id}>{state.a}</div>;
    };
    const CompB = (props) => {
      bRenderCount += 1;
      const [state] = ctx.useState();
      return <div data-testid={props.id}>{state.b}</div>;
    };

    render(<CompA id="1" />);
    render(<CompB id="2" />);
    expect(aRenderCount).toBe(1);
    expect(bRenderCount).toBe(1);

    act(() => {
      setAtom((draft) => {
        draft.val.a = 100;
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('1').textContent).toBe('100');
    });

    expect(aRenderCount).toBe(2);
    expect(bRenderCount).toBe(1);
  });
});
