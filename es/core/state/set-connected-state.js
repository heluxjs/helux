import util from '../../support/util';
export default function (connectedState, module, key, value) {
  var moduleConnState = util.safeGetObjectFromObject(connectedState, module);
  moduleConnState[key] = value;
}