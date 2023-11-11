---
sidebar_position: 1
---

# exposeLib

`exposeLib`是服务于模块提供方的接口，在`rollup`打包入口文件使用，用于将代码的类型与代理对象暴露出去，具体使用可参考此[libTypes](https://github.com/hel-eco/hel-tpl-remote-lib/blob/master/src/entrance/libTypes.ts)文件。

## 基础用法

### 暴露模块代理对象

暴露代理对象并使用 rollup 打包发布到 npm 后，使用方先使用[preFetchLib](/docs/api/hel-micro/prefetch-lib)做预加载，然后就可以安全的静态导入

- 提供方

```ts
import { exposeLib } from 'hel-lib-proxy';
import { LIB_NAME } from 'configs/subApp';

export const lib = exposeLib(LIB_NAME);
export default lib;
```

-使用方

```ts
// 入口文件出预加载运行时代码
await preFetchLib('xxx');

// 其他文件里静态导入模块代理对象
import xxx from 'xxx'; // 实际运行代码将由 preFetchLib 填充

xxx.callRemoteMethod(); // 这里即可安全的调用远程方法
```

### 暴露模块类型

对于 ts 工程，建议连同类型一起暴露，方便调用方获得友好的 IDE 智能提示，提高开发体验

```ts
import type { LibProperties } from './libProperties'; // 此处仅导出类型，不会影响rollup的打包体积
import { exposeLib } from 'hel-lib-proxy';
import { LIB_NAME } from 'configs/subApp';

export const lib = exposeLib<LibProperties>(LIB_NAME);
export type Lib = LibProperties;

export default lib;
```

## 高级用法

### 使用方直接获得代理对象

虽然`exposeLib`是服务于模块提供方的接口，但如果模块提供方并未发布代理对象到 npm，而使用方有需要使用静态导入功能时，可使用`exposeLib`直接获取到代理对象

```ts
// 入口文件出预加载运行时代码
await preFetchLib('xxx');

// 其他文件里使用 exposeLib 获得模块代理对象
import { exposeLib } from 'hel-lib-proxy';
const xxxLib = exposeLib('xxx');
xxx.callRemoteMethod(); // 这里即可安全的调用远程方法
```

也可透传类型泛型获得相关类型提示

```ts
const xxxLib = exposeLib<LibType>('xxx');
```
