[简体中文](./README.md) | English

# Introducing helux

[helux](https://github.com/heluxjs/helux) is a react state library that integrates `atom`, `signal`, and `dependency collection`. It has the following features:

<p align="center">
  <a href="https://concentjs.github.io/concent-doc">
    <img width="680px" src="https://tnfe.gtimg.com/image/fp78ya1et7_1703769973306.png">
  </a>
</p>


- Developed based on the fastest immutable js library [limu](https://github.com/tnfe/limu), with super performance
- Atom supports dependency collection, which means that atom does not need to be split into details. Atom can be equivalent to model, which is naturally friendly to `DDD` domain-driven design.
- Built-in signal response mechanism, which can achieve 0 hook encoding + DOM granular update
- Built-in loading module, which can manage the running status and error capture of all asynchronous tasks
- Support variable derivation and update data with minimum granularity
- Supports full derivation, which is more appropriate when fine-grained updates to data are not required.
- Both full derivation and variable derivation support asynchronous tasks
- In addition to data change-driven execution at full derivation and variable derivation, it also supports manual re-triggering of execution.
- Built-in event system
- Supports middleware and plug-in systems, and can seamlessly connect with redux ecological related tool libraries
- 100% ts encoding, type hint optimization

> In order to facilitate users to understand the core logic of `helux`, we provide the [how-helux-was-born](https://github.com/fantasticsoul/how-helux-was-born) project to assist users in making helux source code debug.

## Quick start

### atom

```tsx
import { atom, useAtom } from 'helux';
const [numAtom] = atom(1); // { val: 1 }

function Demo() {
  const [num, setAtom] = useAtom(numAtom); // num is automatically unboxed
  return <h1 onClick={setAtom(Math.random())}>{num}</h1>;
}
```

### dep collection

**Dependency collection**, data dependencies will be collected in real time during component rendering

```tsx
import { useAtom } from 'helux';
const [objAtom, setObj] = atom({ a: 1, b: { b1: 1 } });

// Modify the draft and generate a new state with shared data structure. The current modification will only trigger the rendering of the Demo1 component.
setObj((draft) => (draft.a = Math.random()));

function Demo1() {
  const [obj] = useAtom(objAtom);
  // Trigger re-rendering only when obj.a changes
  return <h1>{obj.a}</h1>;
}

function Demo2() {
  const [obj] = useAtom(objAtom);
  // Trigger re-rendering only when obj.b.b1 changes
  return <h1>{obj.b.b1}</h1>;
}
```

### signal

**Signal response**, which binds the shared state original value directly to the view

raw value response

```tsx
// This will only cause internal re-rendering of the h1 tag.
<h1>${numAtom}</h1>
```

block response

```tsx
import { block } from 'helux';
const [objAtom] = atom({ a: 1, b: { b1: 1 } });

const UserBlock = block(() => (
  <div>
    <h1>{objAtom.a}</h1>
    <h1>{objAtom.b.b1}</h1>
  </div>
));

// Dependencies are obj.val.a, obj.val.b.b1
<UserBlock />;

// If you use share to create a shared object, the dependencies of the UserBlock instance are obj.a, obj.b.b1
const [objAtom] = share({ a: 1, b: { b1: 1 } });
```

### mutate derive

**Variable derivation**, responds to changes in some nodes of the shared state itself, and derives the results of other nodes of itself.

```ts
import { share, mutate } from 'helux';
const [shared] = share({ a: 1, b: 0, c: 0 });

mutate(shared)({
  changeB: (draft) => (draft.b = shared.a + 1),
  changeC: (draft) => (draft.c = shared.a + 2),
});
```

Respond to changes in certain nodes in other shared states and derive other node results of its own

```ts
import { share, mutate } from 'helux';
const [shared] = share({ a: 1 });
const [sharedB] = share({ b: 0, c: 0 });

mutate(sharedB)({
  changeB: (draft) => (draft.b = shared.a + 1),
  changeC: (draft) => (draft.c = shared.a + 2),
});
```

### full derive

**Full derivation**, in response to certain node changes in other shared states, fully derivation of new results

```ts
import { share, derive, deriveAtom, useDerived, useDerivedAtom } from 'helux';
const [shared] = share({ a: 1 });

const resultDict = derive(() => ({ num: shared.a + 100 })); // { num: number }
const resultAtom = deriveAtom(() => shared.a + 100); // Autoboxing: { val: number }

const [result] = useDerived(resultDict); // { num: number}
const [result] = useDerivedAtom(resultAtom); // Automatic unboxing: number
```

### watch

Observe data changes through watch

Actively define dependencies and do not execute them for the first time

```ts
import { watch } from 'helux';

// Only when changes in a are observed, the callback execution is notified
watch(() => {
  console.log('a change');
}, [shared.a]);

//Notify callback execution when any shared node changes
watch(() => {
  console.log('shared change');
}, [shared]);
```

Set `immediate=true` to execute immediately and automatically collect dependencies.

```ts
watch(
  () => {
    console.log('a change', shared.a);
  },
  { immediate: true },
);
```
