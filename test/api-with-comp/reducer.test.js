import '../testSetup';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { makeStoreConfig } from '../util';
import { run, useConcent, getState, reducer, register, cst } from '../../src/index';

const Foo = 'foo';

function executeTestLogic(Comp) {
  // Test first render
  const nameOld = getState('foo').name;
  const compWrap = mount(<Comp />);
  const h1Wrap = compWrap.find('h1')
  expect(h1Wrap.text()).toBe(nameOld);

  // Test second render
  const nameNew = `nameNew_${Date.now()}`;
  act(() => {
    reducer[Foo].changeName(nameNew);
  });
  expect(h1Wrap.text()).toBe(nameNew);
}

const models = makeStoreConfig('foo');
run(models, { logError: false });

describe('test top property reducer', () => {
  test('call reducer.{moduleName}.{fn} should change function component state', () => {
    function Comp() {
      const { state } = useConcent('foo');
      return <h1>{state.name}</h1>
    };
    executeTestLogic(Comp);
  });


  test('call reducer.{moduleName}.{fn} should change class component state', () => {
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
