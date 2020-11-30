import * as util from '../support/util';
import pickOneRef from '../core/ref/pick-one-ref';

export default function (event, ...args) {
  if (event === undefined) {
    throw new Error(`api doc: cc.emit(event:string|{name:string, identity?:string, ctx?:boolean}, ...args)`);
  }

  try {
    const ref = pickOneRef();
    ref.ctx.emit(event, ...args);
  } catch (err) {
    util.justWarning(err);
  }
}
