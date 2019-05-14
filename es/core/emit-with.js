import util from '../support/util';
import pickOneRef from './helper/pick-one-ref';

export default function (event, option, ...args) {
  if (event === undefined) {
    throw new Error(`api doc: cc.emitWith(event:string, option:{module?:string, ccClassKey?:string, identity?:string} ...args)`);
  }

  try {
    const ref = pickOneRef();
    ref.$$emitWith(event, option, ...args);
  } catch (err) {
    if (option.throwError) throw err;
    else util.justWarning(err.message);
  }
}