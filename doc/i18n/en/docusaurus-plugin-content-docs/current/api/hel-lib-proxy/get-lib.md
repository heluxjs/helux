---
sidebar_position: 2
---

# getLib

`getLib`是服务于模块使用方的接口，提前调用[preFetchLib](/docs/api/hel-micro/prefetch-lib)做预加载后，可直接获取远程模块暴露对象

## 基础用法

### 获取模块对象

获取第一个预加载的模块对象

```ts
import { getLib } from 'hel-lib-proxy';
getLib('xxx');
```

### 指定版本号

获取指定版本的模块对象

```ts
import { getLib } from 'hel-lib-proxy';
getLib('xxx', { versionId: 'v1' });
```

### 指定平台值

获取指定平台值的模块对象（默认值 unpkg）

```ts
import { getLib } from 'hel-lib-proxy';
getLib('xxx', { platform: 'myplat' });
```
