import { defComputed } from '../../src/index';


describe('test top api defComputed', () => {
  test('should be a function', () => {
    expect(defComputed).toBeInstanceOf(Function);
  });


  test('should return a computed fn desc', () => {
    const cuFnDesc = defComputed(() => {
      return 'result';
    });
    expect(cuFnDesc.fn).toBeInstanceOf(Function);
  });
});
