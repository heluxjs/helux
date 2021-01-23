import './_prepareMcc';
import { bindCcToMcc } from '../../src/index';

describe('test top api bindCcToMcc', () => {
  test('should be a function', () => {
    expect(bindCcToMcc).toBeInstanceOf(Function);
  });


  test('should visit cc from mcc', () => {
    bindCcToMcc('demo');
    expect(window.mcc.demo).toBeTruthy();
  });

  test('can not bind same name', () => {
    try {
      bindCcToMcc('demo');
    } catch (err) {
      expect(err.message).toMatch(/(?=already existed in window.mcc)/);
    }
  });
});
