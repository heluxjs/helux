// @ts-nocheck
import React from 'react';
import './index.less';
import * as codes from './codes';

const labelAlias: any = {
  atom: {
    dict_atomx: 'dict(atomx)',
    dict_sharex: 'dict(sharex)',
  },
  reactive: {
    dict_atomx: 'dict(atomx)',
  },
  useReactive: {
    primitive_atomx: 'primitive(atomx)',
  },
};

function getLabel(name: string, subName: string) {
  return labelAlias[name]?.[subName] || subName;
}

function renderItems(name: string, subName: string) {
  const st = (toMatch: string) => subName === toMatch
    ? { backgroundColor: 'rgb(100, 90, 183)', color: '#fff' }
    : { backgroundColor: '', color: 'rgb(100, 90, 183)' };

  const codeDict: any = codes;
  const subDict = codeDict[name] || {};
  return Object.keys(subDict).map(key => (
    <div key={key} className="topBarItem" data-name={key} style={st(key)}>{getLabel(name, key)}</div>
  ));
}

export default React.memo(({ onClick, name, subName }: any) => {
  const handleClick = e => {
    const subName = e.target.dataset.name;
    if (subName) {
      onClick?.(subName);
    }
  };

  return (
    <div className="topBar" onClick={handleClick}>
      <span className='samples'>{renderItems(name, subName)}</span>
    </div>
  );
});
