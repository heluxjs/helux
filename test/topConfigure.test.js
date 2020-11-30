import { run, configure, getState, getComputed, dispatch } from '../src/index';
import { makeStoreConfig, extractMessage } from './util';

const Foo = 'foo';

describe('test top api configure', () => {
  const models = makeStoreConfig(Foo);

  beforeAll(() => {
    run(models, { logError: false });
  });


  test('configure with one fn param', () => {
    configure({
      foo2: {
        state: {
          name: 'foo2',
        }
      }
    });
    const fooState2 = getState('foo2');
    expect(fooState2.name).toBe('foo2');
  });


  test('configure with two fn params', () => {
    configure('foo3', {
      state: {
        name: 'foo3',
      }
    });
    const fooState3 = getState('foo3');
    expect(fooState3.name).toBe('foo3');
  });

  
  test('configure dup module', () => {
    try {
      configure('foo4', {
        state: {
          name: 'foo4',
        }
      });
      configure('foo4', {
        state: {
          name: 'foo4',
        }
      });
    } catch (err) {
      expect(extractMessage(err)).toMatch(/(?=module name duplicate)/);
    }
  });


  test('reducer、computed of configured module should work', async () => {
    const foo5Model = {
      state: {
        name: 'foo5',
        remark: 'nameRemark',
        age: 19,
      },
      reducer: {
        changeName(name) {
          return { name };
        },
      },
      computed: {
        prefixedName({ name }) {
          return `$$${name}`;
        },
      },
    };
    configure('foo5', foo5Model);

    const foo5State = getState('foo5');
    const foo5Cu = getComputed('foo5');
    expect(foo5State.name === 'foo5').toBeTruthy();
    expect(foo5Cu.prefixedName === '$$foo5').toBeTruthy();
    expect(foo5Cu.age == undefined).toBeTruthy();

    const toChangeName = 'newName';
    await dispatch(foo5Model.reducer.changeName, toChangeName);
    expect(foo5State.name === toChangeName).toBeTruthy();
    expect(foo5State.remark === 'nameRemark').toBeTruthy();
    expect(foo5Cu.prefixedName === '$$newName').toBeTruthy();
  });
});
