---
'@helux/core': patch
'helux': patch
---

build(3.4.14): optimize handleOperate, add canRecord to avoid dead cycle; optimize inCtx, del readMapPrev readMapStrict; optimize insDep updateDep logic, add resetDepKeys; optimize notify logic, add excludedInsKeyDict to speedup analyzeDepKey
