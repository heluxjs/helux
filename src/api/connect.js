
import register from './register';

export default function (connectSpec, ccClassKey) {
  const connect = connectSpec || [];
  return register({ connect }, ccClassKey);
}
