import util from '../support/util';
import pickOneRef from '../core/ref/pick-one-ref';
export default function (event) {
  if (event === undefined) {
    throw new Error("api doc: cc.emit(event:String, ...args)");
  }

  try {
    var ref = pickOneRef();

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    ref.$$emit.apply(ref, [event].concat(args));
  } catch (err) {
    util.justWarning(err.message);
  }
}