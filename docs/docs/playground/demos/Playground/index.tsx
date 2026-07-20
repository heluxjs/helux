import React, { useCallback, useEffect } from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import copyTo from 'copy-to-clipboard';
import qs from "qs";
import * as prism from 'prism-react-renderer';
import * as helux from 'helux';
import { useWatch } from 'helux';
import localforage from 'localforage';
// TODO toast 无效
// import { toast } from 'react-toastify';

import ApiMenus from './ApiMenus';
import TopBar from './TopBar';
import Console from './Console';
import * as codes from './codes';
import './index.less';
import { Tools } from './Tools';
import { setCodeContext, codeContext } from './codeContext';

function getCode(name: any, subName: any) {
  const codeDict: any = codes;
  return codeDict[name]?.[subName] || '';
}

const scope = { helux, React, ...helux };
const subNames: Record<string, string> = {
  quickStart: 'HelloHelux',
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

let timer: any;

function useLogic(name = 'atom', subName = 'primitive') {
  const [info, setInfo] = React.useState({ name, subName });
  const [code, setCode] = React.useState(initCode);
  const [mode, setMode] = React.useState('live'); // live lag manual
  const [compKey, setCompKey] = React.useState(Date.now());
  const codeCacheRef = React.useRef(code);

  const clickRun = () => {
    setCode(codeCacheRef.current);
    setCompKey(Date.now());
  };
  const onControlClick = (mode: string) => {
    setMode(mode);
  };
  const copyUrl = () => {
    const url = `${window.location.origin}?n=${info.name}&s=${info.subName}`;
    copyTo(url);
    console.log('复制当前示例分享链接成功', url);
  };
  const saveCode = () => {
    localforage.setItem(`helux_code_${info.name}_${info.subName}`, codeCacheRef.current, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log('保存成功');
    });
  };
  const changeEditorCode = (value: string) => {
    codeCacheRef.current = value;
    setCode(value);
    setCompKey(Date.now());
  };
  const recoverCode = () => {
    localforage.getItem(`helux_code_${info.name}_${info.subName}`, (err, value: string | null) => {
      if (err) {
        return alert(err.message);
      }
      if (!value) {
        return alert('无最近保存的代码可恢复');
      }
      changeEditorCode(value);
    });
  };
  const resetCode = () => {
    changeEditorCode(getCode(info.name, info.subName));
    console.log('重置示例代码成功');
  };

  useEffect(() => {
    loadCode(name, subName, setCode);
  }, []);

  useWatch(() => {
    const curCode = codeContext.code;
    if (curCode.trim().length === 0) {
      loadCode(name, subName, setCode);
    }
  }, () => [codeContext.code]);

  const changeCode = useCallback((name: string) => {
    const subName = cachedSubNames[name] || subNames[name] || 'primitive';
    setCodeContext(draft => { draft.key = `${name}_${subName}` });
    setInfo({ name, subName });
    loadCode(name, subName, setCode);
  }, [info.name, info.subName]);

  const changeSubName = useCallback((subName: string) => {
    const { name } = info;
    cachedSubNames[name] = subName;
    setCodeContext(draft => {
      draft.key = `${name}_${subName}`;
    });

    setInfo({ name, subName });
    loadCode(name, subName, setCode);
  }, [info.name, info.subName]);

  const onEditorCodeChange = (value: string) => {
    if (mode !== 'lag') {
      // 是手动，仅保存代码
      codeCacheRef.current = value;
      return;
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      changeEditorCode(value);
    }, 1000);
  };

  return {
    info, code, changeCode, changeSubName, onControlClick, mode, compKey, clickRun,
    onEditorCodeChange, copyUrl, saveCode, resetCode, recoverCode, changeEditorCode,
  };
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
  const {
    info, code, changeCode, changeSubName, onControlClick, mode, clickRun, compKey,
    onEditorCodeChange, copyUrl, saveCode, resetCode, recoverCode,
  } = useLogic(name, subName);

  return (
    <LiveProvider key={compKey} noInline={true} code={code} scope={scope} theme={prism.themes.vsDark}>
      <div className="playground-wrap">
        <div className="leftMenuWrap">
          <ApiMenus onClick={changeCode} name={info.name} />
        </div>
        <div style={{ width: 'calc(100% - 120px)', display: 'inline-block' }}>
          <TopBar onClick={changeSubName} name={info.name} subName={info.subName} />
          <div style={{ display: "flex", height: '100%', padding: '0 2px' }}>
            <div style={{ flex: "1 1 0px", height: '100%' }}>
              {mode === 'live' && <LiveEditor style={{ flexGrow: 1 }} />}
              {mode !== 'live' && <LiveEditor style={{ flexGrow: 1 }} onChange={onEditorCodeChange} />}
              <Tools
                onRunClick={clickRun}
                onControlClick={onControlClick}
                copyUrl={copyUrl}
                mode={mode}
                saveCode={saveCode}
                resetCode={resetCode}
                recoverCode={recoverCode}
              />
            </div>
            <div style={{ flex: "1 1 0px", height: 'calc(100vh - 118px)' }}>
              <div style={{ height: '50%', padding: '12px', boxSizing: 'border-box', border: '1px solid #e8ae56' }}>
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
};
