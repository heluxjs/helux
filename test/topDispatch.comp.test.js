import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import './testSetup';
import { run, useConcent, getState, dispatch, register } from '../src/index';
import { makeStoreConfig } from './util';

const models = makeStoreConfig('foo');
let container;

// with react-dom/test-utils
const executeTestLogic = (Comp) => {
  // Test first render
  const nameOld = getState('foo').name;
  act(() => {
    ReactDOM.render(<Comp />, container);
  });

  const h1 = container.querySelector('h1');
  expect(h1.textContent).toBe(nameOld);

  // Test second render
  const nameNew = 'nameNew';
  act(() => {
    dispatch(models.foo.reducer.changeName, nameNew);
  });
  expect(h1.textContent).toBe(nameNew);
}

// with enzyme
const executeTestLogicWithEnzyme = (Comp) => {
  // Test first render
  const nameOld = getState('foo').name;
  const compWrap = mount(<Comp />);
  const h1Wrap = compWrap.find('h1')
  expect(h1Wrap.text()).toBe(nameOld);

  // Test second render
  const nameNew = 'nameNew_' + Date.now();
  act(() => {
    dispatch(models.foo.reducer.changeName, nameNew);
  });
  expect(h1Wrap.text()).toBe(nameNew);
}


describe('test top api dispatch', () => {
  beforeAll(() => {
    run(models, { logError: false });
  });

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });


  // https://reactjs.org/docs/test-utils.html#act
  test('dispatch should change function component state', async () => {
    function Comp() {
      const { state } = useConcent('foo');
      return <h1>{state.name}</h1>
    };
    // executeTestLogic(Comp);
    executeTestLogicWithEnzyme(Comp);
  });

  test('dispatch should change class component state', async () => {
    const Comp = register('foo')(
      class extends React.Component {
        render() {
          const { state } = this; // or this.ctx
          return <h1>{state.name}</h1>
        }
      }
    );
    executeTestLogic(Comp);
  });
});
