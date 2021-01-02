import '../testSetup';
import React from 'react';
import { CcFragment, run, getState } from '../../src/index';
import { mount } from 'enzyme';
import { getTestModels } from '../util';

const models = getTestModels();
run(models, { log: false });

describe('test CcFragment ', () => {
  test('intialize without render', () => {
    try{
      mount(<CcFragment register="test" />);
    }catch(err){
      expect(err.message).toMatch(/(?=Nothing was returned from render)/);
    }
  });

  test('intialize with render', () => {
    const compWrap = mount(<CcFragment register="test" render={({ state }) => {
      return <h1>{state.name}</h1>
    }} />);
    const h1Wrap = compWrap.find('h1')
    expect(h1Wrap.text()).toBe(getState('test').name);
  });

  test('intialize with children fn', () => {
    const compWrap = mount(<CcFragment register="test">
      {({ state }) => {
        return <h1>{state.name}</h1>
      }}
    </CcFragment>);
    const h1Wrap = compWrap.find('h1')
    expect(h1Wrap.text()).toBe(getState('test').name);
  });
});
