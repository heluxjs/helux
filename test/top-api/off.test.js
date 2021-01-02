import { off } from '../../src/index';

describe('test top api off', () => {
  test('off should be a function', () => {
    expect(off).toBeInstanceOf(Function);
  });
});
