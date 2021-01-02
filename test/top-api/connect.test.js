import { connect } from '../../src/index';


describe('test top api connect', () => {

  test('connect should be a function', () => {
    expect(connect).toBeInstanceOf(Function);
  });
});
