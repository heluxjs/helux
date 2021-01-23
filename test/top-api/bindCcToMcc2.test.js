import { bindCcToMcc } from '../../src/index';

describe('test top api bindCcToMcc without window.mcc', () => {
  test('should throw error', () => {
    try {
      bindCcToMcc('demo');
    } catch (err) {
      expect(err.message).toMatch(/(?=current env is not multi concent ins mode)/);
    }
  });
});
