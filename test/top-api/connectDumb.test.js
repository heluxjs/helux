import { connectDumb } from '../../src/index';


describe('test top api connectDumb', () => {

  test('connectDumb should be a function', () => {
    expect(connectDumb).toBeInstanceOf(Function);
  });
});
