---
sidebar_position: 1
---

`IPreFetchOptionsBase`继承了[IControlPreFetchOptions](./IControlPreFetchOptions)， 是 `preFetchLib`，`preFetchApp`的可选参数对象类型描述，来自于 hel-micro 类型文件[描述](https://github.com/tnfe/hel/blob/main/packages/hel-micro/src/types.d.ts)

```ts
interface IPreFetchOptionsBase extends Partial<IControlPreFetchOptions> {
  /**
   * 指定拉取的版本号
   * 版本号可到 helpack 服务或 unpkg 服务查看
   */
  versionId?: string;
  /**
   * 该配置仅针对 helpack 平台有效（hel-pack对其做了实现）
   *
   */
  projectId?: string;
  /**
   * default: false,
   * 是否需要支持 shadow 特性
   */
  shadow?: boolean;
  /**
   * default: true
   */
  appendCss?: boolean;
  /**
   * default: ['static', 'relative', 'build']
   * 该配置项在 appendCss 为 true 时有效，表示按要附加哪几种类型的 css 链接到 html 文档上
   * 'static' 表示homePage之外 绝对路径导入的css文件
   * 'relative' 表示homePage之外 相对路径导入的css文件
   * 'build' 表示每次构建新生成的css文件
   */
  cssAppendTypes?: Array<AssetUrlType>;
  /**
   * 默认 []
   * 返回的要排除的 css 链接列表，这些 css 将不会附加到 html 文档上
   */
  getExcludeCssList?: (allCssList: string[], options: { version: ISubAppVersion | null }) => string[];
  /** 额外附加的样式列表 */
  extraCssList?: string[];
  /** 额外的样式字符串 */
  extraStyleStr?: string;
  /**
   * default: false
   * 是否使用平台配置的额外脚本文件或样式文件
   */
  useAdditionalScript?: boolean;
  /**
   * default: false
   * 是否开启本地缓存
   * 为 true ，每次都优先尝试读取本地缓存的应用数据，再异步的拉取的一份新的应用数据缓存起来（ 可通过设置enableSyncMeta 为 false 关闭 ）
   * 优点是可提速模块加载速度，节约元数据获取的时间，缺点是则是发版本后，用户需要多刷新一次才能看到最新版本
   * 为 false ，则总是同步的拉最新的应用数据
   */
  enableDiskCache?: boolean;
  /** default: true
   * 当设置硬盘缓存 enableDiskCache 为 true 且发现了已缓存元数据时，此参数才有效，
   * 表示是否发起延迟请求去异步地同步一下最新的元数据，
   * 如设置了 enableDiskCache 为 true 且 enableSyncMeta 为 false 时，如已存在缓存元数据 sdk 则会一直使用该缓存
   * 为了让 sdk 重新最新元数据，可调用 appMetaSrv.clearDiskCachedApp(appName) 来人工清除缓存数据
   */
  enableSyncMeta?: boolean;
  /**
   * default: localStorage
   * 选择本地缓存的类型是 localStorage 还是 indexedDB
   */
  storageType?: 'localStorage' | 'indexedDB';
  /** preFetchLib 获取到的lib为空时的钩子函数，如返回了具体的模块对象，可作为补偿 */
  onLibNull?: (appName, params: { versionId?: VersionId }) => Record<string, any> | void;
  custom?: ICustom;
  trust?: TrustEmit;
  /**
   * default: false
   * 是否跳过404嗅探，该配置项只针对 unpkg 平台生效，当用户设置为 true 时，就不会发起一个带随机参数的url去试探出最新版本的请求
   * 请求形如：https://unpkg.com/hel-lodash/xxxxx-not-found
   */
  skip404Sniff?: boolean;
}
```
