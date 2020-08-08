import triggerSetupEffect from './trigger-setup-effect';
import afterRender from '../ref/after-render';

export default function (ref) {
  afterRender(ref);
  triggerSetupEffect(ref);

  //!!! 将最新的state记录为prevState，方便下一轮渲染完毕执行triggerSetupEffect时做比较用
  //注意一定是先调用triggerSetupEffect，再赋值

  ref.ctx.prevState = ref.ctx.unProxyState;
}
