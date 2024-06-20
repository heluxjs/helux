# Change Log

click helux-core [change log](./packages/helux-core/CHANGELOG.md) to see more details

[released] - 2024-06-20

relese `4.3.6` to fix server mem leak( add `RUN_AT_SERVER` judgement)

[released] - 2024-01-16

- fix issue [136](https://github.com/heluxjs/helux/issues/136)

- fix issue [125](https://github.com/heluxjs/helux/issues/125)

- fix issue [137](https://github.com/heluxjs/helux/issues/125) 新增`fnScope.delPathAoa`来记录需要移除的依赖项，让 mutate 回调的 draft 读依赖记录更精确，避免误判为死循环

- 优化`defineFullDerive`类型，自动推导出`params.state`累心

[released] - 2023-11-24

- 接入 `vitest`

- `block` 模块重构，支持热更新，支持传入 ref，支持回调里使用其他钩子函数
