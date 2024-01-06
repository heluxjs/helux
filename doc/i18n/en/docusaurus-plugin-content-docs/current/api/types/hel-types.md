---
sidebar_position: 0
---

# helTypes

helTypes 是用于描述 hel 相关各个包的基础类型

## 基础类型

### ISubApp

应用自身的类型描述，针对`helpack`有效的字段是非必备的，仅在用户搭建自己的元数据管理控台台，而非托管到 cdn 时，才需要实现这些字段的含义

```ts
interface ISubApp {
  id: number;
  /** app 名称，同时也是浏览器的访问入口凭证 */
  name: string;
  app_group_name: string;
  /** 当前线上正使用的版本 */
  online_version: string;
  /** 构建产生的最新版本 */
  build_version: string;
  /** 应用中文名 */
  cnname: string;
  /** 应用的仓库地址 */
  git_repo_url: string;
  create_at: string; // "2019-11-05T08:37:17.000Z"
  update_at: string; // "2019-11-05T08:37:17.000Z"
  create_by: string;
  desc: string;
  // ----------------- 以下属性目前针对 helpack 有效（如用户自搭后台需要也可复用），还在使用中，外部用户可不用关注 -------------
  /** 流水线构建时需要验证的token */
  token: string;
  /** 是否正在灰度中，每次流水线构建时如果 enable_gray 是1，则此值会设置为1 */
  is_in_gray: 1 | 0;
  /** 是否允许使用灰度功能 */
  enable_gray: 1 | 0;
  /** 如果是测试app的话，只下发给测试人员，此种模式的app永远只会将build_version下发给前端，其他xxx_version对于它来说都是冗余的 */
  is_test: 1 | 0;
  /** 是否置顶（即推荐） */
  is_top: 1 | 0;
  /** 是否允许蓝盾【海拉元数据模块提取】插件执行 */
  enable_pipeline: 1 | 0;
  /** 是否允许下发给 helpack 前台做展示 */
  enable_display: 1 | 0;
  /** 是否允许将构建版本（即灰度版本）发布为线上版本 */
  enable_build_to_online: 1 | 0;
  /** 托管在 helpack 渲染时，访问应用的开屏过度图 */
  splash_screen: string;
  /** 应用在 helpack 里展现的 logo url */
  logo: string;
  /** 项目id和版本映射关系，目前该配置仅作用于 helpack 模块管理台 */
  proj_ver: IProjVer;
  /** 是否在 helpack 前台渲染 */
  is_local_render: 1 | 0;
  additional_scripts: string[];
  additional_body_scripts?: string[];
  /** 负责人 */
  owners: string[];
  /** 灰度用户名单 */
  gray_users: string[];
  /** 应用的分类类型 */
  class_name: string;

  // ----------------- 以下属性描述目前针对 helpack 有效，后续可能计划全部下架，外部用户可不用关注 --------------
  api_host: string;
  /** 是否是富媒体类型应用 */
  is_rich: 1 | 0;
  /** 是否后端渲染 */
  is_back_render: 1 | 0;
  iframe_src_map: Record<string, string>;
  /** 【暂无用】原枚举有 'react-shadow' | 'react' | 'iframe' */
  render_mode: string;
  host_map: Record<string, string>;
  ui_framework: string;
  [key: string]: any;
}
```

### ISubAppVersion

应用的构建版本类型描述，针对`helpack`有效的字段是非必备的，仅在用户使用流水构建产物时才需要实现这些字段的含义

