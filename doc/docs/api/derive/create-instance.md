---
sidebar_position: 3
---

# createInstance

使用`createInstance`可用于按需重设符合自己需求的默认平台值，该接口会返回的一个 api 对象，使用该对象调用的任何方法都将使用重设的平台值，可基于此接口定制自己的`hel-lib-proxy`包发布到 npm 方便其他项目复用。

## 基础用法

### 设置默认值

```ts
import { createInstance } from 'hel-lib-proxy';

const ins = createInstance('myplat');
// 调用 ins.libReady 将默认使用 myplat 平台值
```
