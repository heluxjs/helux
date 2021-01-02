/** @typedef {import('../../src/types').ICtxBase} Ctx */
import '../testSetup';
import React from 'react';
import { mount } from 'enzyme';
import { run, execute, register, useConcent } from '../../src/index';
import { makeStoreConfig } from '../util';

const Foo = 'foo';
const models = makeStoreConfig(Foo);
run(models, { log: false });


describe('test top api execute', () => {
  test('call execute to trigger fn in setup', () => {
    let targetClass = 'ClsComp';
    const setup = (/** @type Ctx */{ execute, ccClassKey }) => {
      execute(() => {
        console.log(`trigger execute cb in ${ccClassKey}`);
        expect(ccClassKey).toBe(targetClass);
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

    execute(targetClass);
    targetClass = 'FnComp';
    execute(targetClass);
  });
});
