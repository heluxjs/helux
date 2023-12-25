

import { useLocalForceUpdate } from 'helux';
import React from 'react';
import { Entry } from '../comps';

export function createDcDemo(dcLogic: any) {

  let DcDemo: any = null;
  function callDcLogic() {
    if (!DcDemo) {
      DcDemo = dcLogic();
    }
    return DcDemo;
  }

  function Empty() {
    return <h3>click triggerDc</h3>;
  }

  return function Demo(props: any) {
    const forceUpdate = useLocalForceUpdate();
    const demoRef = React.useRef<any>(Empty);
    const triggerDc = () => {
      demoRef.current = callDcLogic();
      forceUpdate();
    }

    return <Entry fns={[triggerDc]}>
      <demoRef.current />
    </Entry>
  }
}
