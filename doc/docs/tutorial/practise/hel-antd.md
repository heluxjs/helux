---
sidebar_position: 2
---

# 制作远程 antd、tdesign-react

使用 hel-micro 模块联邦技术 sdk 化方案，基于[react 组件模板](https://github.com/hel-eco/hel-tpl-remote-react-comp-ts)制作远程[antd](https://ant.design/components/overview-cn/)库（[hel-antd](https://github.com/hel-eco/hel-antd)）、远程[tdesign-react](https://tdesign.tencent.com/react/overview)库（[hel-tdesign-react](https://github.com/hel-eco/hel-tdesign-react)）。

> hel-antd、hel-tdesign-react 两者制作过程完全一样，区别仅是安装的库不同，你可以参考此文将其他优秀的`react`图形组件库制作为对应的远程库，以下步骤以制作 hel-antd 为主。

:::tip 收益

基于 hel-micro 提升为远程库后，被其他项目使用时，实际运行逻辑不参与项目打包，可以做到使用方无感知动态升级（顺带也降低了项目打包体积，并提高编译速度），以 antd 为例，假如你有 5 个项目用到了 antd2.20，某一天暴露出 2.20 存在了一个严重 bug，官方升级到了 2.21 版本，这时候你需要把你的 5 个项目全部安装一下最新的 antd 版本并重新部署一遍，而如果是引用的 hel-antd，就只需要基于 2.21 版本重新发布一下 hel-antd 即可，所有使用方就可以运行最新版本的 antd 了。

:::

未使用 hel-micro 微模块时： ![image](https://user-images.githubusercontent.com/7334950/193722341-862c3339-f511-4f36-a90e-0d22ea582d2e.png)

使用 hel-micro 微模块后： ![image](https://user-images.githubusercontent.com/7334950/193722404-c6b32837-a746-4083-b46f-039aa9f4659e.png)

## 克隆 react 模板库

克隆 react 模板库，保存为`hel-antd`目录，接下来的步骤里，我们都将基于此目录下的文件改造

```bash
npx degit https://github.com/hel-eco/hel-tpl-remote-react-comp-ts.git hel-antd
```

## 修改模块名称

- 修改`package.json`里的模块名称为`hel-antd`

```diff
- "name": "hel-tpl-remote-react-comps-ts",
- "appGroupName": "hel-tpl-remote-react-comps-ts",
+ "name": "hel-antd",
+ "appGroupName": "hel-antd",
```

- 修改项目里 `src/configs/subApp.ts` 的 `LIB_NAME` 为 `hel-antd`（如不修改，构建时会报模块名不一致错误）

```diff
- export const LIB_NAME = 'hel-tpl-remote-react-comps-ts';
+ export const LIB_NAME = 'hel-antd';
```

> 可根据需要修改为自己想要的命名，此处仅为示例

## 安装 antd

此处我们基于`4.23.4`版本的 antd 构建远程 antd 库

```bash
npm i antd@4.23.4
```

## 导出 antd 模块

导出 antd 模块主要包含 2 个部分，

- 导出**运行时代码**供`webpack`打包用，方便`hel-micro`可以动态拉取已构建的运行代码
- 导出**代理对象**供`rollup`打包用，方便使用方可以安装远程模块类型文件，并在文件头使用`import`静态导入远程模块

### 运行时代码导出

我们先在`src/components`下导出我们想要暴露的远程组件

```diff
- import HelloRemoteReactComp from './HelloRemoteReactComp';
- export {
-   HelloRemoteReactComp,
- }

+ import * as antd from 'antd';
+ export { default as TestExport } from './TestExport';
+ export default antd;
```

注意此处额外导出了一个`TestExport`组件，用于示范可以扩展原始`antd`库加入自己的新组件

```jsx
function TestExport() {
  return <span>TestExport Component</span>;
}
TestExport.displayName = 'TestExport';
export default TestExport;
```

然后在`src/entrance/libProperties.ts`里合并导出模块（此合并逻辑也可在`src/components`里面处理），并同时暴露推导出的模块类型对象

```diff
- import comps from 'components';
- export type LibProperties = typeof comps;
- export default comps;

+ import antd, { TestExport } from 'components';
+ const toExport = { ...antd, TestExport };
+ export type LibProperties = typeof toExport;
+ export default toExport;
```

### 代理对象导出

`src/entrance/libTypes.ts`文件内容表示导出代理对象，对象的实际内容由使用方`hel-micro`模块的`preFetchLib`函数填充，如下面的一行也不修改也是没问题的

```ts
import type { LibProperties } from './libProperties';
import { exposeLib } from 'hel-lib-proxy';
import { LIB_NAME } from 'configs/subApp';

export const lib = exposeLib<LibProperties>(LIB_NAME);
export type Lib = LibProperties;
export default lib;
```

但使用方只能使用 default 导出语法，而不能在文件头直接解构

```ts
// ok
import antd from 'hel-antd';
const { Button } = antd;

// error
import { Button } from 'hel-antd';
```

为了支持文件头直接解构的写法，我们需要调整`src/entrance/libTypes.ts`文件内容，单独导出`antd`的各个组件

```diff
// 以下单个导出，支持 import { Button } from 'hel-antd'; 直接解构的语法
+ export const Affix = lib.Affix;
+ export const Alert = lib.Alert;
+ //...其他略
```

## 引入样式文件

在`src/index.ts`文件里导入 antd 的样式文件，因 hel-antd 支持使用 css 变量自定义主题，所以导入的时调整后的样式文件（将原始 css 文件的关键颜色替换为 css 变量）

```diff
import { libReady, isMasterApp } from 'hel-lib-proxy';
import { LIB_NAME } from './configs/subApp';
+ import './styles/theme.css';
+ import './styles/antd-style.css';
```

如不需要此功能，直接导入原始样式文件即可

```diff
import { libReady, isMasterApp } from 'hel-lib-proxy';
import { LIB_NAME } from './configs/subApp';
+ import 'antd/dist/antd.css'
```

## 打包与发布

修改`package.json`里的`version`版本号为`1.0.0`，运行 build 命令打包

```bash
npm run build
```

运行 publish 命令发布

```
npm publish
```

## 使用远程 antd

使用远程 antd 包括预加载远程模块和导入代理模块两个步骤

### 预加载远程模块

使用 npm 命令按照代理模块

```
npm i hel-antd
```

入口文件后移，绑定 react 公共对象，预加载`hel-antd`，让远程模块的实际运行代码通过`hel-micro`填充到代理模块里

```ts
import { preFetchLib, bindReactRuntime } from 'hel-micro';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactIs from 'react-is';

bindReactRuntime({ React, ReactDOM, ReactIs });

async function main() {
  // 预加载远程模块 ，例如 hel-antd
  await preFetchLib('hel-antd', { enableDiskCache: true });
  await import('./loadApp'); // 你的原始入口文件
}

main().catch(console.error);
```

### 导入代理模块

接下来你可以在项目里除**入口文件**之外的其他任意文件想导入本地模块一样导入远程模块并使用了。

```tsx
import { Button } from 'hel-antd';

// render antd  Button
<Button danger>remote antd button</Button>;
```

新窗口访问在线示例：[使用 hel-antd](https://codesandbox.io/s/hel-demo-use-antd-tjy3ep?file=/src/App.js:27-482) 、[使用 hel-tdesign-react](https://codesandbox.io/s/hel-demo-use-tedesign-nw8bfb?file=/src/App.js)

<iframe src="https://codesandbox.io/embed/hel-demo-use-antd-tjy3ep?file=/src/App.js:27-482" width="100%" height="600px"></iframe>

## 自定义 cdn

hel-micro 默认采用的是`unpkg`文件 cdn 服务，如有自建的`unpkg`私服，可调整打包策略注入自己的 cdn 服务前缀，只需要修改`config/subApp.js`即可

```diff
- const subApp = helDevUtils.createReactSubApp(pkg, { npmCdnType: 'unpkg' });
+ const subApp = helDevUtils.createReactSubApp(pkg, { npmCdnType: 'unpkg', homePage: 'http://my-unpkg.com' });
```

> 自建 npm+unpkg 私服可参考[issue 64](https://github.com/tnfe/hel/issues/64)
