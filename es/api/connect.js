
import register from './register';

export default function (connectSpec, ccClassKey) {
  return register({ connect: connectSpec }, ccClassKey);
}

