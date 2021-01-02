/** @typedef {import('../../src/types').ICtxBase} Ctx */
import '../testSetup';
import React from 'react';
import { mount } from 'enzyme';
import { run, executeAll, register, useConcent } from '../../src/index';
import { makeStoreConfig, delay } from '../util';

const Foo = 'foo';
const models = makeStoreConfig(Foo);
run(models, { log: false });


describe('test top api executeAll', () => {
  test('call executeAll to trigger all fns in setup', async () => {
    let hit = 0;
    const setup = (/** @type Ctx */{ execute, ccClassKey }) => {
      execute(() => {
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

    executeAll();
    await delay();
    expect(hit).toBe(2);
  });
});
