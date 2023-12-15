# helux

## 3.5.5

### Patch Changes

- 8e9890a: build(3.5.5): refactor dead-cycle detact
- Updated dependencies [8e9890a]
  - @helux/core@3.5.5

## 3.5.4

### Patch Changes

- 03296b6: build(3.5.4): add defineActions defineMutateDerive defineFullDerive, fix getLoading not change in block, fix mutate task deadcycle
- Updated dependencies [03296b6]
  - @helux/core@3.5.4

## 3.5.3

### Patch Changes

- c2d09a8: build(3.5.3): add markExpired in buildReactive
- Updated dependencies [c2d09a8]
  - @helux/core@3.5.3

## 3.5.2

### Patch Changes

- 83e8fc3: build(3.5.2): merge action,actionAsync,atomAtion,atomAsyncAsync to action, merge mutate,atomMuate to mutate, del atomSync atomSyncer, del atomCall, del useShared
- Updated dependencies [83e8fc3]
  - @helux/core@3.5.2

## 3.5.1

### Patch Changes

- e6fde9a: build(3.5.1): add ctx.useReactive
- Updated dependencies [e6fde9a]
  - @helux/core@3.5.1

## 3.5.0

### Minor Changes

- f66f7f9: build(3.5.0): expose reactive data

### Patch Changes

- Updated dependencies [f66f7f9]
  - @helux/core@3.5.0

## 3.4.26

### Patch Changes

- d77dc37: build(3.4.26): del limu reexport, cause codesandbox will throw immut not a function error
- Updated dependencies [d77dc37]
  - @helux/core@3.4.26

## 3.4.25

### Patch Changes

- f2f827c: build(3.4.25): reexport limu; optimize clearInternal; ctx.mod now map to internal
- Updated dependencies [f2f827c]
  - @helux/core@3.4.25

## 3.4.24

### Patch Changes

- ba43829: build(3.4.24): bump limu to get right isChanged
- Updated dependencies [ba43829]
  - @helux/core@3.4.24

## 3.4.23

### Patch Changes

- Updated dependencies [fda289e]
  - @helux/core@3.4.23

## 3.4.22

### Patch Changes

- Updated dependencies [cf9b726]
  - @helux/core@3.4.22

## 3.4.21

### Patch Changes

- Updated dependencies [f753724]
  - @helux/core@3.4.21

## 3.4.20

### Patch Changes

- 1592c51: build(3.4.20): bump limu and use grandpaType to del map node dep
- Updated dependencies [1592c51]
  - @helux/core@3.4.20

## 3.4.19

### Patch Changes

- a891bbb: build(3.4.19): support map get
- Updated dependencies [a891bbb]
  - @helux/core@3.4.19

## 3.4.18

### Patch Changes

- cec21ab: build(3.4.18): optimize operateState logic for useGlobalId, compare value with snap
- Updated dependencies [cec21ab]
  - @helux/core@3.4.18

## 3.4.17

### Patch Changes

- 7a50637: build(3.4.17): optimize parseRules logic, pass rootValKey
- Updated dependencies [7a50637]
  - @helux/core@3.4.17

## 3.4.16

### Patch Changes

- ea2b8b1: build(3.4.16): add fixedDepKeys
- Updated dependencies [ea2b8b1]
  - @helux/core@3.4.16

## 3.4.15

### Patch Changes

- Updated dependencies [6dd813c]
  - @helux/core@3.4.15

## 3.4.14

### Patch Changes

- 2f25934: build(3.4.14): optimize handleOperate, add canRecord to avoid dead cycle; optimize inCtx, del readMapPrev readMapStrict; optimize insDep updateDep logic, add resetDepKeys; optimize notify logic, add excludedInsKeyDict to speedup analyzeDepKey
- Updated dependencies [2f25934]
  - @helux/core@3.4.14

## 3.4.13

### Patch Changes

- Updated dependencies [60f9b8c]
  - @helux/core@3.4.13

## 3.4.12

### Patch Changes

- Updated dependencies [d8dbcff]
  - @helux/core@3.4.12

## 3.4.11

### Patch Changes

- Updated dependencies [715f23c]
  - @helux/core@3.4.11

## 3.4.10

### Patch Changes

- Updated dependencies [384ca24]
  - @helux/core@3.4.10

## 3.4.9

### Patch Changes

- Updated dependencies [22a0203]
  - @helux/core@3.4.9

## 3.4.7

### Patch Changes

- a0c7d71: build(3.4.7): add pure arg for useAtom useShared
- Updated dependencies [a0c7d71]
  - @helux/core@3.4.7

## 3.4.6

### Patch Changes

- 01c801c: build(3.4.6): export isAtom isDerivedAtom
- Updated dependencies [01c801c]
  - @helux/core@3.4.6

## 3.4.5

### Patch Changes

- 70b0c7c: build(3.4.5): wrap act at top; return setAtom result
- Updated dependencies [70b0c7c]
  - @helux/core@3.4.5

### Patch Changes

- Updated dependencies [a177829]
  - @helux/core@4.0.0

## 3.4.4

### Patch Changes

- e204769: build(3.5.5): wrap Promise.resolve with callMutateAsync, fix getLoadingInfo logic to let top api useMutateLoading works, add act to CoreApiCtx
- Updated dependencies [e204769]
  - @helux/core@3.4.4

## 3.4.3

### Patch Changes

- 81459ef: build(3.4.3): support merge returned atom dict
- Updated dependencies [81459ef]
  - @helux/core@3.4.3

## 3.4.2

### Patch Changes

- 3e97065: (build:3.4.2)add markIgnore, and support watch self in options.mutate
- Updated dependencies [3e97065]
  - @helux/core@3.4.2

## 3.4.1

### Patch Changes

- 10670b8: to 3.4.1
- Updated dependencies [10670b8]
  - @helux/core@3.4.1

## 3.4.0

### Minor Changes

- 48bc8fb: automatically unbox atom in all cb

### Patch Changes

- Updated dependencies [48bc8fb]
  - @helux/core@3.4.0

## 3.3.8

### Patch Changes

- Updated dependencies [c5e38d9]
  - @helux/core@3.3.8

## 3.3.7

### Patch Changes

- Updated dependencies [f1e1254]
  - @helux/core@3.3.7

## 3.3.6

### Patch Changes

- 346895f: add test case, add level1Key to refresh shared automatically, add wrapPartial for callMutateFnLogic, add rootValKey, optimize useWatch immediate === true logic, optimize parseMutate desc gen logic for single mutate arr conf
- Updated dependencies [346895f]
  - @helux/core@3.3.6

## 3.3.5

### Patch Changes

- Updated dependencies [26c7ff4]
  - @helux/core@3.3.5

## 3.3.4

### Patch Changes

- f68bbbc: set types file to src/index.d.ts in package.json
- Updated dependencies [f68bbbc]
  - @helux/core@3.3.4

## 3.3.3

### Patch Changes

- 43dd66a: optimize type import
- Updated dependencies [43dd66a]
  - @helux/core@3.3.3

## 3.3.2

### Patch Changes

- f0c176b: optimize types, add externalGlobalPlugin to tsupo config
- Updated dependencies [f0c176b]
  - @helux/core@3.3.2