```ts
export interface ISubAppVersion {
  sub_app_id: string;
  /** 冗余存储的子应用名称，对应app_info表的name字段 */
  sub_app_name: string;
  /** 每次构建新生成的版本号 */
  sub_app_version: string;
  /** 开发或者测试版本调用api所属域名，不填写的会去读取app.host_map.build  */
  api_host: string;
  /**
   * 资源描述表map
   */
  src_map: ISrcMap;
  /** html entry 字符串，在 extractMode 为 all 或 build 时都会记录 */
  html_content: string;

  // ----------------- 以下属性描述目前针对 helpack 搭配的蓝盾流水线（抑或其他流水线）有效 --------------
  /** 触发构建时的 git 提交信息 */
  desc: string;
  /** 带时区的时间戳字符串，形如；2022-03-01T06:39:46.000Z */
  create_at: string;
  /** 触发构建的 rtx 名称 */
  create_by: string;
  /** 蓝盾空间名 */
  project_name: string;
  /** 蓝盾流水线id */
  pipeline_id: string;
  /** 蓝盾构建id */
  build_id: string;
  git_branch: string;
  /** 触发构建时的 git hash 值，如有多个会用 ',' 隔开 */
  git_hashes: string;
  /** 当次构建对应的仓库地址 */
  git_repo_url: string;
  /** 海拉插件版本号，记录当前应用是基于那一版插件构建的 */
  plugin_ver: string;
  [key: string]: any;
}
```

### ISrcMap

`ISubAppVersion['src_map']`的具体类型描述，描述的是构建产物的类型

````ts
export interface ISrcMap {
  /** index.html 入口文件地址 */
  htmlIndexSrc: string;
  /**
   * 产物的web目录名字，所有产物都会以这个目录作为根目录
   */
  webDirPath: string;
  /**
   * default: 'all'，生成资源清单时的元数据提取方式，会影响元数据的记录结果
   * ```
   * all：提取并记录构建时生成的产物、静态路径导入的产物、homePage之外相对路径导入的产物，同时也会记录 html_content
   * build：只提取并记录构建时生成的产物，同时也会记录 html_content
   * all_no_html：提取并记录构建时生成的产物、静态路径导入的产物、homePage之外相对路径导入的产物，不记录 html_content
   * build_no_html：只提取并记录构建时生成的产物，不记录 html_content
   * ```
   */
  extractMode?: 'all' | 'build' | 'all_no_html' | 'build_no_html';
  /**
   * 应用首屏加载时需要插入到 document.head 里的资源列表
   */
  headAssetList: IAssetItem[];
  /**
   * 应用首屏加载时需要插入到 document.body 里的资源列表
   */
  bodyAssetList: IAssetItem[];
  /**
   * 所有依据 homePage 构建生成的 js 列表
   */
  chunkJsSrcList: string[];
  /**
   * 所有依据 homePage 构建生成的 css 列表
   */
  chunkCssSrcList: string[];
  /**
   * 所有绝对路径导入的 homePage 之外的 js 列表，在 extractMode 为 all 或 all_no_html 时才会记录
   */
  staticJsSrcList: string[];
  /**
   * 所有绝对路径导入的 homePage 之外的 css 列表，在 extractMode 为 all 或 all_no_html 时才会记录
   */
  staticCssSrcList: string[];
  /**
   * 所有相对路径导入的 homePage 之外的 js 列表，在 extractMode 为 all 或 all_no_html 时才会记录
   */
  relativeJsSrcList: string[];
  /**
   * 所有相对路径导入的 homePage 之外的 css 列表，在 extractMode 为 all 或 all_no_html 时才会记录
   */
  relativeCssSrcList: string[];
  /**
   * 所有依据 homePage 构建生成的其他类型的资源文件列表
   */
  otherSrcList: string[];
}
````

## 其他类型

### 相关补充类型

