---
sidebar_position: 4
---

# createInstance

使用`createInstance`可用于按需重设符合自己需求的[IPreFetchOptionsBase](/docs/api/types/hel-micro-types#iprefetchoptionsbase)参数，该接口会返回的一个 api 对象，使用该对象调用的任何方法都将优先使用预设的参数值作为默认值，可基于此接口定制自己的`hel-micro`包发布到 npm 方便其他项目复用。

## 常见用法

### 设定自己的请求域名

对指定平台设定自己的请求域名

```ts
import { createInstance } from 'hel-micro';

const ins = helMicro.createOriginInstance('myplat', {
  getApiPrefix() {
    return 'https://myhost.com';
  },
});
```

### 设定自己的请求函数

相比设定请求域名，设定请求函数会更灵活

```ts
import { createInstance } from 'hel-micro';

const ins = helMicro.createOriginInstance('myplat', {
  getSubAppAndItsVersionFn(params) {
    if (params.appName === 'xxx') {
      return fetch('xxxMetaUrl');
    }
    return params.innerRequest();
  },
});
```

**文档正在拼命建设中，有疑问可联系 fantasticsoul，关注我的[掘金主页](https://juejin.cn/user/1732486056649880/posts)了解更多 ....**
