import { defComputedVal } from '../../src/index';


describe('test top api defComputedVal', () => {
  test('should be a function', () => {
    expect(defComputedVal).toBeInstanceOf(Function);
  });


  test('should return a computed fn desc', () => {
    const cuFnDesc = defComputedVal('static val');
    expect(cuFnDesc.fn()).toBe('static val');
    expect(cuFnDesc.depKeys.length).toBe(0);
  });
});
