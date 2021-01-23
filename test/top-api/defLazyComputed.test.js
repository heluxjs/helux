import { defLazyComputed } from '../../src/index';


describe('test top api defLazyComputed', () => {
  test('should be a function', () => {
    expect(defLazyComputed).toBeInstanceOf(Function);
  });


  test('should return a computed fn desc', () => {
    const cuFnDesc = defLazyComputed(() => {
      return 'this is a lazy computed';
    });
    expect(cuFnDesc.fn).toBeInstanceOf(Function);
    expect(cuFnDesc.lazy).toBe(true);
  });
});
