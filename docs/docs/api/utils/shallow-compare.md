---
group:
  title: 判断
  order: 6
order: 3
---

# shallowCompare

浅比较两个对象

## 基础使用

对于数组结构的数据，默认只追踪到下标位置，可配合工具函数`shallowCompare`做精准渲染

```tsx
/**
 * defaultShowCode: true
 */
import { MarkUpdate } from '@helux/demo-utils';
import { atom, shallowCompare, useAtom } from 'helux';

const [listAtom, setAtom] = atom([
  { id: 1, name: 11 },
  { id: 2, name: 22 },
]);

function change(idx: number) {
  // 当前修改仅会引起 List 和 Item1 重渲染
  setAtom((draft) => {
    draft[idx].name = Date.now();
  });
}

const Item = React.memo((props) => {
  const { item } = props;
  return (
    <MarkUpdate>
      id: {item.id} name: {item.name}
    </MarkUpdate>
  );
  // 透传 shallowCompare 函数，用于比较item代理对象前后是否一致，内部会比较数据版本号
}, shallowCompare);

export default function List() {
  const [list] = useAtom(listAtom);
  return (
    <div>
      <button onClick={() => change(1)}>change idx 1</button>
      <div>
        {list.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
```
