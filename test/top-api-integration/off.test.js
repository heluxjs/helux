/** @typedef {import('../../src/types').ICtxBase} Ctx */
import '../testSetup';
import React from 'react';
import { mount } from 'enzyme';
import { run, off, emit, register, useConcent } from '../../src/index';
import { makeStoreConfig } from '../util';

const Foo = 'foo';
const models = makeStoreConfig(Foo);
run(models, { log: false });


describe('test top api off', () => {
  test('call off to off ins event', () => {
    let hit = 0;
    const setup = (/** @type Ctx */{ on }) => {
      on('ev', () => {
        hit++;
      })
    };

    const ClsComp = register({ setup }, 'ClsComp')(
      class extends React.Component {
        render() {
          return <h1>trigger execute</h1>;
        }
      }
    );
    const FnComp = () => {
      useConcent({ setup }, 'FnComp');
      return <h1>trigger execute</h1>;
    };
    mount(<ClsComp />);
    mount(<FnComp />);

    off('ev', { ccClassKey: 'ClsComp' });
    emit('ev');

    // only FnComp receive 'ev' event
    expect(hit).toBe(1);
  });
});
