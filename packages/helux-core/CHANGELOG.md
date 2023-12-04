# @helux/core

## 3.4.21

### Patch Changes

- f753724: build(3.4.21): del enableLoading, rename loadingMode to recordLoading
  - @helux/hooks-impl@3.4.21
  - @helux/types@3.4.21
  - @helux/utils@3.4.21

## 3.4.20

### Patch Changes

- 1592c51: build(3.4.20): bump limu and use grandpaType to del map node dep
- Updated dependencies [1592c51]
  - @helux/utils@3.4.20
  - @helux/hooks-impl@3.4.20
  - @helux/types@3.4.20

## 3.4.19

### Patch Changes

- a891bbb: build(3.4.19): support map get
- Updated dependencies [a891bbb]
  - @helux/utils@3.4.19
  - @helux/hooks-impl@3.4.19
  - @helux/types@3.4.19

## 3.4.18

### Patch Changes

- cec21ab: build(3.4.18): optimize operateState logic for useGlobalId, compare value with snap
  - @helux/hooks-impl@3.4.18
  - @helux/types@3.4.18
  - @helux/utils@3.4.18

## 3.4.17

### Patch Changes

- 7a50637: build(3.4.17): optimize parseRules logic, pass rootValKey
  - @helux/hooks-impl@3.4.17
  - @helux/types@3.4.17
  - @helux/utils@3.4.17

## 3.4.16

### Patch Changes

- ea2b8b1: build(3.4.16): add fixedDepKeys
  - @helux/hooks-impl@3.4.16
  - @helux/types@3.4.16
  - @helux/utils@3.4.16

## 3.4.15

### Patch Changes

- 6dd813c: build(3.4.15): del notify redundant excludedInsKeyDict logic
  - @helux/hooks-impl@3.4.15
  - @helux/types@3.4.15
  - @helux/utils@3.4.15

## 3.4.14

### Patch Changes

- 2f25934: build(3.4.14): optimize handleOperate, add canRecord to avoid dead cycle; optimize inCtx, del readMapPrev readMapStrict; optimize insDep updateDep logic, add resetDepKeys; optimize notify logic, add excludedInsKeyDict to speedup analyzeDepKey
  - @helux/hooks-impl@3.4.14
  - @helux/types@3.4.14
  - @helux/utils@3.4.14

## 3.4.13

### Patch Changes

- 60f9b8c: build(3.4.13): support draft collection dep
  - @helux/hooks-impl@3.4.13
  - @helux/types@3.4.13
  - @helux/utils@3.4.13

## 3.4.12

### Patch Changes

- d8dbcff: build(3.4.12): add snap to witness
  - @helux/hooks-impl@3.4.12
  - @helux/types@3.4.12
  - @helux/utils@3.4.12

## 3.4.11

### Patch Changes

- 715f23c: build(3.4.11): del onRead, add setOnReadHook to ctx
  - @helux/hooks-impl@3.4.11
  - @helux/types@3.4.11
  - @helux/utils@3.4.11

## 3.4.10

### Patch Changes

- 384ca24: build(3.4.10): support onRead
  - @helux/hooks-impl@3.4.10
  - @helux/types@3.4.10
  - @helux/utils@3.4.10

## 3.4.9

### Patch Changes

- 22a0203: build(3.4.8): refactor atomValMap to rootValMap; refactor analyzeDepKey logic by rootValKey; add arrDep,arrIndexDep,pure to useAtom and useShared; add createOptions.onRead
  - @helux/hooks-impl@3.4.9
  - @helux/types@3.4.9
  - @helux/utils@3.4.9

## 3.4.7

### Patch Changes

- a0c7d71: build(3.4.7): add pure arg for useAtom useShared
- Updated dependencies [a0c7d71]
  - @helux/utils@3.4.7
  - @helux/hooks-impl@3.4.7
  - @helux/types@3.4.7

## 3.4.6

### Patch Changes

