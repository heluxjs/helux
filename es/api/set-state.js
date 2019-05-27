import setState from '../core/state/set-state';

function throwApiCallError() {
  throw new Error("api doc: cc.setState(module:string, state:Object, lazyMs?:Number, throwError?:Boolean)");
}

export default function (module, state, lazyMs, throwError) {
  if (lazyMs === void 0) {
    lazyMs = -1;
  }

  if (throwError === void 0) {
    throwError = false;
  }

  if (module === undefined && state === undefined) {
    throwApiCallError();
  }

  if (typeof module !== 'string') {
    throwApiCallError();
  }

  setState(module, state, lazyMs, throwError);
}
;