```ts
/**
 * 实例化 MicroApp 时，如传递了 platform ， 则调用对应平台的 api，
 * 如未传递 platform ，则读取 initPlatform 设定的平台对应的 api，
 * 如未调用过 initPlatform 设定平台值，则默认调用 hel 平台的 api，
 * 3.0 之后不再限定 'hel' | 'unpkg'，支持后续 hel 包管理平台私有部署
 */

/** 平台值，如果用户不显示指定的话，优先取 helMicro.init 设定的平台值，未设定的话内网包默认为 hel，外网包默认为 unpkg */
export type Platform = string;

/**
 * api 请求方式，默认 jsonp
 * jsonp 跨域请求方便
 */
export type ApiMode = 'get' | 'jsonp';

/** 构建产生的 link 标签 */
export type TagLink = 'link';
/** 构建产生的 script 标签 */
export type TagScript = 'script';
/** 绝对路径导入的 homePage 之外的 link 标签，通常由cdn等文件服务提供 */
export type TagStaticLink = 'staticLink';
/** 绝对路径导入的 homePage 之外的 script 标签，通常由cdn等文件服务提供*/
export type TagStaticScript = 'staticScript';
/** 相对路径导入的 homePage 之外的 link 标签，通常由cdn等文件服务提供 */
export type TagRelativeLink = 'relativeLink';
/** 相对路径导入的 homePage 之外的 script 标签，通常由cdn等文件服务提供*/
export type TagRelativeScript = 'relativeScript';
/** 内联的 style 标签 */
export type TagStyle = 'style';

export type TagName = TagLink | TagScript | TagStaticLink | TagStaticScript | TagRelativeLink | TagRelativeScript | TagStyle;

/**
 * 这些标签类型默认不会被 sdk 加载，仅表示处于 html 代码里的位置
 * 除非显示标记 data-helappend="1" 会被加载，通常用于紧随主站点加载的私有化部署模式
 * 或显示标记 data-helex="xxx-link"，用于控制需要延迟加载的且只加载一次的 external 资源
 */
export type TagNoAppend = TagStaticLink | TagStaticScript | TagRelativeLink | TagRelativeScript;

export type ItemTag = TagLink | TagScript | TagStyle | TagNoAppend;

interface IAttrsBase {
  /** 动态字段，方便将来扩展存储其他属性，有 rel as crossorigin type 等 ... */
  [key: string]: string;
}

export interface ILinkAttrs extends IAttrsBase {
  href: string;
}

export interface IScriptAttrs extends IAttrsBase {
  src: string;
}

export interface IAssetItemBase {
  /**
   * default: true
   * 是否追加当前资源到dom文档树
   */
  append?: boolean;
  innerText?: string;
}

export interface ILinkItem extends IAssetItemBase {
  tag: TagLink;
  attrs: ILinkAttrs;
}

export interface IStaticLinkItem extends IAssetItemBase {
  tag: TagStaticLink;
  attrs: ILinkAttrs;
}

export interface IRelativeLinkItem extends IAssetItemBase {
  tag: TagRelativeLink;
  attrs: ILinkAttrs;
}

export interface IScriptItem extends IAssetItemBase {
  tag: TagScript;
  attrs: IScriptAttrs;
}

export interface IStaticScriptItem extends IAssetItemBase {
  tag: TagStaticScript;
  attrs: IScriptAttrs;
}

export interface IRelativeScriptItem extends IAssetItemBase {
  tag: TagRelativeScript;
  attrs: IScriptAttrs;
}

export interface IStyleItem extends IAssetItemBase {
  tag: TagStyle;
  attrs: IAttrsBase;
}

export type IAssetItem =
  | ILinkItem
  | IScriptItem
  | IStaticLinkItem
  | IStaticScriptItem
  | IRelativeLinkItem
  | IRelativeScriptItem
  | IStyleItem;
export type IAssetItemAttrs = ILinkAttrs | IScriptAttrs | IAttrsBase;

export interface IProjVer {
  /** o: online_version, b: build_version */
  map: Record<string, { o: string; b: string }>;
  /** proj_ver 数据节点的更新时间，后台还会此值来预防更新冲突 */
  utime: number;
}

export interface IAppRenderInfo {
  name: string;
  version: string;
  additionalScripts?: string[];
  additionalBodyScripts?: string[];
  srcMap: ISrcMap;
}

export interface IEmitAppInfo {
  platform: string;
  appName: string;
  appGroupName: string;
  versionId: string;
  /** 通过 libReady 发射的数据 */
  isLib: boolean;
  Comp: any;
  appProperties?: Record<string, any> | null;
  lifecycle?: {
    mount?: () => void;
    unmount?: () => void;
  };
}

export interface IEmitStyleInfo {
  platform: string;
  appName: string;
  versionId: string;
}
```
