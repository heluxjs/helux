---
sidebar_position: 0
---

# check

校验 package.json 里的`appGroupName`字段是否和 `src/configs/subApp.ts(js)`里的`LIB_NAME`或`APP_NAME_NAME`是否一致，该接口通常在[srcipts/check.js](https://github.com/hel-eco/hel-tpl-remote-lib/blob/master/scripts/check.js)里被命令`npm run check`触发调用

## 基础用法

### 指定路径做检查

指定项目里包含有应用组名的文件路径做检查，`fileFullPath`可加后缀`.js`或`.ts`，也可以不添加，接口内部会去自动推测

```ts
const path = require('path');
const helDevUtils = require('hel-dev-utils');
const pkg = require('../package.json');

const fileFullPath = path.join(__dirname, '../src/configs/subApp');
helDevUtils.check(pkg, { fileFullPath, checkEnv: false });
```

### 检查环境变量里的组名

设定`checkEnv`为 true 表示检查`process.env.HEL_APP_GROUP_NAME` 是否和 package.json 里的`appGroupName`字段是否一致，通常用于流水线上需要透传`process.env.HEL_APP_GROUP_NAME`变量控制构建产物的组名时，设定此参数做检查

```ts
helDevUtils.check(pkg, { fileFullPath, checkEnv: true });
```

:::tip checkEnv 默认为 true

checkEnv 默认为 true，如用户是采取本地通过`hel-dev-utils`来构建`hel-meta.json`元数据时，可显式的设置为 false，避免 check 执行报错

:::

**文档正在拼命建设中，有疑问可联系 fantasticsoul，关注我的[掘金主页](https://juejin.cn/user/1732486056649880/posts)了解更多 ....**
