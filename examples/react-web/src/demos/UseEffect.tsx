import { useEffect } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from './comps';
import { log, logRed } from './logic/util';

function Comp() {
  useEffect(() => {
    log('helux.useEffect', 'print one time at strict mode');
    return () => log('helux.useEffect', 'cleanup');
  }, []);
  React.useEffect(() => {
    logRed('React.useEffect', 'print 2 times at strict mode');
    return () => logRed('React.useEffect', 'cleanup');
  }, []);
  return (
    <MarkUpdate>
      test useEffect
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry>
    <Comp />
  </Entry>
);

export default Demo;
