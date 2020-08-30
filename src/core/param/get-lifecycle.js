
/**
 * 兼容v2.8之前的 moduleConf.init、initPost
 * 2.9之后不再d.ts的ModuleConf类型里暴露init、initPost，仅为了让老版本的js工程升级到2.9能正常工作
 * 如果是ts工程，则需要将init逻辑迁移到 lifecycle.initState 里，initPost 迁移到 lifecycle.initStateDone 里
 */


export default function (legencyModuleConf) {
  const lifeCycleCopy = Object.assign({}, legencyModuleConf.lifecycle);
  // 优先取lifecycle里的initState、initStateDone，不存在的话再去对接原来外层的init、initPost定义
  if (!lifeCycleCopy.initState) lifeCycleCopy.initState = legencyModuleConf.init;
  if (!lifeCycleCopy.initStateDone) lifeCycleCopy.initStateDone = legencyModuleConf.initPost;
  return lifeCycleCopy;
}
