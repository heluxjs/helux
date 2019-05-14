import util from '../support/util';
import pickOneRef from './helper/pick-one-ref';

export default function (event, ...args) {
  if (event === undefined) {
    throw new Error(`api doc: cc.emit(event:String, ...args)`);
  }

  try {
    const ref = pickOneRef();
    ref.$$emit(event, ...args);
  } catch (err) {
    util.justWarning(err.message)
  }
}