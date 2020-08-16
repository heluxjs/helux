import { clearObject, okeys, makeCuDepDesc } from '../support/util';
import ccContext from '../cc-context';
import { clearCachedData } from '../core/base/pick-dep-fns';
import { clearCount } from '../core/ref/set-ref';
import { MODULE_DEFAULT, MODULE_CC, MODULE_GLOBAL, MODULE_CC_ROUTER, CC_FRAGMENT, CC_OB, CC_CLASS } from '../support/constant';
import initModuleComputed from '../core/computed/init-module-computed';
import { clearCuRefer } from '../core/base/find-dep-fns-to-execute';
import initModuleWatch from '../core/watch/init-module-watch';

let justCalledByStartUp = false;

function _clearInsAssociation(recomputed = false, otherExcludeKeys) {
  clearCuRefer();
  clearCount();
  clearObject(ccContext.event_handlers_);
  clearObject(ccContext.ccUKey_handlerKeys_);
  const ccUKey_ref_ = ccContext.ccUKey_ref_;
  clearObject(ccContext.handlerKey_handler_);
  clearObject(ccUKey_ref_, otherExcludeKeys);
  // 此处故意设置和原来的版本相差几位的数字，
  // 防止resetClassInsUI调用时类组件实例的版本和模块是相同的
  // 导致ui更新未同步到store最新数据
  const { getModuleVer, incModuleVer, replaceMV } = ccContext.store;
  const moduleVer = getModuleVer();
  okeys(moduleVer).forEach(m => {
    const curVer = moduleVer[m];
    incModuleVer(m, (curVer > 5 ? 1 : 6));
  })
  // 用于还原_moduleVer，在resetClassInsUI回调里_moduleVer又变为了 所有的模块版本值为1的奇怪现象.
  // 全局有没有找到重置_moduleVer的地方.
  const lockedMV = JSON.parse(JSON.stringify(moduleVer));

  if (recomputed) {
    const { computed, watch } = ccContext;
    const computedValue = computed._computedValue;
    const watchDep = watch._watchDep;
    const modules = okeys(ccContext.store._state);
    modules.forEach(m => {
      if (m === MODULE_CC) return;
      if (computedValue[m]) {
        // !!!先清除之前建立好的依赖关系
        ccContext.computed._computedDep[m] = makeCuDepDesc();
        initModuleComputed(m, computed._computedRaw[m]);
      }
      if (watchDep[m]) {
        // !!!先清除之前建立好的依赖关系
        watchDep[m] = makeCuDepDesc();
        initModuleWatch(m, watch._watchRaw[m]);
      }
    });
  }

  // resetClassInsUI
  return () => {
    // 安排在下一个循环自我刷新
    setTimeout(() => {
      replaceMV(lockedMV);
      otherExcludeKeys.forEach(key => {
        const ref = ccUKey_ref_[key];
        ref && ref.ctx.reactForceUpdate();
      });
    }, 0);
  }
}

function _pickNonCustomizeIns() {
  const ccUKey_ref_ = ccContext.ccUKey_ref_;
  const ccFragKeys = [];
  const ccClassInsKeys = [];
  okeys(ccUKey_ref_).forEach(refKey => {
    const ref = ccUKey_ref_[refKey];
    if (ref
      && ref.__$$isMounted === true // 已挂载
      && ref.__$$isUnmounted === false // 未卸载
    ) {
      const { type } = ref.ctx;
      if (type === CC_CLASS) ccClassInsKeys.push(refKey);
    }
  })
  return { ccFragKeys, ccClassInsKeys };
}

function _clearAll() {
  clearObject(ccContext.globalStateKeys);

  // 在codesandbox里，按标准模式组织的代码，如果只是修改了runConcent里相关联的代码，pages目录下的configure调用不会被再次触发的
  // 所以是来自configure调用配置的模块则不参与清理，防止报错
  const toExcludedModules = okeys(ccContext.moduleName_isConfigured_).concat([MODULE_DEFAULT, MODULE_CC, MODULE_GLOBAL, MODULE_CC_ROUTER]);

  clearObject(ccContext.reducer._reducer, toExcludedModules);
  clearObject(ccContext.store._state, toExcludedModules, {}, true);
  clearObject(ccContext.computed._computedDep, toExcludedModules);
  clearObject(ccContext.computed._computedValue, toExcludedModules);
  clearObject(ccContext.watch._watchDep, toExcludedModules);
  clearObject(ccContext.middlewares);

  // class组件实例的依赖要保留，因为它的ref不再被清除（不像function组件那样能在热重载期间能够再次触发unmount和mount）
  const waKey_uKeyMap_ = ccContext.waKey_uKeyMap_;
  okeys(waKey_uKeyMap_).forEach(waKey => {
    const uKeyMap = waKey_uKeyMap_[waKey];
    const newUKeyMap = {};
    okeys(uKeyMap).forEach(uKey => {
      if (uKey.startsWith(CC_CLASS)) {
        newUKeyMap[uKey] = uKeyMap[uKey];
      }
    });
    waKey_uKeyMap_[waKey] = newUKeyMap;
  });

  clearObject(ccContext.lifecycle._mountedOnce);
  clearObject(ccContext.lifecycle._willUnmountOnce);
  clearObject(ccContext.module_insCount_, [], 0);
  clearCachedData();
  const { ccClassInsKeys } = _pickNonCustomizeIns();
  return _clearInsAssociation(false, ccClassInsKeys);
}

export default function (clearAll = false) {
  ccContext.info.latestStartupTime = Date.now();
  // 热加载模式下，这些CcFragIns随后需要被恢复
  // let ccFragKeys = [];
  const noop = () => { };

  if (ccContext.isStartup) {
    if (ccContext.isHotReloadMode()) {
      if (clearAll) {
        console.warn(`attention: make sure [[clearContextIfHot]] been called before app rendered!`);
        justCalledByStartUp = true;
        return _clearAll(clearAll);
        // return ccFragKeys;
      } else {
        // 如果刚刚被startup调用，则随后的调用只是把justCalledByStartUp标记为false
        // 因为在stackblitz的 hot reload 模式下，当用户将启动cc的命令单独放置在一个脚本里，
        // 如果用户修改了启动相关文件, 则会触发 runConcent renderApp，
        // runConcent调用清理把justCalledByStartUp置为true，则renderApp这里再次触发clear时就可以不用执行了(注意确保renderApp之前，调用了clearContextIfHot)
        // 而随后只是改了某个component文件时，则只会触发 renderApp，
        // 因为之前已把justCalledByStartUp置为false，则有机会清理实例相关上下文了
        if (justCalledByStartUp) {
          justCalledByStartUp = false;
          return noop;
        }
  
        const ret = _pickNonCustomizeIns();
        // !!!重计算各个模块的computed结果
        return _clearInsAssociation(ccContext.reComputed, ret.ccClassInsKeys);
      }
    } else {
      console.warn(`clear failed because of not running under hot reload mode!`);
      return noop;
    }
  }else{
    //还没有启动过，泽只是标记justCalledByStartUp为true
    justCalledByStartUp = true;
    return noop;
  }
}
