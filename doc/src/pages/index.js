import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import MdViewer from '@site/src/components/MdViewer';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';
import styles from './index.module.css';
// import MdViewer from '@site/src/components/MonacoEditor';
import * as demoCode from '@site/src/components/demoCode';

// prism-react-renderer
// @uiw/react-markdown-preview

// 关闭语法验证，避免code示例里写 @ts-nocheck
// see https://github.com/microsoft/monaco-editor/issues/264
// monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
//   noSemanticValidation: true,
//   noSyntaxValidation: true, // This line disables errors in jsx tags like <div>, etc.
// });

function RadioBtn(props) {
  return (
    <label>
      <input checked={props.checked} name="demo" type="radio" value={props.value} onClick={props.onClick} />
      {props.children}
    </label>
  );
}

function DemoArea() {
  const [demoType, setDemoType] = React.useState('remoteLib');
  const clickRadio = (e) => {
    setDemoType(e.target.value);
  };
  const checkedMap = {};
  ['remoteLib', 'remoteLibLazy', 'remoteReact', 'remoteVue'].forEach((item) => {
    checkedMap[item] = item === demoType;
  });

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '780px', margin: '0 auto' }}>
        <RadioBtn checked={checkedMap['remoteLib']} value="remoteLib" onClick={clickRadio}>
          远程库-预加载{' '}
          <a href="https://codesandbox.io/s/hel-lodash-zf8jh8?file=/src/App.js:183-225" target="blank">
            线上预览
          </a>
        </RadioBtn>
        <RadioBtn checked={checkedMap['remoteLibLazy']} value="remoteLibLazy" onClick={clickRadio}>
          远程库-懒加载
        </RadioBtn>
        <RadioBtn checked={checkedMap['remoteReact']} value="remoteReact" onClick={clickRadio}>
          远程react组件{' '}
          <a href="https://codesandbox.io/s/demo-load-remote-react-comp-2bnpl0" target="blank">
            线上预览
          </a>
        </RadioBtn>
        <RadioBtn checked={checkedMap['remoteVue']} value="remoteVue" onClick={clickRadio}>
          远程vue组件{' '}
          <a href="https://codesandbox.io/s/demo-load-remote-vue-comp-st0295" target="blank">
            线上预览
          </a>
        </RadioBtn>
      </div>
      <MdViewer value={demoCode[demoType]} />
    </div>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header
      className={clsx('hero hero--primary', styles.heroBanner)}
      style={{ backgroundImage: 'url(https://tnfe.gtimg.com/image/eai2tlcqqm_1641021424949.jpg)', height: '400px' }}
    >
      <div className="container">
        <h1 className="hero__title" style={{ fontSize: '88px', fontWeight: 600 }}>
          {siteConfig.title}
        </h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/tutorial/intro">
            快速开始 - 1 min ⏱️
          </Link>
          <div style={{ display: 'inline-block', width: '28px' }}></div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description="A development solution of frontend dynamic micro component">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <DemoArea />
      </main>
      <span style={{ display: 'none' }}>for index cache expried at 2023-05-31</span>
    </Layout>
  );
}
