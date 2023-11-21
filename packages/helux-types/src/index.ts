/**
 * this lib just export types
 */

export const VER = '3.2.2';

// TODO  check
// 看到移除了 packages/helux-types/index.d.ts 文件，类型转移到这里暴露
// 直接 export * 导出类型某些环境载入可能会报错
export * from "./types";
export * from "./types-react";
