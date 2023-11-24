import * as React from 'react'
import { describe, test, expect, afterEach } from 'vitest';
import { render, renderHook, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { share } from './heluxCore';

describe('share', () => {

  test('read shared', async () => {
    const [, , ctx] = share({ a: 1, b: { b1: 1 } });
    const SharedStateComp = () => {
      const [state] = ctx.useState();
      return <div data-testid="box">{state.a}</div>;
    };
    render(<SharedStateComp />);
    await waitFor(() => {
      expect(screen.getByTestId('box').textContent).toBe('1');
    });
  });

  test('write shared', async () => {
    // define shared state
    const [, setState, ctx] = share({ a: 1, b: { b1: 1 } });
    // use shared state in component
    const SharedStateComp = (props) => {
      const [state, setState] = ctx.useState();
      const onClick = () => {
        setState(draft => { draft.a = 2 });
      };

      return (
        <div>
          <button onClick={onClick}>click</button>
          <div data-testid={props.id}>{state.a}</div>
        </div>
      );
    };
    const { getByText, getByTestId } = render(<SharedStateComp id="1" />);
    getByText('click').click();
    await waitFor(() => {
      expect(getByTestId('1').textContent).toBe('2');
    });
  });

  test('change by comp click event, render multi comps', async () => {
    // define shared state
    const [, setState, ctx] = share({ a: 1, b: { b1: 1 } });
    // use shared state in component
    const SharedStateComp = (props) => {
      const [state, setState] = ctx.useState();
      return (
        <div>
          <button onClick={() => setState(draft => { draft.a = 2 })}>click{props.id}</button>
          <div data-testid={props.id}>{state.a}</div>
        </div>
      );
    };
    const { getByText, getByTestId } = render(<SharedStateComp id="1" />);
    render(<SharedStateComp id="2" />);
    // assert
    await waitFor(() => {
      expect(getByTestId('1').textContent).toBe('1');
      expect(getByTestId('2').textContent).toBe('1');
    });
    // change by comp click event
    getByText('click1').click();
    // assert
    await waitFor(() => {
      expect(getByTestId('1').textContent).toBe('2');
      expect(getByTestId('2').textContent).toBe('2');
    });
  });

  test('change by top api, render multi comps', async () => {
    const [, setState, ctx] = share({ a: 1, b: { b1: 1 } });
    const SharedStateComp = (props) => {
      // use shared state
      const [state] = ctx.useState();
      return <div data-testid={props.id}>{state.a}</div>
    };
    // render multi components that using the same shared state
    render(<SharedStateComp id="1" />);
    render(<SharedStateComp id="2" />);
    // assert
    await waitFor(() => {
      expect(screen.getByTestId('1').textContent).toBe('1');
      expect(screen.getByTestId('2').textContent).toBe('1');
    });
    // change by top api
    setState(draft => { draft.a = 2 });
    // assert
    await waitFor(() => {
      expect(screen.getByTestId('1').textContent).toBe('2');
      expect(screen.getByTestId('2').textContent).toBe('2');
    });
  });
});
