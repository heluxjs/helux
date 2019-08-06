
import registerDumb from './register-dumb';

export default function (connectSpec, ccClassKey) {
  return registerDumb({ connect: connectSpec }, ccClassKey);
}

