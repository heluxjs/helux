import React, { useCallback, useEffect } from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import qs from "qs";
import * as prism from 'prism-react-renderer';
import * as helux from 'helux';
import { useWatch } from 'helux';

import ApiMenus from './ApiMenus';
import TopBar from './TopBar';
import Console from './Console';
import * as codes from './codes';
import './index.less';
// import { Tools } from './Tools';
import { setCodeContext, codeContext } from './codeContext';
import localforage from 'localforage';

function getCode(name: any, subName: any) {
  const codeDict: any = codes;
  return codeDict[name]?.[subName] || '';
}

const scope = { helux, React, ...helux };
const subNames: Record<string, string> = {
  atom: 'primitive',
  derive: 'primitive',
  modular: 'defineActions',
};
const cachedSubNames: any = {};
const obj = qs.parse(window.location.search, { ignoreQueryPrefix: true });
const name: string = (obj.n || 'atom') as unknown as string;
const subName: string = (obj.s || 'primitive') as unknown as string;
const initCode = getCode(name, subName);
setCodeContext(draft => {
  draft.key = `${name}_${subName}`
})
function loadCode(name: any, subName: any, setCode: any) {
  localforage.getItem(`helux_code_${name}_${subName}`, (err: any, value: any) => {
    if (!err && typeof (value) === 'string' && value.trim().length > 0) {
      setCode(value);
    } else {
      setCode(getCode(name, subName));
    }
  })
}

function useLogic(name = 'atom', subName = 'primitive') {
  const [info, setInfo] = React.useState({ name, subName });
  const [code, setCode] = React.useState(initCode);

  useEffect(() => {
    loadCode(name, subName, setCode)
  }, [])

  useWatch(() => {
    const curCode = codeContext.code
    if (curCode.trim().length === 0) {
      loadCode(name, subName, setCode)
    }
  }, () => [codeContext.code])

  const changeCode = useCallback((name: string) => {
    const subName = cachedSubNames[name] || subNames[name] || 'primitive';
    setCodeContext(draft => { draft.key = `${name}_${subName}` })
    setInfo({ name, subName })
    loadCode(name, subName, setCode)
  }, [info.name, info.subName])

  const changeSubName = useCallback((subName: string) => {
    const { name } = info;
    cachedSubNames[name] = subName;
    setCodeContext(draft => {
      draft.key = `${name}_${subName}`;
    });

    setInfo({ name, subName });
    loadCode(name, subName, setCode);
  }, [info.name, info.subName]);

  return { info, code, changeCode, changeSubName };
}

export function SimplePlayground() {
  const { info, code, changeCode, changeSubName } = useLogic('quickStart', 'HelloHelux');

  return (
    <LiveProvider noInline={true} code={code} scope={scope} theme={prism.themes.vsDark}>
      <div className="simple-playground-wrap">
        <div className="leftMenuWrap">
          <ApiMenus onClick={changeCode} name={info.name} />
        </div>
        <div style={{ width: 'calc(100% - 120px)', display: 'inline-block' }}>
          <TopBar onClick={changeSubName} name={info.name} subName={info.subName} />
          <div style={{ display: "flex", height: '100%', paddingTop: '12px' }}>
            <div style={{ flex: "1 1 0px", height: '100%' }}>
              <LiveEditor style={{ flexGrow: 1 }} />
            </div>
            <div style={{ flex: "1 1 0px", height: '543px' }}>
              <div style={{ height: '90%', padding: '12px', boxSizing: 'border-box', border: '1px solid #e8ae56' }}>
                <LiveError className="liveErr" />
                <LivePreview />
              </div>
              <Console />
            </div>
          </div>
        </div>
      </div>
    </LiveProvider>
  );
}

export default () => {
  const { info, code, changeCode, changeSubName } = useLogic(name, subName);
  return (
    <LiveProvider noInline={true} code={code} scope={scope} theme={prism.themes.vsDark}>
      <div className="playground-wrap">
        <div style={{ display: "flex", height: '100%', padding: '12px 100px' }}>
          <ApiMenus onClick={changeCode} name={info.name} />
          <div style={{ flex: "1 1 0px", height: '100%' }}>
            <TopBar onClick={changeSubName} name={info.name} subName={info.subName} />
            {/* <LiveEditor style={{ flexGrow: 1 }} onChange={value => { setCodeContext(draft => { draft.code = value }) }} /> */}
            <LiveEditor style={{ flexGrow: 1 }} />
            {/* <Tools /> */}
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
