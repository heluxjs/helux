import { noop } from '@helux/utils';
import { CLASS_ATOM } from '../consts';
import { atomx } from '../factory/createShared';
import { useAtomX } from '../hooks/useAtom';
import { useDerived } from '../hooks/useDerived';
import type { CoreApiCtx } from '../types/api-ctx';
import type { Fn, IAtomCtx, IBindAtomOptions, ICompAtomCtx } from '../types/base';

export type HX = { atom: ICompAtomCtx; atoms: Record<string, ICompAtomCtx>; deriveds: Record<string, any> };

type CompData = { hx: HX; err: any; key: any; isStrict: boolean };
// clousure data, fc(forceUpdateCalled), rc(renderCount)
type CData = { fc: boolean; rc: number };

export interface IInnerBindAtomOptions extends IBindAtomOptions {
  atomKey: string;
  atomKeys: string[];
  hx?: HX;
  rebuild?: boolean;
  onError?: Fn;
  fallback?: Fn;
  forClass?: boolean;
}

export interface IInnerWithAtomOptions extends IInnerBindAtomOptions {
  isPropsProxy?: boolean;
}

let dAtomCtx: IAtomCtx;
function getDefaultAtom(apiCtx: CoreApiCtx) {
  if (!dAtomCtx) {
    dAtomCtx = atomx(apiCtx, { tip: 'default atom' }, { moduleName: 'DefaultClassAtom' });
  }
  return dAtomCtx;
}

function getDefaultHX() {
  return { atom: {}, atoms: {}, deriveds: {} } as HX;
}

let RH: any = null;
export function getRH(apiCtx: CoreApiCtx) {
  const { Component } = apiCtx.react;
  if (RH) {
    return RH;
  }
  RH = class RebuildHelper extends Component<any> {
    public state = {};
    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
      this.props.onError(error, errorInfo);
    }

    render() {
      // @ts-ignore
      return this.state.hasError ? null : this.props.children;
    }
  };

  return RH;
}

export function renderFallback(apiCtx: CoreApiCtx, err?: any, info?: any) {
  if (info) {
    console.error(info);
  }
  return apiCtx.react.createElement('span', {}, `HeluxAtomComp render error: ${err?.message || 'error occurred'}`);
}

export function ClassRenderer(props: { renderUI: Fn }) {
  return props.renderUI();
}

export function mergeAtoms(apiCtx: CoreApiCtx, options?: IBindAtomOptions) {
  // 未透传 atom 的话，给一个空的 atom 对象，用于保证 hx.atom 运行时不出 undefined 的情况
  const dAtomCtx = getDefaultAtom(apiCtx);
  const { atom = dAtomCtx.state, atomOptions, atoms = {}, atomsOptions = {} } = options || {};

  // 用户可能透传的 atom 和 atoms 里某一个 atom 是同一个对象，这里优化一下，
  // 避免这种因独立 atom 和 atoms 里重复时，存在根值依赖导致重复渲染问题（根因是对同一个 atom 对象调用了两次 useAtom ）
  let atomKey = CLASS_ATOM as unknown as string;
  let singleAtom = atom;
  Object.keys(atoms).forEach((key) => {
    if (atoms[key] === atom) {
      atomKey = key;
      singleAtom = atoms[key];
    }
  });

  const targetAtoms = Object.assign({ [atomKey]: singleAtom, ...atoms });
  const targetAtomsOptions = Object.assign({ [atomKey]: atomOptions, ...atomsOptions });
  const atomKeys = Object.keys(atoms) as string[];
  if (!atomKeys.includes(atomKey)) {
    atomKeys.push(atomKey);
  }

  return { atoms: targetAtoms, atomsOptions: targetAtomsOptions, atomKeys, atomKey };
}

export function makeAtomFnComp(apiCtx: CoreApiCtx, UIComp: any, options: IInnerBindAtomOptions) {
  const {
    atomKey,
    atomKeys,
    atoms = {},
    atomsOptions = {},
    deriveds = {},
    derivedsOptions = {},
    // 透传的 hx 可让类组件上的 props.hx 是一个稳定引用
    hx: outHX,
    rebuild,
    onError = noop,
    fallback = (err: Error, info: any) => renderFallback(apiCtx, err, info),
    forClass,
  } = options;
  const { react, hookImpl } = apiCtx;
  const { createElement, useRef } = react;
  const { useForceUpdate, useIsStrict } = hookImpl;
  // 对于 HeluxClass 来说，每次都是新建的 AtomComp，两者时一一对应的，
  // 故此处的闭包数据是安全的，不会造成内存泄漏
  const cdata: CData = { fc: false, rc: 0 };

  const mayClearErr = (cdata: CData, isStrict: boolean, data: CompData) => {
    if (!cdata.fc) {
      return;
    }
    // err 用一次就清理一次，方便反复尝试执行重建逻辑
    if (isStrict) {
      // 此处用 rc % 2 来抵消严格模式下双掉用导致的一直渲染子组建一直抛出错误的死循环
      // 一次 forceUpdate 触发 一次 fallback + 一次 UIComp，造成死循环
      cdata.rc += 1;
      if (cdata.rc % 2 === 0) {
        data.err = null;
      }
    } else {
      data.err = null;
    }
  };

  return function AtomComp(props: any) {
    const dataRef = useRef<CompData>({ hx: outHX || getDefaultHX(), err: null, key: Date.now(), isStrict: false });
    const forceUpdate = useForceUpdate();
    useIsStrict((isStrict) => (dataRef.current.isStrict = isStrict));

    const { hx, key, err, isStrict } = dataRef.current;
    const handleError = (error: any, info: any) => {
      dataRef.current.key = Date.now(); // 换 key 后才能替换掉崩溃的视图
      dataRef.current.err = { error, info };
      if (rebuild) {
        cdata.fc = true;
        forceUpdate();
      } else {
        onError(error, info);
      }
    };

    atomKeys.forEach((key) => {
      const atom = atoms[key];
      // eslint-disable-next-line
      const atomCtx = useAtomX(apiCtx, atom, atomsOptions[key]);
      if (atomKey === key) {
        Object.assign(hx.atom, atomCtx);
      }
      hx.atoms[key] = atomCtx;
    });

    Object.keys(deriveds).forEach((key) => {
      const result = deriveds[key];
      const options = { ...(derivedsOptions[key] || {}) };
      // eslint-disable-next-line
      const resultTuple = useDerived(apiCtx, result, options);
      hx.deriveds[key] = resultTuple;
    });

    // 由 HeluxClass 生成 AtomComp 时，UIComp 为 ClassRender，只需透传 props: { renderUI: fn } 即可
    const passProps = forClass ? props : { ...props, hx };
    let ui = createElement(UIComp, passProps);
    if (rebuild) {
      const RebuildHeper = getRH(apiCtx);
      if (err) {
        ui = fallback(err.error, err.info);
      }
      mayClearErr(cdata, isStrict, dataRef.current);

      return createElement(RebuildHeper, { key, onError: handleError }, ui);
    }

    return ui;
  };
}
