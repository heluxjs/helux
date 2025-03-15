# @helux/f-noop

空函数合集，一共导出了以下空函数或空函数创建函数，可按需使用

```ts
export {
  makeNoopAny,
  makeNoopAnyAsync,
  noopAny,
  noopAnyAsync,
  noopNum,
  noopNumAsync,
  noopObj,
  noopObjAsync,
  noopStr,
  noopStrAsync,
  noopVoid,
  noopVoidAsync,
};
```

## 使用方式

同步的 any 空函数

```ts
import { noopAny } from '@helux/f-noop';

const fn = noopAny;
fn();
```

异步的 any 空函数

```ts
import { noopAnyAsync } from '@helux/f-noop';

const fn = noopAnyAsync;
fn().then(console.log);
```

创建自定义返回结果的异步空函数

```ts
import { makeNoopAnyAsync } from '@helux/f-noop';

const fn = makeNoopAnyAsync(333);
fn().then(console.log); // print 333
```
