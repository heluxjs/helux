import util from '../../support/util'

export default function (propState, module, key, value) {
  const modulePropState = util.safeGetObjectFromObject(propState, module);
  modulePropState[key] = value;
}