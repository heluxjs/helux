import React, { type FC } from 'react';
import { SimplePlayground } from '../../../../docs/playground/demos/Playground';
import { Features } from './Features';


const imgs = [
  'https://tnfe.gtimg.com/image/harzqyxcgz_1651755973579.png',
  'https://tnfe.gtimg.com/image/p40w0k40pt_1651755965504.png',
  'https://tnfe.gtimg.com/image/fxy2nbeh43_1651755969439.png',
  'https://tnfe.gtimg.com/image/bxzj46o32k_1651755962175.png',
  'https://tnfe.gtimg.com/image/ngex07gcez_1651755956158.png',
  'https://tnfe.gtimg.com/image/harzqyxcgz_1651755973579.png',
];
function getImg(idx: number) {
  return imgs[idx] || imgs[0];
}
const featureList = [
  {
    title: 'atom',
    description: 'atom 支持任意数据结构，对非原始类型数据内置依赖收集功能， 意味着 atom 不用拆分的很细，天然对 DDD 领域驱动设计友好',
  },
  {
    title: 'signal',
    description: '内置 signal 响应机制，可实现 0 hook 编码 + dom 粒度的更新',
  },
  {
    title: '依赖追踪',
    description: '基于最快的不可变 js 库 limu 做到运行时对视图渲染实时收集数据依赖，提供超强渲染性能',
  },
  {
    title: 'reactive',
    description: '提供全局响应式对象，数据变更直接驱动关联ui渲染（默认在下一个事件循环微任务开始前提交，支持人工提交变更数据）',
  },
  {
    title: 'modular',
    description: '支持对状态模块化抽象，并内置 actions、derive、watch、loading 等特性，轻松驾驭大型前端应用架构',
  },
  {
    title: 'middleware&plugin',
    description: '内置中间件和插件系统，无缝衔接redux生态优秀组件',
  },
];
featureList.forEach((v: any, idx: number) => v.imgSrc = getImg(idx));

const ContactAuthor: FC = () => (
  <div style={{ width: '100%' }}>
    <SimplePlayground />
    <Features featureList={featureList} />
    <div style={{ width: '48%', display: 'inline-block' }}>
      <h4>📦 了解更多</h4>
      <p>
        欢迎入群了解更多，由于微信讨论群号 200 人已满，需加作者微信号或 qq 群号，再邀请你如helux & hel讨论群（加号时记得备注 helux 或 hel）
      </p>
      <img src="https://tnfe.gtimg.com/image/7fz74bhk84_1705216873301.png" style={{ width: '100%' }} />
    </div>
    <div style={{ width: '4%', display: 'inline-block' }}></div>
    <div style={{ width: '48%', display: 'inline-block' }}>
      <h4>❤️‍🔥 赞赏</h4>
      <p>
        小小鼓励，给予我们更多力量坚持做出更好的开源项目
      </p>
      <img src="https://tnfe.gtimg.com/image/5a2u6arzpo_1705217036205.png" style={{ width: '100%' }} />
    </div>
  </div>
);

export default React.memo(ContactAuthor);
