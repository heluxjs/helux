import { run, executeAll } from '../../src/index';
import { makeStoreConfig } from '../util';

const Foo = 'foo';
const models = makeStoreConfig(Foo);
run(models, { log: false });

describe('test top api executeAll', () => {
  test('executeAll should be a function', () => {
    expect(executeAll).toBeInstanceOf(Function);
  });

  test('call executeAll', () => {
    executeAll();
  });
});
