---
group:
  title: 帮助
  order: 6
order: 14
---

# addPlugin

添加插件

:::info
插件开发可查看[指南/插件](/guide/plugins)了解更多
:::

## 基础使用

```ts
import { HeluxPluginDevtool } from '@helux/plugin-devtool';
import { addPlugin } from 'helux';

addPlugin(HeluxPluginDevtool);
```