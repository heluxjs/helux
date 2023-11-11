---
sidebar_position: 4
---

# createOriginInstance

使用`createOriginInstance`可用于按需重设符合自己需求的[IPreFetchOptionsBase](/docs/api/types/hel-micro-types#iprefetchoptionsbase)参数，该接口会返回的一个 api 对象，使用该对象调用的任何方法都将优先使用预设的参数值作为默认值，可基于此接口定制自己的`hel-micro`包发布到 npm 方便其他项目复用。

区别于`createInstance`，`createOriginInstance`只接受一次调用，同时也能影响原始 api 的调用

```ts
// 原始 api 指从 hel-micro 里直接导入的接口，例如下面的 preFetchLib 是原始 api
import { preFetchLib, createOriginInstance } from 'hel-micro';
// 预设 origin 配置
const ins = createOriginInstance('myplat', { apiPrefix: 'https://myplat.com', semverApi: false });
// 此后采用 preFetchLib 加载 myplat 的任何模块时，将自动读取到对应 myplat 平台预设的 origin 配置
preFetchLib('xx', { platform: 'myplat' });
```

**文档正在拼命建设中，有疑问可联系 fantasticsoul，关注我的[掘金主页](https://juejin.cn/user/1732486056649880/posts)了解更多 ....**
