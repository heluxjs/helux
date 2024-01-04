---
group:
  title: 帮助
  order: 6
order: 15
---

# cst

helux提供个用户的使用常量对象通过`cst`导出

```ts
type Cst = {
  VER: string;
  LIMU_VER: string;
  EVENT_NAME: {
    ON_DATA_CHANGED: 'ON_DATA_CHANGED';
    ON_SHARE_CREATED: 'ON_SHARE_CREATED';
  };
  RECORD_LOADING: {
    NO: 'no';
    PRIVATE: 'private';
    GLOBAL: 'global';
  };
};
```
