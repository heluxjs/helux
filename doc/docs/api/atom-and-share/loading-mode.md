---
sidebar_position: 7
---

# loading 记录位置

参数`loadingMode`，默认值`PRIVATE`，

- PRIVATE helux 会为每一个共享状态同步创建一个伴生 loading 状态，该共享状态异步变化过程都会记录到此伴生 loading 状态上

- GLOBAL 共享状态的异步变化过程的伴生 loading 状态记录到此全局 loading 状态上，需用户自己避免 key 命名冲突问题。

- NONE
