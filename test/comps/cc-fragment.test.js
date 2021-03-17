import '../testSetup';
import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { CcFragment, run, getState } from '../../src/index';
import { getTestModels } from '../util';

const models = getTestModels();
run(models, { log: false, act });

describe('test CcFragment ', () => {
  test('intialize without render', () => {
    try{
      mount(<CcFragment register="test" />);
    }catch(err){
      expect(err.message).toMatch(/(?=Nothing was returned from render)/);
    }
  });

  test('supply render fn in CcFragment render prop', () => {
    const compWrap = mount(<CcFragment register="test" render={({ state }) => {
      return <h1>{state.name}</h1>
    }} />);
    const h1Wrap = compWrap.find('h1')
    expect(h1Wrap.text()).toBe(getState('test').name);
  });

  test('supply render fn in CcFragment body', () => {
    const compWrap = mount(<CcFragment register="test">
      {({ state }) => {
        return <h1>{state.name}</h1>
      }}
    </CcFragment>);
    const h1Wrap = compWrap.find('h1')
    expect(h1Wrap.text()).toBe(getState('test').name);
  });

  test('supply dom in CcFragment body', () => {
    try {
      mount(<CcFragment register="test">
        <h1>cause error</h1>
      </CcFragment>);
    } catch (err) {
      expect(err.message).toMatch(/(?=children can not be a react dom)/);
    }
  });

  test('props chagne will trigger CcFragment re-mount', () => {
    class CemoIncludeCcFragment extends React.Component {
      state = { m: 'test2' };
      changeModule = () => {
        this.setState({ m: this.state.m === 'test2' ? 'test3' : 'test2' });
      }
      render() {
        return (
          <div>
            {/* click btn to switch to another module */}
            <button onClick={this.changeModule}>change module</button>
            <CcFragment register={this.state.m}>
              {({ state }) => <h1>{state.desc}</h1>}
            </CcFragment>
          </div>
        );
      }
    }

    const compWrap = mount(<CemoIncludeCcFragment />);
    const h1Wrap = compWrap.find('h1');
    const btnWrap = compWrap.find('button');
    expect(h1Wrap.text()).toBe(getState('test2').desc);
    btnWrap.simulate('click');
    expect(h1Wrap.text()).toBe(getState('test3').desc);
  });
});
