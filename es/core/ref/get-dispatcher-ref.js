import { CC_DISPATCHER, ERR } from '../../support/constant';
import ccContext from '../../cc-context';
import util from '../../support/util';

const { ccKey_ref_ } = ccContext;
export default function(){
  const ref = ccKey_ref_[CC_DISPATCHER];
  if (!ref) {
    if(util.isHotReloadMode()){
      util.justTip('in hot reload mode, CC_DISPATCHER initialized more than one time');
    }else{
      throw util.makeError(ERR.CC_NO_DISPATCHER_FOUND);
    }
  }
  return ref;
}