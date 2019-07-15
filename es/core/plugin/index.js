import ccContext from '../../cc-context';
import { INVOKE } from '../../support/constant';

export function send(sig, payload) {
  const plugins = ccContext.plugins;
  if (payload.calledBy === INVOKE) return;

  plugins.forEach(p => {
    if (p.receive) p.receive(sig, payload);
  });
}
