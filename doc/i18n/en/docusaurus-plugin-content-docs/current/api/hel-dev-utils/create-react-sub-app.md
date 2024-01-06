---
sidebar_position: 3
---

# createReactSubApp

创建 react 子应用（子模块），用法与[createLibSubApp](docs/api/hel-dev-utils/create-lib-sub-app)完全一样，区别仅是内置了`externals`为`{react:'React', 'react-dom':'ReactDOM', 'react-is':'ReactIs'}`

## 基础用法

以下是一个简单示例，其他用法见[createLibSubApp](docs/api/hel-dev-utils/create-lib-sub-app)

### 创建 react 子应用

```ts
const helDevUtils = require('hel-dev-utils');
const pkg = require('../package.json');

const appInfo = helDevUtils.createReactSubApp(pkg);
```

**文档正在拼命建设中，有疑问可联系 fantasticsoul，关注我的[掘金主页](https://juejin.cn/user/1732486056649880/posts)了解更多 ....**
