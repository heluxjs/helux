import setState from '../core/state/set-state';

function throwApiCallError(){
  throw new Error(`api doc: cc.setState(module:string, state:Object, lazyMs?:Number, throwError?:Boolean)`);
}

export default function (module, state, lazyMs = -1, throwError = false) {
  if (module === undefined && state === undefined) {
    throwApiCallError();
  }
  if(typeof module !== 'string'){
    throwApiCallError();
  }
  setState(module, state, lazyMs, throwError);
};