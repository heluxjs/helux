import React from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import * as prism from 'prism-react-renderer';
import * as helux from 'helux';
import ApiMenus from './ApiMenus';
import TopBar from './TopBar';
import Console from './Console';
import * as codes from './codes';
import './index.less';

const scope = { helux, React, ...helux };
const subNames: Record<string, string> = {
  atom: 'primitive',
  derive: 'primitive',
  modular: 'defineActions',
};
const cachedSubNames: Record<string, string> = {};

function getCode(name: string, subName: string) {
  const codeDict: any = codes;
  return codeDict[name]?.[subName] || '';
}

export default () => {
  const [info, setInfo] = React.useState({ name: 'atom', subName: 'primitive', code: getCode('atom', 'primitive'), });
  const changeCode = (name: string) => {
    const subName = cachedSubNames[name] || subNames[name] || 'primitive';
    setInfo({ name, subName, code: getCode(name, subName) });
  };
  const changeSubName = (subName: string) => {
    const { name } = info;
    cachedSubNames[name] = subName;
    setInfo({ name, subName, code: getCode(name, subName) });
  };

  return (
    <LiveProvider noInline={true} code={info.code} scope={scope} theme={prism.themes.vsDark}>
      <div className="playground-wrap">
        <div style={{ display: "flex", height: '100%', padding: '12px 100px' }}>
          <ApiMenus onClick={changeCode} name={info.name} />
          <div style={{ flex: "1 1 0px", height: '100%' }}>
            <TopBar onClick={changeSubName} name={info.name} subName={info.subName} />
            <LiveEditor style={{ height: '100%' }} />
          </div>
          <div style={{ flex: "1 1 0px", height: 'calc(100vh - 138px)' }}>
            {/* 空占位一个条 */}
            <div style={{ width: '200%', height: '28px' }}></div>
            <div style={{ height: '50%', padding: '12px', boxSizing: 'border-box', border: '1px solid #e8ae56' }}>
              <LiveError className="liveErr" />
              <LivePreview />
            </div>
            <Console />
          </div>
        </div>
      </div>
    </LiveProvider>
  );
};
