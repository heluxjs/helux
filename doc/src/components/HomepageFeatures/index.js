import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '模块联邦sdk化',
    imageUrl: 'https://tnfe.gtimg.com/image/harzqyxcgz_1651755973579.png',
    // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: <div style={{ textAlign: 'left' }}>通过规范打包协议实现模块联邦sdk化. 和模块使用方工具链无关</div>,
  },
  {
    title: '免构建、热更新',
    imageUrl: 'https://tnfe.gtimg.com/image/p40w0k40pt_1651755965504.png',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: <div style={{ textAlign: 'left' }}>通过sdk导入远程模块，让项目公共依赖立刻享受免构建、热更新的巨大优势.</div>,
  },
  {
    title: '跨项目共享模块简单',
    imageUrl: 'https://tnfe.gtimg.com/image/fxy2nbeh43_1651755969439.png',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: <div style={{ textAlign: 'left' }}>通过sdk接口，开发者即可提升项目内部模块为多个项目的远程共享模块</div>,
  },
  {
    title: '远程模块导入方式灵活',
    imageUrl: 'https://tnfe.gtimg.com/image/bxzj46o32k_1651755962175.png',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: <div style={{ textAlign: 'left' }}>既可以在使用时按需动态导入，也可以在文件头使用 import 语法静态导入.</div>,
  },
  {
    title: '开发体验友好',
    imageUrl: 'https://tnfe.gtimg.com/image/ngex07gcez_1651755956158.png',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <div style={{ textAlign: 'left' }}>
        基于源码与运行时代码分离式托管机制，IDE与远程模块的开发交互体验（智能提示、源码查看...）与本地模块保持100%一致
      </div>
    ),
  },
  {
    title: 'npm生态集成',
    imageUrl: 'https://tnfe.gtimg.com/image/harzqyxcgz_1651755973579.png',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <div style={{ textAlign: 'left' }}>
        通过npm的unpkg服务即可加载远程包体，后续会提供Hel
        Pack管理台联动腾讯蓝鲸与工蜂做远程模块版本化管理，提供秒级回滚、灰度发布、提交记录回溯等贴心功能。
      </div>
    ),
  },
];

function Feature({ Svg, imageUrl, title, description }) {
  console.log('imageUrl', imageUrl);
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {imageUrl ? (
          <img src={imageUrl} width="88px" style={{ marginBottom: '12px' }}></img>
        ) : (
          <Svg className={styles.featureSvg} role="img" />
        )}
        {/* <Svg className={styles.featureSvg} role="img" /> */}
      </div>
      <div className="text--center padding-horiz--md">
        <h3 style={{ color: '#ad4e00' }}>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
