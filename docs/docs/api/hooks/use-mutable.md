---
order: 6
---

# useMutable

使用可变的本地状态（指的是`setter回调里可变`），每次修改后都会生成一份结构共享的新数据

## 基础用法

```tsx
/**
 * defaultShowCode: true
 */
import { useMutable } from 'helux';

export default function Demo() {
  const [obj, setObj] = useMutable({ a: 1, b: { b1: 1 } });
  const change = () => {
    setObj((draft) => {
      draft.b.b1 += 100;
    });
  };

  return (
    <h1>
      <button onClick={change}>obj.b.b1 {obj.b.b1}</button>
    </h1>
  );
}
```
