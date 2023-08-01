---
sidebar_position: 2
---

# createLibSubApp

创建子应用描述对象，生成的`appInfo`对象会提供给`extractHelMetaJson`接口或其他场景使用

目前提供以下三个具体的创建函数供使用

- createLibSubApp

创建无任何`externals`设定的应用

- createReactSubApp

创建默认`externals`为`{react:'React', 'react-dom':'ReactDOM', 'react-is':'ReactIs'}` 设定的 react 应用

- createVueSubApp

创建默认`externals`为`{vue:'Vue'}` 设定的 vue 应用

:::tip 对接其他框架

对接其他框架(angular, svelte, solid ...)等，均可基于`createLibSubApp`透传`externals`创建对应的子应用描述对象

:::

`appInfo` 描述如下

```ts
interface ISubAppBuildDesc {
  platform: string;
  homePage: string;
  npmCdnType: string;
  groupName: string;
  semverApi: boolean;
  name: string;
  externals: Record<string, any>;
  /** return merged externals */
  getExternals: (userExternals?: Record<string, any>) => Record<string, any>;
  jsonpFnName: string;
  /**
   * fallbackPathOrUrl default: '/'
   * ensureEndSlash default: true
   */
  getPublicPathOrUrl: (fallbackPathOrUrl: string, ensureEndSlash: boolean) => string;
  distDir: string;
}
```

## 基础用法

以下说明均以 `createLibSubApp` 做示范，`createReactSubApp`，`createVueSubApp`与`createLibSubApp` 使用方式完全一致

### 设定 cdn 类型

**参数名称**：`ICreateSubAppOptions.npmCdnType` （ 默认值 'unpkg' ）

设定`npmCdnType`值来控制产物的 cdn 域名，目前支持`unpkg`和`jsdelivr`两种类型（unpkg: 'https://unpkg.com',jsdelivr: 'https://cdn.jsdelivr.net/npm'）

```ts
const helDevUtils = require('hel-dev-utils');
const pkg = require('../package.json');

const appInfo = helDevUtils.createLibSubApp(pkg, { npmCdnType: 'unpkg' });
module.exports = appInfo; // 暴露应用描述对象
```

### 设定 homePage

**参数名称**：`ICreateSubAppOptions.homePage` （ 默认值 undefined ）

如需要发布到自己的 cdn 地址，可设定`homePage`来替代 `npmCdnType`，支持相对路径写法，表示由主站点提供相关资源

```ts
// 自定义 homePage，形如：https://youhost.com/aa/bb、 /aa/bb、../aa/bb
const appInfo = helDevUtils.createLibSubApp(pkg, { homePage: 'http://127.0.0.1' });
```

:::tip homePage 优先级高于 npmCdnType

如同时设定了`npmCdnType`和`homePage`，`homePage`的优先级会高于`npmCdnType`，设定`npmCdnType`并不会影响产物的部署域名

:::

### 设定 externals

**参数名称**：`ICreateSubAppOptions.externals` （ 默认值 undefined ）

如该模块有其他公共的远程 cdn 依赖，可设定此参数

```ts
const appInfo = helDevUtils.createLibSubApp(pkg, { externals: { moment: 'moment' } });
```

### 不处理 homePage

**参数名称**：`ICreateSubAppOptions.handleHomePage` （ 默认值 true ）

`handleHomePage`表示最终生成的 homePage 值是否拼接上模块名、版本号、hel 内置目录等参数，当 platform 为 unpkg 且用户自定义了 homePage 值时， 此参数才有作用，通常作用于私有部署且需要定制自己的版本化语义资源路径时可调整此参数为 false

例如用户设定 homePage: https://xxx.yyy.com/sub_path

- handleHomePage 为 true

最终生成的 homePage 形如：https://xxx.yyy.com/sub_path/pack-name@1.0.0/hel_dist/

- handleHomePage 为 false

最终生成的 homePage 形如：https://xxx.yyy.com/sub_path/

```ts
// 自定义 homePage，不拼接名字和版本号
const appInfo = helDevUtils.createLibSubApp(pkg, { homePage: './xx', handleHomePage: false });
```

### 控制 HelMeta 版本号

**参数名称**：`ICreateSubAppOptions.semverApi` （ 默认值 true ）

是否是语义化 api 格式的 cdn 链接，可用于控制 HelMeta 版本号，该值的设定影响`extractHelMetaJson`接口生成的元数据结果里的版本号

- semverApi 为 true

则版本号会从 `package.json` 的 `version` 获取

- semverApi 为 false

则版本号会从`homePage`值上推导，默认相信用户的 `homePage` 值规则为：`${cdnHost}/${appZone}/${appName}_${dateStr}`，推导出来的版本号是`${appName}_${dateStr}`，当然也可以在调用 `extractHelMetaJson` 接口时设置`buildVer`跳过此推导

```ts
const appInfo = helDevUtils.createLibSubApp(pkg, { semverApi: false });
```

**文档正在拼命建设中，有疑问可联系 fantasticsoul，关注我的[掘金主页](https://juejin.cn/user/1732486056649880/posts)了解更多 ....**
