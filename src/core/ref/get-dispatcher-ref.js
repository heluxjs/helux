import { permanentDispatcherRef } from '../../cc-context/internal-vars';

export default function () {
  return permanentDispatcherRef.value;
}
