import setState from '../core/state/set-state';

function throwApiCallError(){
  throw new Error(`api doc: cc.setState(module:string, state:object, renderKey:string | string[], delayMs?:number, skipMiddleware?:boolean, throwError?:boolean)`);
}

export default function (module, state, renderKey, delayMs = -1, skipMiddleware, throwError = false) {
  if (module === undefined && state === undefined) {
    throwApiCallError();
  }
  if(typeof module !== 'string'){
    throwApiCallError();
  }
  setState(module, state, renderKey, delayMs, skipMiddleware, throwError);
}