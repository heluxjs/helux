import { react } from '../react';

export function useForceUpdate() {
  const [, setState] = react.useState({});
  return () => setState({});
}
