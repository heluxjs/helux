import setState from '../core/state/set-state';

function throwApiCallError(){
  throw new Error(`api doc: cc.setState(module:string, state:object, delayMs?:number, renderKey:string, skipMiddleware?:boolean, throwError?:boolean)`);
}

export default function (module, state, delayMs = -1, renderKey, skipMiddleware, throwError = false) {
  if (module === undefined && state === undefined) {
    throwApiCallError();
  }
  if(typeof module !== 'string'){
    throwApiCallError();
  }
  setState(module, state, delayMs, renderKey, skipMiddleware, throwError);
}