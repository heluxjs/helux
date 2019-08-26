import * as util from '../../support/util'

export default function (connectedState, module, key, value) {
  const moduleConnState = util.safeGetObjectFromObject(connectedState, module);
  moduleConnState[key] = value;
}