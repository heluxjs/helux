
import { STR_ARR_OR_STAR } from '../../support/priv-constant';

export default function getRenderKeyClasses(ccClassKey, regRenderKeyClasses) {
  let _renderKeyClasses;
  
  if (!regRenderKeyClasses) {
    _renderKeyClasses = [ccClassKey];
  } else {
    if (!Array.isArray(regRenderKeyClasses) && regRenderKeyClasses !== '*') {
      throw new Error(`renderKeyClasses type err, it ${STR_ARR_OR_STAR}`);
    }
    _renderKeyClasses = regRenderKeyClasses;
  }

  return _renderKeyClasses;
}
