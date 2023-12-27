---
group:
  title: 基础
  order: 0
order: 1 
---

# 中间件
 中间件是一个同步函数，在状态提交前被调用，可通过中间件函做一些统一操作，例如数修改草稿的时间属性

### 定义中间件

```ts
import { Middleware } from 'helux';

const markTimeMiddleWare: Middleware = (params) => {
  const { sharedKey, moduleName, draft } = params;
  draft.time = Date.now();
};
```

### 使用中间件

```ts
import { addMiddleware } from 'helux';

addMiddleware(markTimeMiddleWare);
```
