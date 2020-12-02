import { emit } from '../src/index';

describe('test top api emit', () => {
  test('emit should be a function', () => {
    expect(emit).toBeInstanceOf(Function);
  });
});
