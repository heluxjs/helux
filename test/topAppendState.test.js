import { run, appendState, getState, setState } from '../src/index';
import { has } from './util';

const models = {
  test: {
    key1: 'key1',
    key2: 'key2',
  }
};

describe('test top api appendState', () => {
  let testState;

  beforeAll(() => {
    run(models, { logError: false });
    testState = getState('test');
  });


  test('appendState should be a function', async () => {
    expect(appendState).toBeInstanceOf(Function);
  });


  test('pass am non-existed module name to appendState should throw error', async () => {
    try {
      appendState('non-existed', { key5: 'key5' });
    } catch (err) {
      expect(err.message).toMatch(/(?=module\[non-existed\] not configured)/);
    }
  });

  test('appendState should change module state shape', async () => {
    expect(!has(testState, 'key3')).toBeTruthy();
    appendState('test', { key3: 'key3' });
    expect(has(testState, 'key3')).toBeTruthy();

    expect(!has(testState, 'key4')).toBeTruthy();
    appendState('test', { key4: 'key4' });
    expect(has(testState, 'key4')).toBeTruthy();
  });


  test('setState should work after appending a new state', async () => {
    setState('test', { key5: 'key5' });
    expect(!has(testState, 'key5')).toBeTruthy();
    appendState('test', { key5: 'key5' });
    setState('test', { key5: 'key5' });
    expect(has(testState, 'key5')).toBeTruthy();
  });
});
