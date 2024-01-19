// @ts-nocheck
import React from 'react';
import './index.less';
import * as codes from './codes';
import localforage from 'localforage';
import {syncer ,atom,watch } from "helux"

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

const [options,setOptions,optionsCtx] = atom({
  autoSave:false,
})
const optionsSaveKey = "helux_playground_options"
watch(()=>{
  localforage.setItem(optionsSaveKey,JSON.stringify(options.val),(err,value)=>{
    console.log(err,value)
  })
},()=>[options])

localforage.getItem(optionsSaveKey,(err,value)=>{
  setOptions(opts=>{
    Object.assign(opts,JSON.parse(value))
  })
})

export default React.memo(({ onClick, name, subName }: any) => {

  const [options] = optionsCtx.useState();


  const handleClick = e => {
    const subName = e.target.dataset.name;
    if (subName) {
      onClick?.(subName);
    }
  };


  return (
    <div className="topBar" onClick={handleClick}>
      <span className='samples'>{renderItems(name, subName)}</span>
      <span className='tools'>
      <input type="checkbox" name="autoSave" value={options.autoSave} onChange={syncer(options).autoSave}/>自动保存

      </span>

    </div>
  );
});
