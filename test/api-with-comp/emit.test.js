import React from 'react';
import { mount } from 'enzyme';
import '../testSetup';
import { run, useConcent, emit, register } from '../../src/index';
import { makeStoreConfig, delay } from '../util';


run(makeStoreConfig('foo'), { log: false });

describe('test top api emit with react component', () => {
  test('emit should have effect on function component', async () => {
    let evReceived = false;
    let receivedParamList = [];

    function setup(ctx) {
      ctx.on('ev', (...paramList) => {
        evReceived = true;
        receivedParamList = paramList;
      });
    }

    function CompFn() {
      useConcent({ module: 'foo', setup });
      return <h1>hello world</h1>
    };

    mount(<CompFn />); // instantiate function comp
    await delay();

    expect(!evReceived).toBeTruthy();
    expect(receivedParamList.length === 0).toBeTruthy();

    const paramList = [1, true, { desc: 'this is a object' }];
    emit('ev', ...paramList);
    expect(evReceived).toBeTruthy();
    expect(receivedParamList.length === paramList.length).toBeTruthy();
    expect(receivedParamList[0] === paramList[0]).toBeTruthy();
    expect(receivedParamList[1] === paramList[1]).toBeTruthy();
    expect(receivedParamList[2] === paramList[2]).toBeTruthy();
  });


  test('emit should have effect on class component', async () => {
    let receivedClsParamList = [];
    function setup(ctx) {
      ctx.on('ev2', (...paramList) => {
        receivedClsParamList = paramList;
      });
    }

    const CompCls = register({ module: 'foo', setup })(
      class extends React.Component {
        render() {
          return <h1>class component</h1>
        }
      }
    )
    mount(<CompCls />);
    await delay();

    const paramList = [1, 'string arg']
    emit('ev2', ...paramList);
    expect(receivedClsParamList.length === paramList.length).toBeTruthy();
    expect(receivedClsParamList[0] === paramList[0]).toBeTruthy();
    expect(receivedClsParamList[1] === paramList[1]).toBeTruthy();
  });
});
