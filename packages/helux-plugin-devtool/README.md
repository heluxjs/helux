# helux-plugin-devtool

use this plugin at your entry file

```ts
import { addPlugin } from 'helux';
import { HeluxPluginDevtool } from '@helux/plugin-devtool';

addPlugin(HeluxPluginDevtool);
```

## Attention

You must set `moduleName` when create a shared state to let the devtool record state changing.

```ts
atom(1, { moduleName: 'num' });
```
