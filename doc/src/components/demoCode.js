/* eslint-disable no-multiple-empty-lines */

export const remoteLib = `
// Step1，入口文件后移，先预加载远程模块，再加载项目入口文件
import { preFetchLib } from "hel-micro";

async function main() {
  await preFetchLib("hel-lodash");
  await import("./loadApp"); // 入口文件后移
}

main().catch(console.error);

/** --------------------------------------------------------------------------- */

// Step2，预加载动作执行完毕后，可安全在项目内部任意文件的头部使用 import 语法静态导入远程模块
// 这个包的 js 入口文件是一个空壳文件，仅暴露了一个代理对象，实际执行代码已在 Step1 处拉取完毕
// 所以它并不会影响你的项目打包体积，同时因为模块主逻辑不参与构建，将提速你的项目构建速度
import m from "hel-lodash";

export function callRemoteMethod(){
  // 现在你可以像调用本地方法一样放心调用远程方法了，并可以获得完整的 IDE 提示！^_^
  const num = m.myUtils.num.random(500);
  return num;
}
`;

export const remoteLibLazy = `
import helMicro from 'hel-micro';

// 不关心类型且需要使用时才加载模块，使用 helMicro.preFetchLib 获取远程库即可
export async function callRemoteMethod(){
  const remoteLib = await helMicro.preFetchLib('hel-tpl-remote-lib');
  return remoteLib.num.random(19);
}

/** --------------------------------------------------------------------------- */
// 关心模块类型，且需要使用时才加载模块，安装模块并导出模块类型并传给泛型参数即可
import type { Lib } from 'hel-tpl-remote-lib';
import helMicro from 'hel-micro';

export async function  callRemoteMethod(){
  const remoteLib = await helMicro.preFetchLib<Lib>('hel-tpl-remote-lib');
  return remoteLib.num.random(19);
}
`;

export const remoteReact = `
// 这是一个由 hel-micro 从 HelPack 动态拉取的远程 react 组件
// 注：能这样头部静态import导入是因为入口文件处已执行预加载
import { HelloRemoteReactComp } from 'hel-tpl-remote-react-comps';

function Demo(){
  // 像本地组件一样使用远程组件吧
  return <HelloRemoteReactComp label="hi remote comp" />;
}

/** --------------------------------------------------------------------------- */

// 通过 hel-micro-react 异步加载远程组件并享有 shadow-dom 样式隔离能力
// hel-micro-react 是基于 hel-micro 做封装来适配 react 框架的适配层库
import { useRemoteComp } from 'hel-micro-react';

function ShadowDemo(){
  const Comp = useRemoteComp('hel-tpl-remote-react-comps', 'HelloRemoteReactComp');
  return <Comp  label="hi remote comp" />;
}
`;

export const remoteVue = `
<!-- 示例见项目 to be added -->
<template>
  <div class="app">
    <HelloRemoteVueComp label="hi remote comp" />
  </div>
</template>

<script>
// 这是一个由 hel-micro 从 HelPack 动态拉取的远程vue组件
// 注：能这样头部静态import导入是因为入口文件处已执行预加载
import { HelloRemoteVueComp } from 'hel-tpl-remote-vue-comps';

export default {
  name: 'App',
  components: { HelloRemoteVueComp } // 像本地组件一样使用远程组件把 ^_^
};
</script>
`;

export default {
  remoteLib,
  remoteLibLazy,
  remoteReact,
  remoteVue,
};
