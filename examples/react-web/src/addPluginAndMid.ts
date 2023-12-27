import { HeluxPluginDevtool } from '@helux/plugin-devtool';
import { addMiddleware, addPlugin } from 'helux';

addPlugin(HeluxPluginDevtool);
addMiddleware((mid) => {
  // console.log(mid);
});
