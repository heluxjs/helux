/** @typedef {import('../../types').RegisteredModule} RegisteredModule */
import useConcent from './use-concent';
import { MODULE_DEFAULT } from '../../support/constant';

export default function (
  /** @type RegisteredModule*/belongModule,
  /** @type {RegisteredModule[]}*/connectModules,
  options = {},
) {
  const module = belongModule ? belongModule.__regModule__ : MODULE_DEFAULT;
  const connect = connectModules.map(item => item.__regModule__);
  const { ccClassKey, ...rest } = options;
  return useConcent({ ...rest, module, connect }, ccClassKey);
}
