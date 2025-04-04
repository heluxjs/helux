import { addMiddleware, addPlugin } from 'helux';
import { defineLayeredStore } from './layered';
import { defineStore } from './store';
import { returnConf } from './util';

export { defineStore, defineLayeredStore, addPlugin, addMiddleware };

// defineLayeredStore options 独立存放时的类型辅助函数
export const withLayeredOptionsThis = returnConf;
// defineLayeredStore getters 独立存放时的类型辅助函数
export const withLayeredGettersThis = returnConf;
// defineLayeredStore actions 独立存放时的类型辅助函数
export const withLayeredThis = returnConf;
// defineStore options 独立存放时的类型辅助函数
export const withOptionsThis = returnConf;
// defineStore getters 独立存放时的类型辅助函数
export const withGettersThis = returnConf;
// defineStore actions 独立存放时的类型辅助函数
export const withThis = returnConf;
