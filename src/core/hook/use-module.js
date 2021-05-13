/** @typedef {import('../../types').RegisteredModule} RegisteredModule */
import useModuleConn from './use-module-conn';

export default function (/** @type RegisteredModule*/belongModule, options = {}) {
  return useModuleConn(belongModule, [], options);
}
