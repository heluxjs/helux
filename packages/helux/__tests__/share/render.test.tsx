import * as React from 'react'
import { describe, test, expect } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { share } from '../helux';

describe('use shared', () => {

  test('read primitive', async () => {
    const [, , ctx] = share({ a: 1, b: 2 });
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
    const [state, setState, ctx] = share({ a: { a1: { a2: 1 }, a11: { a22: 2 } }, b: 2 });
    let aRenderCount = 0;
    let bRenderCount = 0;
    const CompA = (props) => {
      aRenderCount += 1;
      const [state] = ctx.useState();
      return <div data-testid={props.id}>{state.a.a1.a2}</div>;
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
      setState(draft => { draft.a.a1.a2 = 100 });
    });

    await waitFor(() => {
      expect(screen.getByTestId('1').textContent).toBe('100');
    });

    expect(aRenderCount).toBe(2);
    expect(bRenderCount).toBe(1);
  });

  /** 测试实时依赖收集 */
  test('realtime dep collection', async () => {
    const [state, setState, ctx] = share({ a: { a1: { a2: 1 }, a11: { a22: 2 } }, b: 2 });
    let aRenderCount = 0;
    const CompA = (props) => {
      aRenderCount += 1;
      const [state] = ctx.useState();
      return (
        <div>
          <div data-testid={props.id}>{state.b <= 2 ? state.a.a1.a2 : 0}</div>
        </div>
      );
    };

    render(<CompA id="1" />);
    expect(aRenderCount).toBe(1);

    act(() => { setState(draft => { draft.b = 3 }) });
    await waitFor(() => {
      expect(screen.getByTestId('1').textContent).toBe('0');
    });
    expect(aRenderCount).toBe(2);

    // comp lost dep state.a.a1.a2
    act(() => { setState(draft => { draft.a.a1.a2 = Date.now() }) });
    expect(aRenderCount).toBe(2);
    act(() => { setState(draft => { draft.a.a1.a2 = Date.now() }) });
    expect(aRenderCount).toBe(2);
  });

  test('render by rule id', async () => {
    const [state, setState, ctx] = share(
      { a: { a1: { a2: 1 }, a11: { a22: 2 } }, b: 2 },
      {
        rules: [
          { when: (state) => state.b, ids: ['JustUpdate'] },
        ]
      }
    );
    let aRenderCount = 0;
    const CompA = (props) => {
      aRenderCount += 1;
      const [state] = ctx.useState({ id: 'JustUpdate' });
      return (
        <div>
          <div data-testid={props.id}>{state.a.a1.a2}</div>
        </div>
      );
    };

    render(<CompA id="1" />);
    expect(aRenderCount).toBe(1);
    act(() => { setState(draft => { draft.a.a1.a2 = 2 }) });
    await waitFor(() => {
      expect(screen.getByTestId('1').textContent).toBe('2');
    });
    expect(aRenderCount).toBe(2);

    // Comps only has dep state.a.a1.a2
    act(() => { setState(draft => { draft.b = 3 }) });
    // but still rerender by 'JustUpdate' id
    expect(aRenderCount).toBe(3);
  });

});
