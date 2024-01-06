---
sidebar_position: 4
---

# 模块发布

js 库、react 组件、vue 组件等发布流程均一样，差异在于`appInfo.js`文件的位置不同，js 库、react 组件的`appInfo.js`文件在`<rootProject>/configs`目录下，js 库、vue 组件的`appInfo.js`文件在`<rootProject>`目录下

## 发布到 unpkg

### 调整 appInfo 文件

打开根目录`appInfo.js`文件，调整文件内容如下（默认是托管到 unpkg）

```ts
const helDevUtils = require('hel-dev-utils');
const pkg = require('./package.json');

const subApp = helDevUtils.createVue2SubApp(pkg, { npmCdnType: 'unpkg' });

module.exports = subApp;
```

### 调整版本号

调整模块版本号，即`package.json`里`version`字段值

```js title="docusaurus.config.js"
{
  // 略 ...
   // highlight-start
  "version": "1.1.3",
   // highlight-end
}
```

### 执行推送命令

执行以下脚本命令，既会触发源码发布到`npm`，也会触发运行时代码发布到`unpkg`

```bash
npm run build
npm publish
```

发布后`unpkg`服务可能会有十几秒的生效延迟时间，可在浏览器按以下语法格式访问最新版本的`hel-meta`元数据版本号是否和`package.json`的`version`字段保持一致，如果一致即表示运行代码文件已成功到`unpkg` cdn 服务

```
https://unpkg.com/<appGroupName>@latest/hel_dist/hel-meta.json
```

例如 [https://unpkg.com/hel-tpl-remote-vue-comps@latest/hel_dist/hel-meta.json](https://unpkg.com/hel-tpl-remote-vue-comps@latest/hel_dist/hel-meta.json)

:::caution 注意命令执行顺序

注意命令执行顺序，必须先调整版本号，再执行 build & publish

:::

### sdk 获取该版本代码

效果见[线上示例](https://codesandbox.io/s/demo-load-remote-vue-comp-st0295?file=/src/main.js:0-577)

```ts
import { preFetchLib } from 'hel-micro';

async function main() {
  await preFetchLib('hel-tpl-remote-vue-comps', '1.1.3');
  // 不指定版本，默认获取 latest
  // await preFetchLib("hel-tpl-remote-vue-comps");
  await import('./loadApp');
}
```

## 发布到自定义文件服务

### 调整 subApp 文件

打开跟目录`subApp.js`，调整文件内容如下

> 此处以`github.io`托管为例，用户可传入自己的**文件服务托管路径**，以下示例代码见[仓库](https://github.com/hel-eco/hel-tpl-remote-vue-comp)

```ts
const helDevUtils = require('hel-dev-utils');
const pkg = require('./package.json');

// deploy to github.io
const subApp = helDevUtils.createVue2SubApp(pkg, { homePage: 'https://hel-eco.github.io/hel-tpl-remote-vue-comp/as_v1' });

module.exports = subApp;
```

此处可请求到这个地址的包体的代码如下（[线上示例](https://codesandbox.io/s/demo-load-remote-vue-comp-st0295)）

```ts
await preFetchLib('hel-tpl-remote-vue-comps', {
  async getSubAppAndItsVersionFn() {
    const res = await fetch('https://hel-eco.github.io/hel-tpl-remote-vue-comp/as_v1/hel-meta.json');
    const meta = await res.json(); // 拿到指定部署地址的 meta 描述
    return meta;
  },
});
```

### 生成运行代码

构建生成源码和运行时代码

```bash
npm run build
```

### 推送运行代码到文件服务

---

:::caution

**此段有上下横向分割的内容仅代表如何将组件托管到 github.io 文件服务**，用户可将文件托管托管到自己的文件服务

:::

设定 github pages 目录为 `/docs`，然后可划分子目录同时多个版本的组件，此处我们建议一个`/docs/as_v1`目录表示放置第一个版本的运行代码

拷贝`hel_dist`目录下到的所有产物到`/docs`目录下，方便访问`github.io`展示时展示默认首页，同时再拷贝产物到`/docs/as_v1`目录下，方便 sdk 可以指定版本号获取托管代码

执行`git push`，将产物推送到`github.io`服务

---

移除`package.json`里的`unpkg`字段描述，表示不将产物托管到`unpkg`服务

移除`package.json`里的`files`字段里的`hel_dist`关键字，表示不将产物推到`npm`（即安装模块方的 node_modules 里不会包含此目录）

执行`git push`推送运行代码

> git add、git commit 等此处省略，用户安装正常操作推送代码即可

### 推送源码到 npm

```bash
npm run publish
```

### sdk 获取该版本代码

效果见[线上示例](https://codesandbox.io/s/demo-load-remote-vue-comp-st0295?file=/src/main.js:0-577)，需通过传入`getSubAppAndItsVersionFn`函数来自定义元数据获取请求

```ts
import { preFetchLib } from 'hel-micro';

async function main() {
  await preFetchLib('hel-tpl-remote-vue-comps', {
    async getSubAppAndItsVersionFn() {
      // 自定义元数据获取请求
      const res = await fetch('https://hel-eco.github.io/hel-tpl-remote-vue-comp/as_v1/hel-meta.json');
      const meta = await res.json();
      return meta;
    },
  });

  await import('./loadApp');
}
```

### 管控台搭建(可选项)

:::tip

用户可将`hel-meta.json`保存到后台数据库（可结合 devops 流水线），以便搭一个中心化的模块管控平台，对模块实施**版本预览**、**灰度放量**、**秒级回滚**等工作

:::

![hel pack](https://tnfe.gtimg.com/image/f13q7cuzxt_1652895450360.png)

其余文档正在拼命建设中，有疑问可联系 [fantasticsoul](https://github.com/fantasticsoul) 或提 [issue](https://github.com/tnfe/hel/issues) ....
