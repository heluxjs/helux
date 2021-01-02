import { run, debugComputed, getComputed } from '../../src/index';
import { makeStoreConfig } from '../util';

const Foo = 'foo';
const models = makeStoreConfig(Foo);
run(models, { log: false });

describe('test top api debugComputed', () => {
  test('get one module cu result', () => {
    const normalCu = debugComputed(Foo);
    const withDefinePropertyCu = getComputed(Foo);
    expect(normalCu.name).toBe(withDefinePropertyCu.name);
  });

  test('pass no param', () => {
    const normalCu = debugComputed();
    const withDefinePropertyCu = getComputed();
    console.log(normalCu);
    console.log(withDefinePropertyCu);
    expect(Object.keys(normalCu).length).toBe(Object.keys(withDefinePropertyCu).length);
  });
});
