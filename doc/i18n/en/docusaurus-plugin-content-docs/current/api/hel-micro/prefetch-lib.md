---
sidebar_position: 1
---

# preFetchLib

`preFetchLib`负责拉取并返回远程模块，远程模块通过对接 `hel-lib-proxy` 包的 [exposeLib](https://www.to-be-added.com/coming-soon) 接口弹射出去。

:::tip 面向模块使用方

该接口由模块使用方直接调用，可以基于此接口进一步封装到其他依赖注入框架或体系里

:::

## 基本用法

### 指定模块名

通过指定模块名称拉取模块，默认总是拉取最新版本，如当前用户在灰度名单里，则返回灰度版本

```ts
const lib = await preFetchLib('hel-tpl-remote-lib');
// lib.xxx 此处可以调用模块任意方法
```

### 指定版本号

**参数名称**：`IPreFetchLibOptions.versionId`

通过指定模块名称、版本号拉取模块

```ts
const lib = await preFetchLib('hel-tpl-remote-lib', { versionId: '1.0.0' });
// or
const lib = await preFetchLib('hel-tpl-remote-lib', '1.0.0');
```

:::tip 未指定版本号情况

未指定特殊的版本号情况下，`preFetchLib` 将拉取最新的版本

:::

### 指定平台值

**参数名称**：`IPreFetchLibOptions.platform`

通过指定模块名称、版本号、平台拉取模块，默认是`unpkg`, 当用户独立部署了`Hel Pack`服务并需要跨多个平台获取模块时，需指定平台值

```ts
const lib = await preFetchLib('hel-tpl-remote-lib', {
  versionId: 'hel-tpl-remote-lib_20220522003658',
  platform: 'hel',
});
```

### 指定额外的样式列表

**参数名称**：`IPreFetchLibOptions.extraCssList`

预加载组件库模块时，如需追加额外的样式列表，可设置此参数

```ts
const lib = await preFetchLib('hel-antd', {
  extraCssList: ['https://xxx.com/yyy.css'],
});
```

### 开启硬盘缓存

**参数名称**：`IPreFetchLibOptions.enableDiskCache`

默认值是 false，设定为 true 后，每次都优先尝试读取 localStorage 里缓存的应用数据，再异步的拉取的一份新的应用数据缓存起来优点是可提速模块加载速度，节约元数据获取的时间，缺点是则是发版本后，用户需要多刷新一次才能看到最新版本，如为 false ，则总是同步的拉最新的应用数据

```ts
const lib = await preFetchLib('hel-antd', {
  enableDiskCache: true,
});
```

:::tip 元数据获取提速

关于元数据获取提速，有很多的其他方案，例如后台把高频使用的公共模块元数据直接埋在首页里，供 preFetchLib 直接调用

:::

### 设定 api 前缀

**参数名称**：`IPreFetchLibOptions.apiPrefix`

默认的前缀为`https://unpkg.com`，在模块部署到了其他地方时，可以修改次前缀

```ts
const lib = await preFetchLib('hel-antd', {
  apiPrefix: 'https://my-unpkg.com',
});
```

### 重置元数据接口

**参数名称**：`IPreFetchLibOptions.getSubAppAndItsVersionFn`

透传`getSubAppAndItsVersionFn`函数，可重定义`hel-micro`的默认请求行为，可根据自己的实际需求来实现。

- 示例 1：请求部署到另一个位置的元数据

未定义`getSubAppAndItsVersionFn`时，下面示例

```ts
await preFetchLib('hel-tpl-remote-vue-comps');
```

请求元数据的接口为: https://unpkg.com/hel-tpl-remote-vue-comps@1.1.3/hel_dist/hel-meta.json

当把模块部署到另外一个地方时，通过实现`getSubAppAndItsVersionFn`函数来修改元数请求行为。

```ts
await preFetchLib('hel-tpl-remote-vue-comps', {
  async getSubAppAndItsVersionFn() {
    const res = await fetch('https://hel-eco.github.io/hel-tpl-remote-vue-comp/as_v1/hel-meta.json');
    const meta = await res.json();
    return meta;
  },
});
```

> 访问该[用例](https://codesandbox.io/s/demo-load-remote-vue-comp-st0295?file=/src/main.js:229-252)

- 示例 2：做一些额外逻辑处理

当前请求自己的管控平台时，在`getSubAppAndItsVersionFn`内部做一些额外的逻辑处理。

```ts
const lib = await preFetchLib('hel-antd', {
  async getSubAppAndItsVersionFn(passCtx) {
    // 下发的首页里预埋了元数据
    if (window.__PRESET_ANTD_META__) {
      return window.__PRESET_ANTD_META__;
    }

    // 走内置的默认请求
    return passCtx.innerRequest();
  },
});
```

```ts
const lib = await preFetchLib('remote-tdesign-react', {
  async getSubAppAndItsVersionFn(passCtx) {
    // 走自定义的后台（ 通常是用户自己实现的的版本管理后台 或 hel-pack 后台 ）
    const antdMeta = await axios.get(
      'https://footprint.qq.com/hel/openapi/v1/app/info/getSubAppAndItsFullVersion?name=remote-tdesign-react',
    );
    return antdMeta;
  },
});
```

### 元数据获取失败兜底函数

**参数名称**：`IPreFetchLibOptions.onFetchMetaFailed`

如用户定义了`onFetchMetaFailed`函数，当`hel-micro`调用元数据失败时（内置请求行为失败、定义的`getSubAppAndItsVersionFn`调用失败）会调用此函数

```ts
const lib = await preFetchLib('remote-tdesign-react', {
  async onFetchMetaFailed(params) {
    // 返回一份前端预设的元数据对象，用于兜底
    return staticMeta;
  },
});
```

### 设置本地联调

**参数名称**：`IPreFetchLibOptions.custom`

当本地开发的项目需要和本地开发的模块联调时，先把模块启动起来，然后项目里使用的`preFetchLib`透传`custom`对象，描述请求的模块链接，来达到本地联调的目的

```ts
const enableCustom = !!window.location.port;
await preFetchLib('hel-tpl-remote-vue-comps', {
  custom: {
    host: 'http://localhost:7001',
    enable: enableCustom,
  },
});
```

如联调模块因为一些配置不当（ 例如 LIB_NAME 配置和调用者匹配不上 ）导致无法加载，可设置`custom.trust=true`告诉 sdk 相信模板模块就是需要加载的模块

```diff
  await preFetchLib('hel-tpl-remote-vue-comps', {
    custom: {
      host: 'http://localhost:7001',
+     trust: true,
    },
  );
```

### 资源路径替换

**参数名称**：`IPreFetchLibOptions.hook.beforeAppendAssetNode`

该方法会在`appendChildNode`之前触发，用于当需要对追加到 dom 树的资源标签（link、script）做路径替换时，可以重写此钩子函数，不过对于做了 cdn 多域名备份的模块，推荐使用[assets-retry](https://github.com/Nikaple/assets-retry)这个库来完成资源加载失败的优雅容错方案

```ts
preFetchLib('libxx', {
  hook: {
    beforeAppendAssetNode(passCtx) {
      const { url, setAssetUrl } = passCtx;
      // https://unpkg.com/remote-vue-project@1.0.6/hel_dist/css/27.aea1e7be.css
      // --->
      // https://cdn.jsdelivr.net/npm/remote-vue-project@1.0.6/hel_dist/css/27.aea1e7be.css
      const jsdelivrUrl = url.replace('https://unpkg.com', 'https://cdn.jsdelivr.net/npm');
      setAssetUrl(jsdelivrUrl);
    },
  },
});
```

:::tip 支持异步资源替换

该功能基于`MutationObserver`实现，对于非首屏加载的异步资源也能够拦截并做替换

:::

## 静态导入支持

如用户同时发布了 npm 包，则`preFetchLib`可作为预加载接口使用，先将项目入口文件内容后移一层，即可像本地模块一样头部静态导入远程模块

入口文件后移改造前，`index.js`通常作为项目加载入口做一些初始化动作，然后开始执行渲染根节点等业务逻辑。

```jsx title="src/index.js"
import React from 'react';
import App from 'src/App';
import ReactDOM from 'react-dom';

ReactDOM.render(<App />, document.getElementById('root'));
```

入口文件后移改造后，原`index.js`内容复制到`loadApp.js`里，`index.js`则用来做模块预拉取之用

```jsx title="src/index.js"
(async function () {
  const helMicro = await import('hel-micro');
  await helMicro.preFetchLib('hel-tpl-remote-lib');
  import('./loadApp');
})();
```

之后你只需要使用 npm 安装`hel-tpl-remote-lib`包，就可以项目任意文件头部静态导入该模块了

> 如果是懒加载模式，且不关心模块源码与类型，可以不用安装此 npm 包

```jsx title="src/whatever.js"
import remoteLib from 'hel-tpl-remote-lib';

function callRemoteMethod() {
  return remoteLib.num.random(19);
}
```

## IPreFetchLibOptions

以下列举了常用参数解释，更多可选参数见[IPreFetchOptionsBase](/docs/api/types/hel-micro-types#iprefetchoptionsbase)描述

| <div style={{width:'150px'}}>属性</div> | <div style={{width:'150px'}}>类型</div> | <div style={{width:'200px'}}>默认值</div> | <div style={{width:'355px'}}>描述</div> |
| --- | --- | --- | --- |
| platform | string | 'unpkg' | 指定获取模块元数据的平台 |
| versionId | string | undefined | 指定拉取的版本号, 对于 unpkg 服务来说，版本号级 package.json 里的 version 值<br />未指定版本的话，总是拉取最新版本模块元数据，如当前用户在灰度名单里，则拉取灰度版本模块元数据 |
| appendCss | boolean | true | 是否追加模块样式链接到 html 文档里 |
| cssAppendTypes | CssAppendType[] | ['static', 'build', 'relative'] | 该配置项在 appendCss 为 true 时有效，表示按要附加哪几种类型的 css 链接到 html 文档上<br />'static' 表示静态 css 链接文件<br/>'build' 表示每次构建新生成的 css 文件 |
| apiMode | 'get' \| 'jsonp' | 'jsonp' | api 请求方式 |
| enableDiskCache | boolean | false | 是否开启硬盘缓存 |

文档正在拼命建设中，有疑问可联系 [fantasticsoul](https://github.com/fantasticsoul) 或提 [issue](https://github.com/tnfe/hel/issues)，关注我的[掘金主页](https://juejin.cn/user/1732486056649880/posts)了解更多 ...
