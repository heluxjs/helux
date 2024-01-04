---
group:
  title: 帮助
  order: 6
order: 13
---

# addMiddleware

添加中间件

## 基础使用

```ts
import { addMiddleware, Middleware } from 'helux';

const myMiddleware: Middleware = (mid) => {
  console.log('my middleware');
};

addMiddleware(myMiddleware);
```
