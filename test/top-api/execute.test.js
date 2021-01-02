import { run, execute, register, useConcent } from '../../src/index';
import { makeStoreConfig } from '../util';

const Foo = 'foo';
const models = makeStoreConfig(Foo);
run(models, { log: false });


describe('test top api execute', () => {
  test('execute should be a function', () => {
    expect(execute).toBeInstanceOf(Function);
  });

  test('call execute', () => {
    execute();
  });
});
