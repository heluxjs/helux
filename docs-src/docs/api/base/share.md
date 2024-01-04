---
group:
  title: 状态
  order: 0
order: 1
---

# share

`atom`支持任意数据类型，直接读取时需要手动拆箱，`share`仅支持字典类型，因返回结果是字典对象，无装箱行为，可以直接读取目标任意节点值

```ts
import { share } from 'helux';

const [sharedObj] = share({ info: { born: 2023 } });
console.log(sharedObj); // sharedObj: {info: { born: 2023 }}
```

其他使用方式均和[atom](/api/base/atom)保持一致。
