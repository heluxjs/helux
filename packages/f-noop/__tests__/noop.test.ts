import * as noop from '../src';

describe('noop', () => {
  test('should hanv 12 fns', () => {
    expect(Object.keys(noop).length).toEqual(12);
  });

  test('makeNoopAny should return fn', () => {
    const noopCat = noop.makeNoopAny({ name: 'cat' });
    expect(noopCat).toBeInstanceOf(Function);
    expect(noopCat().name).toBe('cat');

    const noopZero = noop.makeNoopAny(0);
    expect(noopZero).toBeInstanceOf(Function);
    expect(noopZero()).toBe(0);
  });

  test('noopAny should return {}', () => {
    expect(noop.noopAny()).toMatchObject({});
  });

  test('noopNum should return 0', () => {
    expect(noop.noopNum()).toEqual(0);
  });

  test('noopStr should return 0 len str', () => {
    expect(noop.noopStr()).toEqual('');
  });

  test('noopObj should return {}', () => {
    expect(noop.noopObj()).toMatchObject({});
  });

  test('noopVoid should return undefined', () => {
    expect(noop.noopVoid()).toEqual(undefined);
  });

  test('noopAnyAsync should return {}', async () => {
    expect(noop.noopAnyAsync()).toMatchObject({});
  });

  test('noopNumAsync should return 0', async () => {
    const result = await noop.noopNumAsync();
    expect(result).toEqual(0);
  });

  test('noopStrAsync should return 0 len str', async () => {
    const result = await noop.noopStrAsync();
    expect(result).toEqual('');
  });

  test('noopObjAsync should return {}', async () => {
    const result = await noop.noopObjAsync();
    expect(result).toMatchObject({});
  });

  test('noopVoidAsync should return undefined', async () => {
    const result = await noop.noopVoidAsync();
    expect(result).toEqual(undefined);
  });

  test('makeNoopAnyAsync should return async function', async () => {
    const noopCat = noop.makeNoopAnyAsync({ name: 'cat' });
    expect(noopCat.constructor.name).toMatch('Function');
    const result = await noopCat();
    expect(result.name).toBe('cat');

    const noopZero = noop.makeNoopAnyAsync(0);
    expect(noopZero.constructor.name).toMatch('Function');
    const resultZero = await noopZero();
    expect(resultZero).toBe(0);
  });
});
