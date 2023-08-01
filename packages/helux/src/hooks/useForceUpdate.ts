import React from 'react';

export function useForceUpdate() {
  const [, setState] = React.useState({});
  return () => setState({});
}
