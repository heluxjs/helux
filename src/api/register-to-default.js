import register from './register';
import { MODULE_DEFAULT } from '../support/constant';

export default function (ccClassKey, option = {}) {
  if (!option.sharedStateKeys) option.sharedStateKeys = '*';
  option.module = MODULE_DEFAULT;
  return register(ccClassKey, option);
}