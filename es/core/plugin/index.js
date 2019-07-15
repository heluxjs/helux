import ccContext from '../../cc-context';

export function send(sig, payload) {
  const plugins = ccContext.plugins;
  plugins.forEach(p => {
    if (p.receive) p.receive(sig, payload);
  });
}
