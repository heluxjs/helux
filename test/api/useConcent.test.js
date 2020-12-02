import { run, useConcent } from '../../src/index';
import { makeStoreConfig } from '../util';

const Foo = 'foo';

describe('test top api useConcent', () => {
  const models = makeStoreConfig(Foo);

  beforeAll(() => {
    run(models, { logError: false });
  });


  test('useConcent should be a function', () => {
    expect(useConcent).toBeInstanceOf(Function);
  });
});
