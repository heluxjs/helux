import './_prepareGlobal';
import { run } from '../../src/index';


describe('run in ssr mode', () => {
  test('should create window property for global', () => {
    run();
  });
});
