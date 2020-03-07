import { START } from '../../support/priv-constant';
import makeObState from '../state/make-ob-state';


export default function (ref) {
  const ctx = ref.ctx;
  ctx.__$$renderStatus = START;
  if(ctx.watchedKeys === '-' && ctx.__$$hasModuleState){
    ref.state = makeObState(ref, ref.state);
    ctx.state=  ref.state;
  }
}