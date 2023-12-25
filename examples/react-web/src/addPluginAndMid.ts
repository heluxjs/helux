import { HeluxPluginDevtool } from '@helux/plugin-devtool';
import { addPlugin, addMiddleware } from 'helux';

addPlugin(HeluxPluginDevtool);
addMiddleware((mid) => {
  // console.log(mid);
});
