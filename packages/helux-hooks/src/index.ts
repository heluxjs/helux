import * as React from 'react';
// 导出 helux-hooks-impl 所有方法，但类型由 index.d.ts 提供（见 package.json的 types 配置）
import { buildApi } from 'helux-hooks-impl';

export const { useStable, useEffect, useLayoutEffect, useEffectLogic, useForceUpdate, useObject, useObjectLogic } = buildApi(React);
