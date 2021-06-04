/** @typedef {import('../../types').RegisteredModule} RegisteredModule */
import useModuleConn from './use-module-conn';

export default function (/** @type {RegisteredModule[]}*/connectModules, options = {}) {
  return useModuleConn(null, connectModules, options);
}
