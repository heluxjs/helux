// @ts-nocheck
import React from 'react';
import './index.less';
import * as codes from './codes';

const c = '#e8ae56';

const orderedKeys = [
  'quickStart',
  'atom',
  'derive',
  'watch',
  'reactive',
  'signal',
  'modular',
  'useAtom',
  'useDerived',
];

function noDupPush(list: string[], item: string) {
  if (!list.includes(item)) {
    list.push(item);
  }
}

function renderItems(name: string) {
  const st = (toMatch: string) => ({ color: name === toMatch ? c : '' });

  const codeDict: any = codes;
  const keys = orderedKeys.slice();
  Object.keys(codeDict).forEach(key => noDupPush(keys, key));
  return keys.map(key => (
    <div key={key} className="menuWrap" data-name={key} style={st(key)}>{key}</div>
  ));
}

export default React.memo(({ onClick, name }: any) => {
  const handleClick = e => {
    const name = e.target.dataset.name;
    if (name) {
      onClick?.(name);
    }
  };
  return (
    <div style={{ width: '120px' }} onClick={handleClick}>
      {renderItems(name)}
    </div>
  );
});
