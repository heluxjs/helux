import '../testSetup';
import React from 'react';
import { Ob, run, getState, getComputed } from '../../src/index';
import { mount } from 'enzyme';
import { getTestModels } from '../util';

const models = getTestModels();
run(models, { log: false });

describe('test CcFragment ', () => {
  test('intialize without render', () => {
    const compWrap = mount(<Ob module="test" />);
    expect(compWrap.text()).toBe('miss render prop or children');
  });

  test('intialize with render, read state', () => {
    const compWrap = mount(<Ob module="test" render={([state]) => <h1>{state.name}</h1>} />);
    const h1Wrap = compWrap.find('h1')
    expect(h1Wrap.text()).toBe(getState('test').name);
  });

  test('intialize with render, read computed', () => {
    const compWrap = mount(<Ob module="test" render={([, cu]) => <h1>{cu.nameAndAge}</h1>} />);
    const h1Wrap = compWrap.find('h1')
    expect(h1Wrap.text()).toBe(getComputed('test').nameAndAge);
  });

  test('intialize with children fn, read state', () => {
    const compWrap = mount(<Ob module="test">
      {([state]) => <h1>{state.name}</h1>}
    </Ob>);
    const h1Wrap = compWrap.find('h1')
    expect(h1Wrap.text()).toBe(getState('test').name);
  });

  test('intialize with children fn, read computed', () => {
    const compWrap = mount(<Ob module="test">
      {([, cu]) => <h1>{cu.nameAndAge}</h1>}
    </Ob>);
    const h1Wrap = compWrap.find('h1')
    expect(h1Wrap.text()).toBe(getComputed('test').nameAndAge);
  });
});
