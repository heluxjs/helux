import pickOneRef from '../core/ref/pick-one-ref';

export default function(moduledKeyPath, val, delay, idt){
  const dispatcher = pickOneRef();
  dispatcher.$$set(moduledKeyPath, val, delay, idt);
}