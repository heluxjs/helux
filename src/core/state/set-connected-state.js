import * as util from '../../support/util'

export default function (connectedState, module, key, value) {
  const moduleConnState = util.safeGetObject(connectedState, module);
  moduleConnState[key] = value;
}