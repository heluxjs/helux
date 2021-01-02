
import registerDumb from './register-dumb';

export default function (connectSpec, ccClassKey) {
  const connect = connectSpec || [];
  return registerDumb({ connect }, ccClassKey);
}
