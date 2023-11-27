---
sidebar_position: 0
---

# atom&share

本章节是 `atom`和`share` api 简单使用方式，更多详情可查看

- [基础用法](/helux/docs/api/atom-and-share/basic-usage)

## 使用方式

### atom 定义

```ts
import { atom, deriveAtom, useAtom } from 'helux';
// atom 定义
const [numAtom, setAtom] = atom(1);
```

### 组件外修改

```ts
const changeAtom = (newNum)=> setAtom(newNum);
const changeAtomByDraft = (newNum)=> setAtom(draft=>{ draft.val = newNum });
```

### 可变派生

```ts
const [doubleAtom] = atom(0, {
  mutate: (draft)=> { draft.val = numAtom.val *2 },
});
```

### 全量派生

```ts
const doubuleResult = deriveAtom(()=> numAtom.val * 2 );
```

### 组件内使用

```ts
function Demo(){
  const [num, setNum] = useAtom(numAtom);
  // 此处的调用和 changeAtom changeAtomByDraft 等效
  const innerChangeAtom = (newNum)=> setNum(newNum);
  const innerChangeAtomByDraft = (newNum)=> setNum(draft=>{ draft.val = newNum });
}
```
