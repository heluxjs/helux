---
sidebar_position: 1
---

# extractHelMetaJson

提取`hel-meta.json`[元数据](https://unpkg.com/hel-tpl-remote-lib@2.5.0/hel_dist/hel-meta.json)，方便`hel-micro` sdk 可以基于此数据加载对应的模块，该接口通常在[srcipt/meta.js](https://github.com/hel-eco/hel-tpl-remote-lib/blob/master/scripts/meta.js)里被命令`npm run meta`触发调用

## 基础用法

### 提取元数据

```ts
const process = require('process');
const path = require('path');
const helDevUtils = require('hel-dev-utils');
const packageJson = require('../package.json');
const appInfo = require('../config/appInfo');

helDevUtils
  .extractHelMetaJson({
    appInfo,
    buildDirFullPath: path.join(__dirname, '../hel_dist'),
    packageJson,
  })
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  });
```

### 控制元数据提取范围

**参数名称**：`IUserExtractOptions.extractMode` （ 默认值 'all' ）

元数据由产物的`index.html`文件和构建目录下的所有文件共同生成，有以下四种值可设定

- all

提取并记录构建时生成的产物、静态路径导入的产物、homePage 之外相对路径导入的产物，同时也会记录 html_content

- build

只提取并记录构建时生成的产物，同时也会记录 html_content

- all_no_html

提取并记录构建时生成的产物、静态路径导入的产物、homePage 之外相对路径导入的产物，不记录 html_content

- build_no_html

只提取并记录构建时生成的产物，不记录 html_content

:::caution 不要轻易调整此参数

大多数时候'all'是可用的，如无需记录首页的原始 html（达到参加元数据大小的目的），可设定 all_no_html，如此模块无任何 cdn 公共模块或非构建产物，可设定为 build

:::

### 允许相对路径资源存在

**参数名称**：`IUserExtractOptions.enableRelativePath` （ 默认值 false ）

相对路径资源指的是 homePage 之外的相对路径的资源，如设定为 true，则元数据会记录相关相对路径的资源，但依然会标记`append`为 false，表示不加载，如需要加载，则需要显示的标记`data-helappend`为`1`（也可以仅标记 `data-helappend` ），sdk 才会加载此资源

```html
<!-- 元数据记录此资源，并让sdk加载此资源 -->
<script src="../../some-file.js" data-helappend></script>
<script src="../../some-file.js" data-helappend="1"></script>
<!-- 元数据记录此资源，但sdk不加载此资源 -->
<script src="../../some-file.js" data-helappend="0"></script>
```

:::tip 在 html 里调整

`enableRelativePath` 设定为 true 后， 在应用的 `index.html` 里找到对应资源按需设定`data-helappend`（通常位于 public/index.html），调整后会影响`extractHelMetaJson`的生成结果

:::

:::caution 确保宿主站点提供此资源

相对路径资源是一种较危险的资源，它采取的是相信宿主一定会提供此资源的策略，所以需要模块使用方确保宿主站点提供此资源

:::

### 设定延迟加载的公共模块

由于子应用在[createLibSubApp](docs/api/hel-dev-utils/create-lib-sub-app)里可设定`externals`，这些 externals 资源默认需要宿主提供，但当存在某些公共资源宿主本身不需要但多个子模块需要复用的情况出现时，为了减轻宿主的首屏加载资源量，可以标记`data-helex`来告诉 sdk 此资源是一个可延迟加载且可共享给其他子应用使用的资源

```html
<!-- 需确保 xxx.com/day.js 会向 window.DayJs 挂载此模块 -->
<!-- 多个子应用自己的元数据里都带有data-helex="DayJs"的标签时，只会加载第一个被加载的应用上携带的DayJs模块 -->
<!-- 其他的则复用首个加载的那个 DayJs 模块  -->
<script src="xxx.com/day.js" data-helex="DayJs"></script>
```

:::tip 仅调整 html 即可

在应用的 `index.html` 里设定`data-helex`（通常位于 public/index.html），调整后会影响`extractHelMetaJson`的生成结果

:::

### 设定版本号

**参数名称**：`IUserExtractOptions.buildVer` （ 默认值 undefined ）

当`appInfo`的[semverApi](/docs/api/hel-dev-utils/create-lib-sub-app#控制-helmeta-版本号)为 false 时，如需手动控制版本号值则可设置此参数

```ts
helDevUtils.extractHelMetaJson({
  // ... other args
  buildVer: 'v1',
});
```

**文档正在拼命建设中，有疑问可联系 fantasticsoul，关注我的[掘金主页](https://juejin.cn/user/1732486056649880/posts)了解更多 ....**