- 01c801c: build(3.4.6): export isAtom isDerivedAtom
  - @helux/hooks-impl@3.4.6
  - @helux/types@3.4.6
  - @helux/utils@3.4.6

## 3.4.5

### Patch Changes

- 70b0c7c: build(3.4.5): wrap act at top; return setAtom result
- Updated dependencies [70b0c7c]
  - @helux/hooks-impl@3.4.5
  - @helux/types@3.4.5
  - @helux/utils@3.4.5

### Patch Changes

- @helux/hooks-impl@4.0.0
- @helux/types@4.0.0
- @helux/utils@4.0.0

## 3.4.4

### Patch Changes

- e204769: build(3.5.5): wrap Promise.resolve with callMutateAsync, fix getLoadingInfo logic to let top api useMutateLoading works, add act to CoreApiCtx
  - @helux/hooks-impl@3.4.4
  - @helux/types@3.4.4
  - @helux/utils@3.4.4

## 3.4.3

### Patch Changes

- 81459ef: build(3.4.3): support merge returned atom dict
- Updated dependencies [81459ef]
  - @helux/utils@3.4.3
  - @helux/hooks-impl@3.4.3
  - @helux/types@3.4.3

## 3.4.2

### Patch Changes

- 3e97065: (build:3.4.2)add markIgnore, and support watch self in options.mutate
  - @helux/hooks-impl@3.4.2
  - @helux/types@3.4.2
  - @helux/utils@3.4.2

## 3.4.1

### Patch Changes

- 10670b8: to 3.4.1
- Updated dependencies [10670b8]
  - @helux/hooks-impl@3.4.1
  - @helux/types@3.4.1
  - @helux/utils@3.4.1

## 3.4.0

### Minor Changes

- 48bc8fb: automatically unbox atom in all cb

### Patch Changes

- Updated dependencies [48bc8fb]
  - @helux/hooks-impl@3.4.0
  - @helux/types@3.4.0
  - @helux/utils@3.4.0

## 3.3.8

### Patch Changes

- c5e38d9: add deferedWatch, change deriveAtom api type, rename ctx.asyncAction to ctx.ActionAsync.
  - @helux/hooks-impl@3.3.8
  - @helux/types@3.3.8
  - @helux/utils@3.3.8

## 3.3.7

### Patch Changes

- f1e1254: add deferedWatch for useWatch
  - @helux/hooks-impl@3.3.7
  - @helux/types@3.3.7
  - @helux/utils@3.3.7

## 3.3.6

### Patch Changes

- 346895f: add test case, add level1Key to refresh shared automatically, add wrapPartial for callMutateFnLogic, add rootValKey, optimize useWatch immediate === true logic, optimize parseMutate desc gen logic for single mutate arr conf
- Updated dependencies [346895f]
  - @helux/types@3.3.6
  - @helux/utils@3.3.6
  - @helux/hooks-impl@3.3.6

## 3.3.5

### Patch Changes

- 26c7ff4: add comment to ReactLike type
- Updated dependencies [26c7ff4]
  - @helux/types@3.3.5
  - @helux/utils@3.3.5
  - @helux/hooks-impl@3.3.5

## 3.3.4

### Patch Changes

- f68bbbc: set types file to src/index.d.ts in package.json
- Updated dependencies [f68bbbc]
  - @helux/hooks-impl@3.3.4
  - @helux/types@3.3.4
  - @helux/utils@3.3.4

## 3.3.3

### Patch Changes

- 43dd66a: optimize type import
- Updated dependencies [43dd66a]
  - @helux/utils@3.3.3
  - @helux/hooks-impl@3.3.3
  - @helux/types@3.3.3

## 3.3.2

### Patch Changes

- f0c176b: optimize types, add externalGlobalPlugin to tsupo config
- Updated dependencies [f0c176b]
  - @helux/hooks-impl@3.3.2
  - @helux/types@3.3.2
  - @helux/utils@3.3.2
