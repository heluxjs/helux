---
sidebar_position: 2
---

来自于 hel-micro 类型文件[描述](https://github.com/tnfe/hel/blob/main/packages/hel-micro/src/types.d.ts)

````ts
export interface IControlPreFetchOptions {
  platform: Platform;
  /**
   * default: true
   * 表示是否走语义化版本 api 请求，不设定此项的话最终会匹配到兜底值 true，匹配路径如下
   * ```
   * preFetchOptions.semverApi --> platInitOptions.semverApi --> originInitOptions.semverApi  --> true
   * ```
   * 表示是否走语义化版本 api 请求
   * ```
   * 为 true ，生成的请求链接格式形如：{apiPrefix}/{name}@{version}/hel_dist/hel-meta.json
   * 例子：https://unpkg.com/hel-tpl-remote-vue-comps@1.1.3/hel_dist/hel-meta.json
   * 为 false ，生成的请求链接格式形如：{apiPrefix}/openapi/v1/app/info/getSubAppAndItsFullVersion?name={name}&version={version}
   * ```
   */
  semverApi: boolean;
  /**
   * default: true
   * 表示是否严格匹配版本，不设定此项的话最终会匹配到兜底值 true，匹配路径如下
   * ```
   * preFetchOptions.strictMatchVer --> platInitOptions.strictMatchVer --> originInitOptions.strictMatchVer  --> true
   * ```
   * 如存在有老包体未发射版本号的情况，这里可以置为 false，让sdk能够正常获取到模块
   */
  strictMatchVer: boolean;
  /**
   * default：'get'
   * semverApi 为 true 时，设置此值无效，一定会发起 get 请求
   * 仅当 semverApi 为 false 时，设置此值才会有效
   * - 设置为 get 会发起如下格式的 get 请求
   * {apiPrefix}/openapi/v1/app/info/getSubAppAndItsFullVersion?name={name}&version={version}
   * - 设置为 jsonp 会发起如下格式的 jsonp 请求
   * {apiPrefix}/openapi/v1/app/info/getSubAppAndItsFullVersionJsonp?name={name}&version={version}
   */
  apiMode: ApiMode;
  /**
   * default: 'https://unpkg.com'
   * 请求接口的域名前缀，匹配规则见 getApiPrefix 描述
   */
  apiPrefix: string;
  /**
   * default: null
   * 生成 apiPrefix 的函数，同一个 option 层级下 getApiPrefix 返回值优先级会高于 apiPrefix 传值
   * ```
   * // 按以下优先级依次获取
   * 1 preFetchOptions.getApiPrefix()
   * 2 preFetchOptions.apiPrefix
   * 3 platInitOptions.getApiPrefix()
   * 4 platInitOptions.apiPrefix
   * 5 originInitOptions.getApiPrefix()
   * 6 originInitOptions.apiPrefix
   * 7 内部兜底值 'https://unpkg.com'
   * ```
   */
  getApiPrefix: () => string;
  /**
   * default: ''
   * 设定了 apiSuffix，则请求一定会带上设定的后缀值
   */
  apiSuffix: string;
  /**
   * default: '/openapi/v1/app/info'，请求应用元数据的主路径，仅当 semverApi 为 false 时，设置此值才会有效
   * 内部会结合 apiMode 来决定拼成请求路由 ${apiPathOfApp}/getSubAppAndItsVersion 或 ${apiPathOfApp}/getSubAppAndItsVersionJsonp
   * ```
   * // 按以下优先级依次获取
   * 1 preFetchOptions.apiPathOfApp
   * 2 platInitOptions.apiPathOfApp
   * 3 originInitOptions.apiPathOfApp
   * 4 内部兜底值 '/openapi/v1/app/info'
   * ```
   */
  apiPathOfApp: string;
  /**
   * default: '/openapi/v1/app/info'，请求应用应用版本的主路径，仅当 semverApi 为 false 时，设置此值才会有效
   * 内部会结合 apiMode 来决定拼成请求路由 ${apiPathOfAppVersion}/getSubAppVersion 或 ${apiPathOfAppVersion}/getSubAppVersionJsonp
   * ```
   * // 按以下优先级依次获取
   * 1 preFetchOptions.apiPathOfAppVersion
   * 2 platInitOptions.apiPathOfAppVersion
   * 3 originInitOptions.apiPathOfAppVersion
   * 4 内部兜底值 '/openapi/v1/app/info'
   * ```
   */
  apiPathOfAppVersion: string;
  /**
   * default: null
   * 定义获取 app 和 version 数据的函数，修改 hel-micro 的默认请求行为，可根据自己的实际需求来实现此函数逻辑
   * 如定义了 getSubAppAndItsVersionFn 函数，则 apiMode apiPrefix apiSuffix apiPathOfApp 设定均无效
   * @see https://tnfe.github.io/hel/docs/api/hel-micro/prefetch-lib#%E9%87%8D%E7%BD%AE%E5%85%83%E6%95%B0%E6%8D%AE%E6%8E%A5%E5%8F%A3
   * ```
   * // 优先级依次是：
   * 1 preFetchOptions.getSubAppAndItsVersionFn
   * 2 platInitOptions.getSubAppAndItsVersionFn
   * 3 originInitOptions.getSubAppAndItsVersionFn
   * 4 内部请求行为
   * ```
   */
  getSubAppAndItsVersionFn: (passCtx: {
    platform: string;
    appName: string;
    userName: string;
    versionId: string | undefined;
    url: string;
    /** 内部请求句柄 */
    innerRequest: (url?: string, apiMode?: ApiMode) => Promise<IHelMeta>;
  }) => Promise<IHelMeta> | IHelMeta;
  /**
   * default: 'HelUserRtxName'，仅当 semverApi 为 false 时，设置此值才会有效
   * 发起自定义平台请求时，尝试从 localStorage 的 {userLsKey} 下获取用户名，
   * 如获取不到会继续尝试从 cookie 的 {userLsKey} 下获取用户名，
   * 以便让后台知道请求者是谁从而决定是否要下发灰度版本（如存在灰度版本）
   */
  userLsKey: string;
  /**
   * default: null ，仅当 semverApi 为 false 时，设置此值才会有效
   * 自定义获取用户名的函数，如用户定义了此函数，则获取优先级会高于 userLsKey 定义对应的获取逻辑
   */
  getUserName: (passCtx: { platform: string; appName: string; userLsKey?: string }) => string;
  /**
   * @deprecated since version v4.0
   * 建议配置到 options.hook.onFetchMetaFailed 里，此处保留此属性是为了让 v3 版本的用户升级到 v4 后，此钩子函数依然有效
   * 如同时配置 options.onFetchMetaFailed 和 options.hook.onFetchMetaFailed
   * 则 options.hook.onFetchMetaFailed 优先有效
   */
  onFetchMetaFailed: (params: { platform: string; appName: string; versionId: string }) => Promise<IHelMeta> | IHelMeta | void;
  /**
   * default: null ，仅当 semverApi 为 false 时，设置此值才会有效
   * sdk端控制是否下发灰度版本，不定义次函数走后台内置的灰度规则
   * 定义了此函数，返回true或false则会覆盖掉后台内置的灰度规则，返回 null 依然还是会走后台内置的灰度规则
   */
  shouldUseGray: (passCtx: { appName: string }) => boolean | null;
  hook: {
    /**
     * 用于做一些额外提示之用，如 params.fromFallback 为true，则表示 meta 数据来自于 onFetchMetaFailed 钩子返回的数据
     */
    onFetchMetaSuccess?: (params: { fromFallback: boolean; app: ISubApp; version: ISubAppVersion }) => void;
    /**
     * 元数据获取失败时（远端和本地缓存均失败）的钩子函数，如返回自定元数据，则可作为兜底数据
     */
    onFetchMetaFailed?: (params: { platform: string; appName: string; versionId: string }) => Promise<IHelMeta> | IHelMeta | void;
    beforeAppendAssetNode?: (passCtx: {
      /** link 元素或 script 元素 */
      el: HTMLLinkElement | HTMLScriptElement;
      /** 元素的样式 */
      url: string;
      /** 元素节点类型，辅助用户自己去收窄 el 具体类型 */
      tagName: 'LINK' | 'SCRIPT';
      nativeAppend: Node['appendChild'];
      setAssetUrl: (url: string) => void;
    }) => HTMLElement | void;
  };
}
````
