import { run, register } from '../../src/index';
import { makeStoreConfig } from '../util';

const Foo = 'foo';

describe('test top api register', () => {
  const models = makeStoreConfig(Foo);

  beforeAll(() => {
    run(models, { log: false });
  });


  test('register should be a function', () => {
    expect(register).toBeInstanceOf(Function);
  });
});
