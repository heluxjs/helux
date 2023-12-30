!(function () {
  'use strict';
  var qf = Object.defineProperty;
  var Su = Object.getOwnPropertySymbols;
  var el = Object.prototype.hasOwnProperty,
    rl = Object.prototype.propertyIsEnumerable;
  var Au = (ue, J, w) => (J in ue ? qf(ue, J, { enumerable: !0, configurable: !0, writable: !0, value: w }) : (ue[J] = w)),
    Eu = (ue, J) => {
      for (var w in J || (J = {})) el.call(J, w) && Au(ue, w, J[w]);
      if (Su) for (var w of Su(J)) rl.call(J, w) && Au(ue, w, J[w]);
      return ue;
    };
  (self.webpackChunkhelux_docs = self.webpackChunkhelux_docs || []).push([
    [643],
    {
      96643: function (ue, J, w) {
        w.r(J),
          w.d(J, {
            $: function () {
              return Af;
            },
            EVENT_NAME: function () {
              return Xf;
            },
            LIMU_VER: function () {
              return Jf;
            },
            RECORD_LOADING: function () {
              return Wf;
            },
            VER: function () {
              return zf;
            },
            action: function () {
              return gf;
            },
            addMiddleware: function () {
              return Bf;
            },
            addPlugin: function () {
              return jf;
            },
            atom: function () {
              return Yc;
            },
            atomx: function () {
              return Vc;
            },
            block: function () {
              return mf;
            },
            createShared: function () {
              return $c;
            },
            defineDeriveFnItem: function () {
              return Wc;
            },
            defineDeriveTask: function () {
              return Xc;
            },
            derive: function () {
              return Bc;
            },
            deriveDict: function () {
              return jc;
            },
            dynamicBlock: function () {
              return Sf;
            },
            emit: function () {
              return If;
            },
            flush: function () {
              return wf;
            },
            getActionLoading: function () {
              return $f;
            },
            getAtom: function () {
              return Hf;
            },
            getDeriveLoading: function () {
              return Yf;
            },
            getMutateLoading: function () {
              return Uf;
            },
            getRawState: function () {
              return Vf;
            },
            getSnap: function () {
              return Gf;
            },
            isAtom: function () {
              return Pf;
            },
            isDerivedAtom: function () {
              return kf;
            },
            isDiff: function () {
              return Lf;
            },
            model: function () {
              return Ff;
            },
            modelFactory: function () {
              return bf;
            },
            mutate: function () {
              return Ef;
            },
            mutateDict: function () {
              return _f;
            },
            on: function () {
              return Cf;
            },
            produce: function () {
              return xf;
            },
            reactiveDesc: function () {
              return Mf;
            },
            runDerive: function () {
              return zc;
            },
            runDeriveTask: function () {
              return Jc;
            },
            runMutate: function () {
              return Kf;
            },
            runMutateTask: function () {
              return Df;
            },
            shallowCompare: function () {
              return Nf;
            },
            share: function () {
              return Gc;
            },
            sharex: function () {
              return Hc;
            },
            signal: function () {
              return hf;
            },
            storeSrv: function () {
              return Of;
            },
            sync: function () {
              return Tf;
            },
            syncer: function () {
              return Rf;
            },
            useActionLoading: function () {
              return cf;
            },
            useAtom: function () {
              return Qc;
            },
            useAtomX: function () {
              return qc;
            },
            useDerived: function () {
              return rf;
            },
            useEffect: function () {
              return ff;
            },
            useGlobalForceUpdate: function () {
              return yf;
            },
            useGlobalId: function () {
              return nf;
            },
            useLayoutEffect: function () {
              return lf;
            },
            useLocalForceUpdate: function () {
              return pf;
            },
            useMutable: function () {
              return of;
            },
            useMutateLoading: function () {
              return sf;
            },
            useObject: function () {
              return vf;
            },
            useOnEvent: function () {
              return uf;
            },
            useReactive: function () {
              return ef;
            },
            useService: function () {
              return af;
            },
            useStable: function () {
              return df;
            },
            useWatch: function () {
              return tf;
            },
            watch: function () {
              return Zc;
            },
          });
        var Pr = {};
        w.r(Pr),
          w.d(Pr, {
            $: function () {
              return Mc;
            },
            EVENT_NAME: function () {
              return Oe;
            },
            LIMU_VER: function () {
              return $u;
            },
            RECORD_LOADING: function () {
              return rr;
            },
            VER: function () {
              return Qt;
            },
            action: function () {
              return Ka;
            },
            addMiddleware: function () {
              return ui;
            },
            addPlugin: function () {
              return ci;
            },
            atom: function () {
              return cc;
            },
            atomx: function () {
              return fc;
            },
            block: function () {
              return Fc;
            },
            createShared: function () {
              return Cc;
            },
            currentDraftRoot: function () {
              return Vi;
            },
            defineDeriveFnItem: function () {
              return bs;
            },
            defineDeriveTask: function () {
              return Fs;
            },
            derive: function () {
              return Fa;
            },
            deriveDict: function () {
              return Rs;
            },
            dynamicBlock: function () {
              return lu;
            },
            emit: function () {
              return vi;
            },
            flush: function () {
              return mt;
            },
            getActionLoading: function () {
              return js;
            },
            getAtom: function () {
              return on;
            },
            getDeriveLoading: function () {
              return ns;
            },
            getMutateLoading: function () {
              return Hs;
            },
            getRawState: function () {
              return Ai;
            },
            getSnap: function () {
              return Ei;
            },
            isAtom: function () {
              return xe;
            },
            isDerivedAtom: function () {
              return he;
            },
            isDiff: function () {
              return Ic;
            },
            mutate: function () {
              return wa;
            },
            mutateDict: function () {
              return Pa;
            },
            on: function () {
              return pi;
            },
            produce: function () {
              return X.Uy;
            },
            reactiveDesc: function () {
              return Hn;
            },
            runDerive: function () {
              return qo;
            },
            runDeriveTask: function () {
              return es;
            },
            runMutate: function () {
              return Ca;
            },
            runMutateTask: function () {
              return Ma;
            },
            shallowCompare: function () {
              return bc;
            },
            share: function () {
              return Lt;
            },
            sharex: function () {
              return sc;
            },
            signal: function () {
              return du;
            },
            storeSrv: function () {
              return Zs;
            },
            sync: function () {
              return lc;
            },
            syncer: function () {
              return dc;
            },
            useActionLoading: function () {
              return Xs;
            },
            useAtom: function () {
              return ka;
            },
            useAtomX: function () {
              return ws;
            },
            useDerived: function () {
              return Pt;
            },
            useGlobalForceUpdate: function () {
              return Ua;
            },
            useGlobalId: function () {
              return Gs;
            },
            useLocalForceUpdate: function () {
              return Ga;
            },
            useMutable: function () {
              return Ha;
            },
            useMutateLoading: function () {
              return Bs;
            },
            useOnEvent: function () {
              return Ws;
            },
            useReactive: function () {
              return Ba;
            },
            useService: function () {
              return Js;
            },
            useWatch: function () {
              return qs;
            },
            watch: function () {
              return ms;
            },
          });
        function U(e, r) {
          e.includes(r) || e.push(r);
        }
        function ie(e, r) {
          const t = e.indexOf(r);
          t >= 0 && e.splice(t, 1);
        }
        function Qe(e) {
          return Array.from(new Set(e));
        }
        function Yt(e, r) {
          let t = !1;
          for (const n of e)
            if (r.includes(n)) {
              t = !0;
              break;
            }
          return t;
        }
        function Vt(e, r) {
          let t = '';
          const n = e.length;
          for (let a = 0; a < n; a++) {
            const u = e[a];
            if (r.startsWith(u)) {
              t = u;
              break;
            }
          }
          return t;
        }
        function de(e, r) {
          if (!e) return [];
          const t = e(r);
          return Array.isArray(t) ? t : [t];
        }
        var ve = (function () {
            if (typeof globalThis != 'undefined') return globalThis;
            if (typeof global != 'undefined') return global;
            if (typeof window != 'undefined') return window;
            if (this !== void 0) return this;
            throw new Error('no globalThis');
          })(),
          Gt = !1;
        function N(...e) {}
        var _u = N;
        function Ku(...e) {
          return e;
        }
        function Re(...e) {
          return [];
        }
        function tl(...e) {}
        var Du = Object.prototype.toString,
          Tu = '[object Map]';
        function kr(e) {
          return Du.call(e) === Tu;
        }
        function Ht(e) {
          return e === Number.MAX_SAFE_INTEGER;
        }
        function pe() {
          return !(!Gt && ve.name !== 'previewFrame' && !ve.BrowserFS);
        }
        function Z(e) {
          return e && typeof e == 'object' && !Array.isArray(e);
        }
        function Bt(e) {
          return e && typeof e == 'object';
        }
        function $(e) {
          return typeof e == 'function';
        }
        function nl(e) {
          return Gt ? Object.prototype.toString.call(e) === '[object AsyncFunction]' : !0;
        }
        function Or(e) {
          return typeof e == 'symbol';
        }
        function Nr(e) {
          if (!e) return !1;
          const r = typeof e;
          return (r === 'object' || r === 'function') && $(e.then);
        }
        function al(e) {
          try {
            return e.test, !1;
          } catch (r) {
            return !0;
          }
        }
        function we() {
          return typeof Proxy == 'function';
        }
        function ye(e, r) {
          var c;
          const {
            throwErr: t = !1,
            prefixLabel: n = '',
            suffixLabel: a = ', see details in console.',
            logErr: u = !0,
            alertErr: i,
          } = r || {};
          let o = e,
            s = !1;
          if (
            (e instanceof Error && ((s = !0), (o = e.message)),
            (i != null ? i : pe()) && e && ((c = ve.alert) == null || c.call(ve, `${n}${o}${a}`)),
            u && console.error(e),
            t)
          )
            throw s ? e : new Error(String(e));
        }
        function Fe(e, r = 0) {
          r === 0 ? (console.error(e), pe() && console.trace(e)) : r === 1 ? console.error(e) : console.warn(e);
        }
        function Pe(e) {
          return Ht(e) ? 1 : e + 1;
        }
        var Ru = !!Reflect,
          Fu = Object.prototype.hasOwnProperty;
        function bu(e, r) {
          return Ru ? Reflect.has(e, r) : Fu.call(e, r);
        }
        function ke(e, r, t) {
          let n = e[r];
          return n || (n = e[r] = t), n;
        }
        function qe(e, r, t) {
          let n = e.get(r);
          return n || (e.set(r, t), (n = t)), n;
        }
        function jt(e, r) {
          let t = '';
          for (const n in e)
            if (r.startsWith(n)) {
              t = n;
              break;
            }
          return t;
        }
        function Xt(e, r) {
          const t = e.get(r);
          if (t !== void 0) return t;
          const n = e.get(Number(r) || r);
          return n !== void 0 ? n : void 0;
        }
        function ge(e, r) {
          let t,
            n = e;
          return (
            r.forEach((a) => {
              (t = kr(n) ? Xt(n, a) : n[a]), (n = t);
            }),
            t
          );
        }
        function Wt(e, r, t) {
          let n = e;
          const a = r.length - 1;
          r.forEach((u, i) => {
            const o = kr(n);
            if (i === a) return void (o ? n.set(u, t) : (n[u] = t));
            n = o ? Xt(n, u) : n[u];
          });
        }
        function Iu() {
          return Fe('changing shared state is invalid'), !0;
        }
        function ul(e) {
          return e;
        }
        function Lr(e, r) {
          return `${r}/${e}`;
        }
        function xr(e) {
          return e && we();
        }
        var Cu = w(70125),
          Q = w.n(Cu),
          Mu = w(39114),
          D = w.n(Mu),
          wu = Object.defineProperty,
          Ur = {};
        ((e, r) => {
          for (var t in r) wu(e, t, { get: r[t], enumerable: !0 });
        })(Ur, {
          useEffect: () => Nu,
          useEffectLogic: () => Yr,
          useForceUpdate: () => zt,
          useLayoutEffect: () => Ou,
          useObject: () => xu,
          useObjectLogic: () => Zt,
          useStable: () => Jt,
        });
        var Pu = 0,
          er = new Map(),
          $r = 0;
        function ku(e, r) {
          const t = () => {
            const n = r();
            return () => {
              er.delete(e), n && n();
            };
          };
          if (
            ((function (n) {
              $r || ($r = n);
            })(e),
            (function (n) {
              const a = er.get(n);
              a ? (a.count += 1) : er.set(n, { count: 1 });
            })(e),
            $r % 2 != 0)
          )
            return t();
          {
            const n = (function (a) {
              return er.get(a);
            })(e);
            if (n && n.count > 1) return t();
          }
        }
        function Yr(e, r, t) {
          const { useState: n, useLayoutEffect: a, useEffect: u } = e.react,
            { isLayout: i, deps: o } = t,
            [s] = n(() => ++Pu);
          (i ? a : u)(() => ku(s, r), o);
        }
        function Ou(e, r, t) {
          Yr(e, r, { isLayout: !0, deps: t });
        }
        function Nu(e, r, t) {
          Yr(e, r, { deps: t });
        }
        function zt(e) {
          const [, r] = e.react.useState({});
          return () => r({});
        }
        function Lu(e) {
          const { data: r } = e.current;
          $(r)
            ? (e.current.wrap = (...t) => e.current.data(...t))
            : Z(r)
            ? (e.current.wrap = (function (t, n) {
                if (!we()) {
                  const u = {};
                  return (
                    Object.keys(t).forEach((i) => {
                      const o = t[i];
                      $(o)
                        ? (u[i] = (...s) => n.current.data[i](...s))
                        : Object.defineProperty(u, i, {
                            get: () => n.current.data[i],
                            set(s) {
                              n.current.data[i] = s;
                            },
                          });
                    }),
                    u
                  );
                }
                const a = {};
                return new Proxy(t, {
                  get(u, i) {
                    const o = u[i];
                    return $(o) ? ke(a, i, (...s) => n.current.data[i](...s)) : o;
                  },
                });
              })(r, e))
            : (e.current.wrap = r);
        }
        function Jt(e, r) {
          const { useRef: t, useMemo: n } = e.react,
            a = t({ data: r, wrap: {}, inited: !1 });
          return (a.current.data = n(() => r, [r])), a.current.inited || (Lu(a), (a.current.inited = !0)), a.current.wrap;
        }
        function Zt(e, r, t, n) {
          const { useState: a, useRef: u, useEffect: i } = e.react,
            [o] = a(r),
            s = zt(e),
            c = u({ state: null, unmount: !1, shouldCopy: !0 }),
            f = Jt(e, {
              setState(l) {
                const d = c.current;
                if (d.unmount) return;
                let v;
                const { state: y } = d;
                t
                  ? ((v = t(l, d.state || o)), n && v ? ((d.state = v), (d.shouldCopy = !1)) : (d.shouldCopy = !0))
                  : ((v = ($(l) ? l(y) : l) || {}), (d.shouldCopy = !0)),
                  Object.assign(o, v || {}),
                  s();
              },
              getLatestState() {
                const l = c.current;
                return l.shouldCopy && ((l.state = Eu({}, o)), (l.shouldCopy = !1)), l.state;
              },
            });
          return (
            i(() => {
              const l = c.current;
              return (
                (l.unmount = !1),
                () => {
                  l.unmount = !0;
                }
              );
            }, [c]),
            [o, f.setState, f]
          );
        }
        function xu(e, r) {
          return Zt(e, r);
        }
        function Uu(e) {
          const r = {},
            t = { react: e },
            n = Ur;
          return (
            Object.keys(Ur).forEach((a) => {
              r[a] = n[a].bind(null, t);
            }),
            r
          );
        }
        var X = w(18636),
          Qt = '3.5.21',
          $u = X.TT,
          Oe = { ON_DATA_CHANGED: 'ON_DATA_CHANGED', ON_SHARE_CREATED: 'ON_SHARE_CREATED', ON_ERROR_OCCURED: 'ON_ERROR_OCCURED' },
          rr = { NO: 'no', PRIVATE: 'private', GLOBAL: 'global' },
          qt = 0,
          en = Symbol,
          Yu = typeof en == 'function';
        function oe(e) {
          return Yu ? en(e) : ((qt += 1), '__HELUX_SYMBOL_'.concat(qt, '__'));
        }
        var Vu = '__proto__',
          Gu = we(),
          Hu = oe('HeluxUndefined'),
          rn = oe('HeluxMutateFnItem'),
          tr = oe('HeluxFnKey'),
          nr = oe('HeluxSharedKey'),
          tn = oe('HeluxReactiveMeta'),
          Vr = oe('HeluxIsBlock'),
          Ne = oe('HeluxIsAtom'),
          ar = oe('HeluxIsDerivedAtom'),
          ur = [nr, Ne, ar, Vr],
          ir = 'SingleMutate',
          Bu = 'HeluxGlobalLoading',
          ju = 6,
          Xu = !0,
          nn = 2e3,
          Wu = 20,
          Le = '1',
          Gr = '2',
          or = 1,
          sr = 2,
          an = 3,
          be = '|',
          cr = { TASK: 'task', MAY_TRANSFER: 'may_transfer' },
          te = { STATIC: 'static', HOOK: 'hook' },
          q = {
            USER_STATE: 'user_state',
            GLOGAL_EMPTY: 'global_empty',
            GLOGAL_LOADING: 'global_loading',
            PRIVATE_LOADING: 'private_loading',
          },
          zu = 'derive',
          un = 'watch',
          fr = 'Object',
          Ju = 'Map',
          Zu = 'Array',
          Qu = 'Other',
          G = { SET_STATE: 'SetState', MUTATE: 'Mutate', ACTION: 'Action', REACTIVE: 'Reactive', LOADING: 'Loading', SYNC: 'Sync' };
        function xe(e) {
          var r;
          return e && (r = e[Ne]) !== null && r !== void 0 ? r : !1;
        }
        function he(e) {
          return (e && e[ar]) || !1;
        }
        function on(e) {
          return xe(e) || he(e) ? e.val : e;
        }
        function qu() {
          return {
            keySeed: { static: 0, hook: 0, Reactive: 0, Mutate: 0 },
            runningFnKey: '',
            runningSharedKey: 0,
            isIgnore: !1,
            depKeys: [],
            GID_INSKEYS_MAP: new Map(),
            FNKEY_STATIC_CTX_MAP: new Map(),
            FNKEY_HOOK_CTX_MAP: new Map(),
            DEPKEY_FNKEYS_MAP: new Map(),
            UNMOUNT_INFO_MAP: new Map(),
            DEPKEY_COMPUTING_FNKEYS_MAP: new Map(),
          };
        }
        function ei() {
          return {
            keySeed: 0,
            keyPrefix: 0,
            initCount: 0,
            mountedCount: 0,
            latest: { val: null, stateOrResult: null, sharedKey: 0, depKey: '', keyPath: [], isDerivedResult: !1, isDerivedAtom: !1 },
            runningKey: '',
            isDynamic: !1,
            KEY_CTX_MAP: new Map(),
            KEY_DYNAMIC_CTX_MAP: new Map(),
          };
        }
        function ri() {
          return { keySeed: 0, UNMOUNT_INFO_MAP: new Map() };
        }
        function ti() {
          return {
            keySeed: 0,
            SHARED_KEY_STATE_MAP: new Map(),
            STATE_SHARED_KEY_MAP: new Map(),
            INTERMAL_MAP: new Map(),
            COMPARE_MAP: new Map(),
            isStateChanged: !1,
          };
        }
        function sn() {
          var e = {};
          return {
            on: function (t, n) {
              var a = ke(e, t, []);
              a.push(n);
            },
            emit: function (t) {
              for (var n = arguments.length, a = new Array(n > 1 ? n - 1 : 0), u = 1; u < n; u++) a[u - 1] = arguments[u];
              var i = e[t] || [];
              i.slice().forEach(function (o) {
                return o.apply(void 0, a);
              });
            },
            off: function (t, n) {
              var a = e[t] || [],
                u = a.findIndex(function (i) {
                  return i === n;
                });
              u >= 0 && a.splice(u, 1);
            },
            canEmit: function (t) {
              return e[t];
            },
          };
        }
        function cn() {
          var e = {
            VER: Qt,
            LIMU_VER: X.TT,
            rootState: {},
            setState: function (t, n) {
              var a = e.ctx.mod[t];
              if (!a) throw new Error('moduleName '.concat(t, ' not found'));
              a.setState(n);
            },
            ctx: {
              bus: sn(),
              userBus: sn(),
              mod: {},
              middlewares: [],
              plugins: [],
              sharedScope: ti(),
              fnScope: qu(),
              insScope: ri(),
              blockScope: ei(),
              markAtomMap: new Map(),
              renderSN: 0,
              globalLoading: null,
              globalLoadingInternal: null,
              globalEmpty: null,
              globalEmptyInternal: null,
            },
            legacyRoot: {},
          };
          return e;
        }
        var lr = {},
          fn = !1,
          ln = null;
        function j() {
          return lr.ctx || {};
        }
        function ni() {
          return lr;
        }
        function dn(e) {
          (lr = e.ROOT), (ln = e.api), (fn = e.inited);
        }
        function ai() {
          return { ROOT: lr, inited: fn, API: ln };
        }
        function ui(e) {
          var r = j(),
            t = r.middlewares;
          t.push(e);
        }
        function ii(e, r, t, n) {
          var a = j(),
            u = a.middlewares;
          if (u.length) {
            var i = {},
              o = e.sharedKey,
              s = e.moduleName,
              c = e.forAtom,
              f = function (v, y) {
                return (i[v] = y);
              },
              l = { forAtom: c, draftRoot: r, draft: t, sharedKey: o, moduleName: s, setData: f, data: i, idx: 0, sn: n };
            u.forEach(function (d, v) {
              d(D()(D()({}, l), {}, { idx: v }));
            });
          }
        }
        var Hr = Oe.ON_DATA_CHANGED,
          vn = Oe.ON_SHARE_CREATED,
          oi = Oe.ON_ERROR_OCCURED,
          si = [q.GLOGAL_LOADING, q.PRIVATE_LOADING];
        function ci(e) {
          var r = j(),
            t = r.plugins,
            n = r.bus;
          t.push(e);
          var a = {
            on: function (i, o) {
              return n.on(i, o);
            },
            onStateChanged: function (i) {
              return n.on(Hr, i);
            },
          };
          e.install(a);
        }
        function fi(e, r) {
          var t = j(),
            n = t.bus;
          if (n.canEmit(Hr)) {
            var a = r.from,
              u = r.desc,
              i = e.sharedKey,
              o = e.moduleName,
              s = e.snap,
              c = e.usefulName,
              f = e.stateType,
              l;
            si.includes(f)
              ? (l = ''.concat(c, '/setState'))
              : (l = ''
                  .concat(c, '@')
                  .concat(a || 'Api', '/')
                  .concat(u)),
              n.emit(Hr, { snap: s, sharedKey: i, moduleName: o, type: l });
          }
        }
        function li(e) {
          var r = j(),
            t = r.bus;
          if (t.canEmit(vn)) {
            var n = e.snap,
              a = e.sharedKey,
              u = e.moduleName,
              i = e.usefulName,
              o = ''.concat(i, '@FactoryApi/createShared');
            t.emit(vn, { snap: n, sharedKey: a, moduleName: u, type: o });
          }
        }
        function pn(e, r, t) {
          var n = j(),
            a = n.bus;
          if (!a.canEmit(r)) return !1;
          var u = e.sharedKey,
            i = e.moduleName;
          return a.emit(r, { moduleName: i, sharedKey: u, data: t }), !0;
        }
        function yn(e, r) {
          pn(e, oi, { err: r }) || (console.warn('found uncaught error, sugguest add a plugin to handle this error'), console.error(r));
        }
        function di() {
          var e = j(),
            r = e.userBus;
          return r;
        }
        function vi(e) {
          for (var r = j(), t = r.userBus, n = arguments.length, a = new Array(n > 1 ? n - 1 : 0), u = 1; u < n; u++)
            a[u - 1] = arguments[u];
          t.emit.apply(t, [e].concat(a));
        }
        function pi(e, r) {
          var t = j(),
            n = t.userBus;
          return (
            n.on(e, r),
            function () {
              return n.off(e, r);
            }
          );
        }
        function yi(e, r) {
          return (e.__proto__ = r), e;
        }
        function gi(e, r) {
          for (var t in r) Object.prototype.hasOwnProperty.call(e, t) || (e[t] = r[t]);
          return e;
        }
        var Br = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? yi : gi);
        function hi(e) {
          var r = Object.create(null);
          return Br(r, D()({}, Object.prototype)), e && Object.assign(r, e), r;
        }
        function gn(e) {
          if (!$(e)) {
            var r = Object.create(null);
            return Br(r, Object.prototype), Br(e, r), e;
          }
        }
        function hn(e, r, t) {
          return (e[r] = t), !0;
        }
        function mn(e, r) {
          return e[r];
        }
        function Ue(e, r) {
          var t = r || {},
            n = t.set,
            a = n === void 0 ? hn : n,
            u = t.get,
            i = u === void 0 ? mn : u,
            o = t.obj,
            s = o === void 0 ? {} : o;
          return (
            Object.keys(e).forEach(function (c) {
              Object.defineProperty(s, c, {
                enumerable: !0,
                configurable: !1,
                set: function (l) {
                  return a(e, c, l);
                },
                get: function () {
                  return i(e, c);
                },
              });
            }),
            s
          );
        }
        function me(e, r) {
          var t = r || {},
            n = t.set,
            a = n === void 0 ? hn : n,
            u = t.get,
            i = u === void 0 ? mn : u;
          if (we())
            return new Proxy(e, {
              set: function (f, l, d) {
                return a(f, l, d);
              },
              get: function (f, l) {
                return i(f, l);
              },
            });
          var o = hi(),
            s = Ue(o, { obj: o, set: a, get: i });
          return s;
        }
        var $e = j();
        function dr(e) {
          var r = j(),
            t = r[e];
          return ($e[e] = t), t;
        }
        function ee() {
          return $e.blockScope || dr('blockScope');
        }
        function H() {
          return $e.fnScope || dr('fnScope');
        }
        function se() {
          return $e.sharedScope || dr('sharedScope');
        }
        function Sn() {
          return $e.insScope || dr('insScope');
        }
        function jr() {
          var e = se(),
            r = e.INTERMAL_MAP;
          return r;
        }
        function mi(e, r) {
          if (!(!e || !pe() || !r)) {
            var t = se(),
              n = t.INTERMAL_MAP,
              a = t.SHARED_KEY_STATE_MAP,
              u = t.STATE_SHARED_KEY_MAP,
              i = [],
              o = !1;
            if (
              (n.forEach(function (f) {
                f.moduleName === e && f.loc === r && f.stateType === q.USER_STATE && i.push(f.sharedKey);
              }),
              i.length > 1)
            ) {
              var s = i[0],
                c = n.get(s);
              n.delete(s), c && (a.delete(c.sharedKey), u.delete(c.rawState));
            }
            return o;
          }
        }
        function il(e, r) {
          var t = jr();
          return t.set(e, r), r;
        }
        function Ye(e) {
          var r = jr();
          return r.get(e);
        }
        function B(e) {
          var r = ce(e);
          return Ye(r);
        }
        function Si(e, r) {
          var t = jr(),
            n = ce(e);
          t.set(n, r);
        }
        function Ai(e) {
          var r = B(e);
          return r.rawState;
        }
        function Ei(e) {
          var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0,
            t = B(e);
          return r ? t.prevSnap : t.snap;
        }
        function ce(e) {
          return (e && (e[nr] || se().STATE_SHARED_KEY_MAP.get(e))) || 0;
        }
        function ol(e) {
          return !!getSharedScope().STATE_SHARED_KEY_MAP.get(e);
        }
        function _i(e) {
          var r = se(),
            t = r.STATE_SHARED_KEY_MAP,
            n = Pe(r.keySeed);
          return t.set(e, n), (r.keySeed = n), n;
        }
        function Ki(e, r) {
          var t = se(),
            n = t.SHARED_KEY_STATE_MAP,
            a = t.STATE_SHARED_KEY_MAP;
          n.set(e, r), a.set(r, e);
        }
        function Di(e) {
          return se().SHARED_KEY_STATE_MAP.get(e);
        }
        function Ti(e, r) {
          var t = ni(),
            n = t.rootState,
            a = t.ctx,
            u = r.moduleName,
            i = r.usefulName,
            o = n[i],
            s = B(o);
          if (u && s && s.loc !== r.loc) {
            var c = `
loc1:`
              .concat(
                s.loc,
                ` 
loc2:`,
              )
              .concat(r.loc);
            return Fe(
              'only-dev-mode tip: moduleName '.concat(u, ' duplicate! ')
                + 'this does not effect helux but the duplicated module will be ignored by devtool'
                + c,
            );
          }
          (n[i] = e), (a.mod[i] = B(e));
        }
        var Ri = { innerSetState: N };
        function An(e, r) {
          var t = e.rawState,
            n = e.forAtom,
            a = new Map(),
            u = {},
            i = {},
            o = [],
            s = D()({}, t),
            c = s;
          return (
            n && (c = t.val),
            D()(
              D()(D()({ ver: 0, sn: 0, reactive: t, reactiveRoot: t, sync: N, syncer: N, snap: s, prevSnap: s, rawStateVal: c }, e), r),
              {},
              {
                insCtxMap: a,
                key2InsKeys: u,
                id2InsKeys: i,
                recordId: function (l, d) {
                  if (l) {
                    var v = ke(i, l, []);
                    U(v, d);
                  }
                },
                delId: function (l, d) {
                  l && ie(i[l] || [], d);
                },
                recordDep: function (l, d) {
                  var v = ke(u, l, []);
                  U(v, d);
                },
                delDep: function (l, d) {
                  ie(u[l] || [], d);
                },
                mapInsCtx: function (l, d) {
                  a.set(d, l);
                },
                delInsCtx: function (l) {
                  a.delete(l);
                },
                extra: {},
                loadingInternal: Ri,
                level1ArrKeys: o,
              },
            )
          );
        }
        var Fi = w(11221),
          bi = w.n(Fi),
          Ii = w(79862),
          k = w.n(Ii),
          vr,
          Ci = ((vr = { Mutate: '', Reactive: 'r' }), k()(vr, te.STATIC, 's'), k()(vr, te.HOOK, 'h'), vr);
        function Mi() {
          var e = Sn(),
            r = Pe(e.keySeed);
          return (e.keySeed = r), r;
        }
        function wi() {
          var e = ee(),
            r = e.keySeed,
            t = e.keyPrefix,
            n = Pe(r);
          e.keySeed = n;
          var a = t;
          return Ht(r) && ((a = Pe(t)), (e.keyPrefix = a)), ''.concat(a, '_').concat(n);
        }
        function Pi() {
          var e = j(),
            r = e.renderSN,
            t = r === Number.MAX_VALUE ? 1 : r + 1;
          return (e.renderSN = t), t;
        }
        function Xr(e) {
          var r = Ci[e],
            t = H(),
            n = t.keySeed,
            a = Pe(n[e]);
          return (n[e] = a), ''.concat(r).concat(a);
        }
        function ki() {
          return Xr('Reactive');
        }
        var Oi = ['desc', 'fn', 'task', 'depKeys', 'writeKeys', 'deps', 'isFake', 'onlyDeps'],
          Ni = cr.MAY_TRANSFER,
          Li = G.SET_STATE,
          xi = G.REACTIVE,
          Ui = function () {
            return { isReplaced: !1, replacedValue: null };
          },
          $i = function () {},
          Yi = zr({ isFake: !0 });
        function En(e, r) {
          var t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : N,
            n = r.desc,
            a = n === void 0 ? '' : n,
            u = r.onRead,
            i = r.from,
            o = i === void 0 ? xi : i,
            s = r.depKeys,
            c = s === void 0 ? [] : s,
            f = r.isTop,
            l = f === void 0 ? !1 : f,
            d = r.expired,
            v = d === void 0 ? !1 : d;
          return {
            draft: e,
            finish: t,
            modified: !1,
            expired: v,
            sharedKey: 0,
            moduleName: '',
            hasFlushTask: !1,
            nextTickFlush: N,
            data: [],
            isTop: l,
            key: '',
            fnKey: '',
            depKeys: c,
            writeKeys: [],
            desc: a,
            onRead: u,
            from: o,
          };
        }
        function Wr(e) {
          var r = e.ids,
            t = r === void 0 ? [] : r,
            n = e.globalIds,
            a = n === void 0 ? [] : n,
            u = e.isReactive,
            i = u === void 0 ? !1 : u,
            o = e.from,
            s = o === void 0 ? Li : o,
            c = e.enableDep,
            f = c === void 0 ? !1 : c,
            l = e.handleCbReturn,
            d = l === void 0 ? !0 : l,
            v = e.sn,
            y = v === void 0 ? Pi() : v,
            p = e.isFirstCall,
            g = p === void 0 ? !1 : p,
            S = e.desc,
            h = S === void 0 ? '' : S;
          return {
            fnKey: '',
            depKeys: [],
            forcedDepKeys: [],
            triggerReasons: [],
            ids: t,
            globalIds: a,
            readKeys: {},
            writeKeys: {},
            arrKeyDict: {},
            writeKeyPathInfo: {},
            handleCbReturn: d,
            draftVal: null,
            from: s,
            isReactive: i,
            enableDep: f,
            sn: y,
            isFirstCall: g,
            desc: h,
          };
        }
        function Ve(e, r, t) {
          var n = t.isChanged,
            a = n === void 0 ? !0 : n,
            u = t.parentKeyPath,
            i = u === void 0 ? [] : u,
            o = t.op,
            s = o === void 0 ? 'set' : o,
            c = t.parentType,
            f = c === void 0 ? 'Object' : c,
            l = i.slice();
          return (
            l.push(e),
            {
              isChanged: a,
              isCustom: !1,
              op: s,
              immutBase: !1,
              key: e,
              value: r,
              proxyValue: r,
              parentType: f,
              keyPath: i,
              fullKeyPath: l,
              isBuiltInFnKey: !1,
              replaceValue: N,
              getReplaced: Ui,
            }
          );
        }
        function zr(e) {
          var r = e || {},
            t = r.desc,
            n = t === void 0 ? '' : t,
            a = r.fn,
            u = a === void 0 ? N : a,
            i = r.task,
            o = i === void 0 ? $i : i,
            s = r.depKeys,
            c = s === void 0 ? [] : s,
            f = r.writeKeys,
            l = f === void 0 ? [] : f,
            d = r.deps,
            v = d === void 0 ? Re : d,
            y = r.isFake,
            p = y === void 0 ? !1 : y,
            g = r.onlyDeps,
            S = g === void 0 ? !1 : g,
            h = bi()(r, Oi),
            m = D()(
              {
                fn: u,
                task: o,
                deps: v,
                oriDesc: '',
                onlyDeps: S,
                desc: n,
                depKeys: c,
                writeKeys: l,
                checkDeadCycle: void 0,
                watchKey: '',
                isFake: p,
              },
              h,
            );
          return m;
        }
        function _n() {
          var e = {
            fnKey: '',
            fn: N,
            subFnInfo: Yi,
            checkDeadCycle: !0,
            isFirstLevel: !0,
            isExpired: !1,
            task: N,
            deps: Re,
            status: { loading: !1, err: null, ok: !0 },
            forAtom: !1,
            remainRunCount: 0,
            showLoading: !1,
            nextLevelFnKeys: [],
            prevLevelFnKeys: [],
            mountStatus: or,
            depKeys: [],
            depSharedKeys: [],
            result: {},
            fnType: 'watch',
            returnUpstreamResult: !1,
            scopeType: 'static',
            renderStatus: Le,
            proxyResult: {},
            updater: N,
            createTime: Date.now(),
            shouldReplaceResult: !1,
            isAsync: !1,
            isAsyncTransfer: !1,
            isSimpleWatch: !1,
            isRunning: !1,
            dcErrorInfo: { err: null, tipFn: N },
            asyncType: Ni,
            subscribe: function (t) {
              t();
            },
            extra: {},
            setLoading: function (t) {
              var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null,
                a = !t && !n;
              e.status = { loading: t, err: n, ok: a };
            },
            renderInfo: {
              time: 0,
              insKey: 0,
              sn: 0,
              getDeps: function () {
                return e.depKeys.slice();
              },
            },
          };
          return e;
        }
        var Kn = { val: null, isFake: !0 },
          Dn = Wr({}),
          Jr = En(!0, { expired: !0 }),
          sl = zr(),
          Tn = An({ rawState: {}, forAtom: !1, usefulName: '' }, {}),
          Rn = _n(),
          pr = Kn,
          Zr = Dn,
          Fn = '',
          Qr = new Map(),
          qr = new Map(),
          et = new Map(),
          rt = N,
          tt = [],
          nt = '';
        function Vi() {
          return pr;
        }
        var Ge = {
            current: function () {
              return nt;
            },
            set: function (r) {
              return (nt = r);
            },
            del: function () {
              return (nt = '');
            },
          },
          at = {
            current: function () {
              return rt;
            },
            set: function (r) {
              return (rt = r);
            },
            del: function () {
              return (rt = N);
            },
          },
          He = {
            current: function (r) {
              return qr.get(r) || 'SetState';
            },
            set: function (r, t) {
              return qr.set(r, t);
            },
            del: function (r) {
              return qr.delete(r);
            },
          },
          Be = {
            current: function () {
              return tt;
            },
            set: function (r) {
              return (tt = r);
            },
            del: function () {
              return (tt = []);
            },
          },
          fe = {
            current: function () {
              return et.get(Fn) || Jr;
            },
            markUsing: function (r) {
              return (Fn = r);
            },
            set: function (r, t) {
              return et.set(r, t);
            },
            del: function (r) {
              return et.delete(r);
            },
          },
          ut = {
            current: function (r) {
              return Qr.get(r);
            },
            set: function (r, t) {
              return Qr.set(r, t);
            },
            del: function (r) {
              return Qr.delete(r);
            },
          },
          yr = {
            current: function () {
              return pr;
            },
            set: function (r) {
              return (pr = r);
            },
            del: function () {
              return (pr = Kn);
            },
          },
          it = {
            current: function () {
              return Zr;
            },
            set: function (r) {
              return (Zr = r);
            },
            del: function () {
              return (Zr = Dn);
            },
          };
        function ot(e) {
          var r = H(),
            t = r.FNKEY_STATIC_CTX_MAP,
            n = r.FNKEY_HOOK_CTX_MAP,
            a = e[0] === 's' ? t : n;
          return a;
        }
        function Gi(e, r) {
          var t = H(),
            n = t.DEPKEY_COMPUTING_FNKEYS_MAP,
            a = qe(n, e, []);
          a.push(r);
        }
        function Hi(e, r) {
          var t = H(),
            n = t.DEPKEY_COMPUTING_FNKEYS_MAP,
            a = n.get(e);
          a && ie(a, r);
        }
        function Bi(e) {
          var r = H(),
            t = r.DEPKEY_FNKEYS_MAP,
            n = e.depKeys,
            a = e.fnKey;
          n.forEach(function (u) {
            var i = t.get(u) || [];
            ie(i, a);
          });
        }
        function bn(e, r) {
          var t = H(),
            n = t.FNKEY_STATIC_CTX_MAP,
            a = e.fnKey,
            u = e.prevLevelFnKeys;
          u.forEach(function (i) {
            var o,
              s = (o = n.get(i)) === null || o === void 0 ? void 0 : o.nextLevelFnKeys;
            s && (r ? U(s, a) : ie(s, a));
          });
        }
        function ji() {
          var e = H(),
            r = e.FNKEY_HOOK_CTX_MAP;
          pe()
            && r.forEach(function (t) {
              t.isExpired = !0;
            });
        }
        function In(e, r, t) {
          var n = t || Xr(r);
          return $(e) ? (e[tr] = n) : (gn(e), (e.__proto__[tr] = n)), n;
        }
        function Cn(e) {
          return $(e) ? e[tr] || '' : (Z(e) && e.__proto__[tr]) || '';
        }
        function Se(e) {
          var r = ot(e);
          return r.get(e);
        }
        function st(e) {
          return ot(e).get(e) || Rn;
        }
        function je(e) {
          var r = Cn(e);
          return Se(r) || null;
        }
        function gr() {
          var e = H(),
            r = e.runningFnKey,
            t = e.depKeys,
            n = e.runningSharedKey,
            a = e.isIgnore,
            u = r ? Se(r) : null;
          return { fnCtx: u, depKeys: t, isIgnore: a, runningSharedKey: n };
        }
        function Xi() {
          return H().runningFnKey;
        }
        var Wi = w(71698),
          Xe = w.n(Wi),
          zi = q.USER_STATE;
        function Ji(e) {
          var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 8,
            t = '';
          if (pe() && e)
            try {
              throw new Error('loc');
            } catch (i) {
              var n = i.stack.split(`
`),
                a = n[1] || '';
              if (a.includes('webpack-internal') || a.includes('/node_modules/')) t = n.slice(0, 16).join(' -> ');
              else {
                var u = n.map(function (o) {
                  return o.substring(0, o.indexOf('(')).trim();
                });
                t = u.slice(4, r).join(' -> ');
              }
            }
          return t;
        }
        function Mn(e) {
          var r = e.split('/'),
            t = Q()(r, 2),
            n = t[0],
            a = t[1],
            u = a.split(be);
          return { sharedKey: Number(n), keyPath: u, depKey: e };
        }
        function wn(e) {
          var r = e.sharedKey,
            t = e.forAtom,
            n = t ? '/val' : '',
            a = t ? ['val'] : [];
          return { depKey: ''.concat(r).concat(n), keyPath: a, sharedKey: r };
        }
        function W(e, r) {
          try {
            return Lr(e.join(be), r);
          } catch (t) {
            return console.warn('found Symbol key in your path :', e), ''.concat(r);
          }
        }
        function Zi(e, r) {
          var t = e.snap,
            n = e.prevSnap,
            a = e.stateType;
          if (zi !== a) return !0;
          var u = Mn(r),
            i = u.keyPath;
          try {
            var o = ge(t, i),
              s = ge(n, i);
            return o !== s;
          } catch (c) {
            return !0;
          }
        }
        function Qi(e, r) {
          return we()
            ? (0, X.OA)(e, { onOperate: r, compareVer: !0 })
            : me(e, {
                get: function (n, a) {
                  var u = n[a],
                    i = Ve(a, u, { isChanged: !1, parentKeyPath: [] });
                  return r(i), u;
                },
              });
        }
        function qi(e, r) {
          if (r !== void 0) {
            if (e) return { val: r };
            if (Z(r)) return r;
          }
        }
        function eo(e, r, t) {
          var n = $(r) ? r(t) : r;
          return qi(e, n);
        }
        function hr(e, r) {
          var t = e.value;
          if (r) {
            r(e);
            var n = e.getReplaced(),
              a = n.replacedValue,
              u = n.isReplaced;
            u && (t = a);
          }
          return t;
        }
        function Pn(e) {
          return [Zu, Ju].includes(e);
        }
        function ro(e) {
          return Array.isArray(e) || kr(e);
        }
        var Ae = X.Eg.isObject,
          kn = X.Eg.getDataType;
        function cl(e) {
          return !isJsObj(e);
        }
        function On(e, r) {
          if (e === r) return e;
          var t = r.substring(e.length + 1),
            n = t.split(be);
          return ''.concat(e).concat(be).concat(n[0]);
        }
        function to(e, r) {
          var t = Vt(e, r);
          t || U(e, r);
        }
        var ct = new Map();
        function Nn(e, r) {
          var t = !1,
            n = e.depKey,
            a = e.keyPath,
            u = e.sharedKey,
            i = r.stopDepInfo,
            o = r.level1ArrKeys,
            s = r.recordCb,
            c = ct.get(n);
          if (c) return s(c), !0;
          var f = i.keys,
            l = i.isArrDict,
            d = i.depth,
            v = i.arrKeyStopDcit,
            y = i.stopArrDep,
            p = Vt(o, n),
            g = a.length > d;
          if (g || p) {
            var S = '',
              h = d;
            if (p) {
              h = d + 1;
              var m = v[p] === !1;
              m || (y && (g ? (S = W(a.slice(0, h), u)) : (S = On(p, n))));
            }
            return S || (S = W(a.slice(0, h), u)), p || ct.set(n, S), s(S), !0;
          }
          var E = String(u),
            T = Xe()(f),
            I;
          try {
            for (T.s(); !(I = T.n()).done; ) {
              var _ = I.value;
              if (!(!n.startsWith(_) || _ === E)) {
                var A = l[_],
                  F = A ? On(_, n) : _;
                A || ct.set(n, F), s(F), (t = !0);
                break;
              }
            }
          } catch (L) {
            T.e(L);
          } finally {
            T.f();
          }
          return t;
        }
        function ft(e, r) {
          var t = ee(),
            n = t.runningKey;
          if (n) {
            var a = t.KEY_DYNAMIC_CTX_MAP,
              u = t.KEY_CTX_MAP,
              i = t.isDynamic,
              o = i ? a : u,
              s = o.get(n);
            if (s) {
              var c = s.results,
                f = s.depKeys;
              r
                ? U(c, r)
                : e.forEach(function (l) {
                    return U(f, l);
                  });
            }
          }
        }
        function mr(e, r) {
          var t = se(),
            n = t.COMPARE_MAP,
            a = n.get(r);
          return a !== void 0
            ? a
            : e.sharedKeyStr === r
            ? t.isStateChanged
            : ((a = Zi(e, r)), n.set(r, a), a && (t.isStateChanged = !0), a);
        }
        function Ln(e, r, t) {
          if (r.includes(t) && mr(e, t)) return !0;
          var n = !1,
            a = Xe()(r),
            u;
          try {
            for (a.s(); !(u = a.n()).done; ) {
              var i = u.value;
              i.startsWith(t) && mr(e, i) && (n = !0);
            }
          } catch (o) {
            a.e(o);
          } finally {
            a.f();
          }
          return n;
        }
        function no() {
          var e = se();
          e.COMPARE_MAP.clear(), (e.isStateChanged = !1);
        }
        function lt() {
          var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0,
            r = H();
          r.isIgnore = e;
        }
        function Ie(e, r) {
          var t = gr(),
            n = t.fnCtx,
            a = t.depKeys,
            u = t.isIgnore,
            i = r.specificCtx || n;
          if (!i) {
            at.current()(e);
            return;
          }
          var o = H(),
            s = o.DEPKEY_FNKEYS_MAP,
            c = r.belongCtx,
            f = r.sharedKey;
          if ((f && U(i.depSharedKeys, f), n && c)) {
            (n.isFirstLevel = !1), c.isAsync && (n.isAsync = !0);
            var l = c.fnKey;
            U(i.prevLevelFnKeys, l), U(c.nextLevelFnKeys, n.fnKey);
          }
          var d = i.fnKey;
          e.forEach(function (v) {
            if (!(Vu === v || u)) {
              n && U(a, v);
              var y = qe(s, v, []);
              U(y, d);
            }
          });
        }
        function dt(e) {
          e
            && e.depKeys.forEach(function (r) {
              return Ie([r], { specificCtx: e });
            });
        }
        function xn(e) {
          var r = H(),
            t = r.FNKEY_HOOK_CTX_MAP,
            n = r.UNMOUNT_INFO_MAP,
            a = e.fnKey;
          t.set(a, e), bn(e, !0);
          var u = n.get(a);
          u ? (u.c = 2) : ((u = { c: 1, t: Date.now(), prev: 0 }), n.set(a, u));
          var i = u,
            o = i.c;
          if (o === 2) {
            var s = Se(a);
            dt(s);
          }
        }
        function Un(e) {
          var r = '';
          return (
            e.depSharedKeys.forEach(function (t) {
              var n,
                a = ((n = Ye(t)) === null || n === void 0 ? void 0 : n.ver) || 0;
              r += ''.concat(a, '_');
            }),
            r
          );
        }
        function ao(e, r, t) {
          var n = H(),
            a = n.DEPKEY_FNKEYS_MAP,
            u = a.get(r) || [],
            i = [],
            o = [];
          return (
            u.forEach(function (s) {
              var c = Se(s);
              if (c && Ln(e, c.depKeys, r)) {
                c.isFirstLevel && i.push(s), c.isAsync && o.push(s);
                var f = t[s];
                t[s] = f === void 0 ? 1 : f + 1;
              }
            }),
            { firstLevelFnKeys: i, asyncFnKeys: o }
          );
        }
        function vt(e) {
          Bi(e), bn(e);
        }
        function uo() {
          var e = H(),
            r = e.FNKEY_HOOK_CTX_MAP;
          if (r.size >= Wu) {
            var t = Date.now();
            r.forEach(function (n) {
              var a = n.mountStatus,
                u = n.createTime,
                i = n.fnKey;
              [or, an].includes(a) && t - u > nn && (vt(n), r.delete(i));
            });
          }
        }
        function pt(e, r, t, n, a) {
          var u = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : !1,
            i = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : !1,
            o = ee();
          o.latest = { sharedKey: e, val: r, stateOrResult: t, depKey: n, keyPath: a, isDerivedResult: u, isDerivedAtom: i };
        }
        function io() {
          var e = ee();
          return e.latest;
        }
        function $n(e) {
          var r = ee(),
            t = r.KEY_DYNAMIC_CTX_MAP,
            n = r.KEY_CTX_MAP,
            a = e ? t : n;
          return a;
        }
        function Yn() {
          return Fe('changing shared state is invalid'), !0;
        }
        function Sr(e, r, t, n, a) {
          return n === Ne ? (e ? r : !1) : n === nr ? t : a;
        }
        function yt(e, r, t) {
          e.replaceValue(Sr(e.keyPath.length === 0, r, t, e.key, e.value));
        }
        function oo(e) {
          var r = {},
            t = e.rawState,
            n = e.sharedKey,
            a = e.forAtom,
            u = e.onRead,
            i = e.isPrimitive,
            o = e.stopDepth,
            s = function (d, v) {
              var y = W(d, n);
              Ie([y], { sharedKey: n }), ft([y]), pt(n, v, r, y, d);
            };
          if (Gu)
            r = (0, X.OA)(t, {
              customKeys: ur,
              onOperate: function (d) {
                var v = d.isBuiltInFnKey,
                  y = d.isCustom;
                if (y) return yt(d, a, n);
                if (!v) {
                  var p = d.fullKeyPath,
                    g = hr(d, u);
                  s(p, g);
                }
              },
              compareVer: !0,
            });
          else {
            var c = function l(d, v, y) {
              return Ue(d, {
                set: Yn,
                get: function (g, S) {
                  var h = g[S];
                  if (ur.includes(S)) return Sr(v === 1, a, n, S, h);
                  var m = Ve(S, h, { isChanged: !1, parentKeyPath: y });
                  if (v < o && Ae(h)) return l(h, v + 1, m.fullKeyPath);
                  var E = hr(m, u);
                  return s(m.fullKeyPath, E), E;
                },
              });
            };
            r = c(t, 1, []);
          }
          var f = r;
          return (
            a
              && (i
                ? (f = t.val)
                : (f = me(t, {
                    set: Yn,
                    get: function (d, v) {
                      return r.val[v];
                    },
                  }))),
            Ki(n, r),
            { sharedRoot: r, sharedState: f }
          );
        }
        var Vn = null;
        function gt() {
          return Vn;
        }
        function so(e, r) {
          var t = j(),
            n = t.globalEmpty;
          if (!n) {
            var a = r({ apiCtx: e, rawState: {}, forGlobal: !0, stateType: q.GLOGAL_EMPTY }),
              u = a.state,
              i = B(u);
            (t.globalEmpty = u), (t.globalEmptyInternal = i);
          }
          return (Vn = n), n;
        }
        function ht(e) {
          var r = H(),
            t = r.GID_INSKEYS_MAP;
          return qe(t, e, []);
        }
        function co() {
          return j().globalEmptyInternal;
        }
        function Gn(e, r) {
          if (e) {
            var t = ht(e);
            U(t, r);
          }
        }
        function fo(e, r) {
          if (e) {
            var t = ht(e);
            ie(t, r);
          }
        }
        var lo = G.REACTIVE,
          We = new Map();
        function vo(e) {
          return !!(e && !e.expired && e.modified);
        }
        function po(e) {
          var r = e.sharedKey;
          (e.expired = !0), fe.del(e.key);
          var t = He.current(r);
          return He.del(r), e.finish(null, { desc: t });
        }
        function Hn(e, r) {
          var t = ce(e);
          return r && He.set(t, r), t;
        }
        function mt(e, r) {
          var t = ce(e);
          ze(t, r);
        }
        function yo() {
          var e = fe.current();
          e.isTop && ze(e.sharedKey, e.desc);
        }
        function ze(e, r) {
          var t = We.get(e);
          vo(t) && (r && He.set(e, r), po(t));
        }
        function go(e) {
          var r = We.get(e) || Jr;
          r.expired = !0;
        }
        function ho(e, r) {
          var t = We.get(e) || Jr;
          (t.modified = !0), t.nextTickFlush(r);
        }
        function Bn(e, r, t) {
          var n = e.sharedKey,
            a = We.get(n);
          if (!a || a.expired) {
            var u = r.from,
              i = u === void 0 ? lo : u,
              o = e.setStateFactory({ isReactive: !0, from: i, handleCbReturn: !1, enableDep: !0 }),
              s = o.finish,
              c = o.draftRoot,
              f = En(c, r, s);
            (f.key = ki()),
              (f.nextTickFlush = function (v) {
                var y = f.expired,
                  p = f.hasFlushTask;
                y || (f.data = [v]),
                  p
                    || ((f.hasFlushTask = !0),
                    Promise.resolve().then(function () {
                      var g = Q()(f.data, 1),
                        S = g[0];
                      ze(n, S);
                    }));
              }),
              (a = f),
              We.set(n, a),
              fe.set(a.key, a);
          }
          fe.markUsing(a.key), (a.fnKey = Ge.current());
          var l = a,
            d = l.draft;
          return { val: t ? d.val : d, meta: a };
        }
        function St(e, r) {
          var t = {},
            n = {},
            a = e.rawState,
            u = e.deep,
            i = e.forAtom,
            o = e.isPrimitive,
            s = e.sharedKey;
          if (xr(u)) {
            var c,
              f = ((c = {}), k()(c, nr, s), k()(c, Ne, i), c),
              l = function (p, g, S) {
                var h = Bn(e, r, p),
                  m = h.val;
                return (m[g] = S), !0;
              },
              d = function (p, g, S) {
                var h = S[g];
                if (h !== void 0) return h;
                var m = Bn(e, r, p),
                  E = m.val,
                  T = m.meta;
                return tn === g ? T : E[g];
              };
            if (
              ((t = new Proxy(a, {
                set: function (p, g, S) {
                  return l(!1, g, S);
                },
                get: function (p, g) {
                  return d(!1, g, f);
                },
              })),
              (n = t),
              i)
            ) {
              var v = D()(D()({}, f), {}, k()({}, Ne, !1));
              n = o
                ? a.val
                : new Proxy(a.val, {
                    set: function (p, g, S) {
                      return l(!0, g, S);
                    },
                    get: function (p, g) {
                      return d(!0, g, v);
                    },
                  });
            }
          } else (t = a), (n = a.val);
          return { draftRoot: t, draft: n };
        }
        function mo(e) {
          var r = Sn(),
            t = r.UNMOUNT_INFO_MAP,
            n = e.insKey,
            a = e.readMap,
            u = e.internal;
          u.mapInsCtx(e, n);
          var i = t.get(n);
          i ? ((i.c = 2), (i.prev = n - 1)) : ((i = { c: 1, t: Date.now(), prev: 0 }), t.set(n, i));
          var o = i,
            s = o.c;
          s === 2
            && Object.keys(a).forEach(function (c) {
              u.recordDep(c, n);
            });
        }
        function jn(e) {
          var r = e.readMap,
            t = e.insKey,
            n = e.internal;
          Object.keys(r).forEach(function (a) {
            return n.delDep(a, t);
          }),
            n.delInsCtx(t);
        }
        function So(e) {
          var r = e.canCollect,
            t = e.isFirstRender,
            n = e.currentDepKeys;
          if (!r) {
            t && (e.depKeys = n.slice());
            return;
          }
          e.depKeys = n.slice();
        }
        function Ao(e) {
          var r = e.canCollect;
          r && ((e.readMap = {}), (e.delReadMap = {}), (e.depKeys = e.currentDepKeys.slice()), (e.currentDepKeys.length = 0));
        }
        function Xn(e, r, t) {
          if (e.canCollect) {
            var n = t.parentType,
              a = t.rawVal,
              u = ro(a);
            u && to(e.internal.level1ArrKeys, r.depKey), e.recordDep(r, n, u);
          }
        }
        function At(e, r) {
          var t = e.depKeys,
            n = e.currentDepKeys,
            a = e.fixedDepKeys,
            u = r ? n : t;
          return u.concat(a);
        }
        function Eo(e) {
          if (e) {
            var r = e.updater,
              t = e.mountStatus,
              n = e.createTime;
            if (t === or) {
              Date.now() - n > nn ? jn(e) : (e.needEFUpdate = !0);
              return;
            }
            r();
          }
        }
        function Wn(e) {
          var r = e.internal,
            t = e.isReactive,
            n = r.rawState,
            a = r.isDeep,
            u = r.sharedKey,
            i = r.onRead,
            o = r.forAtom;
          if (a) {
            var s = function (v) {
              var y = v.isBuiltInFnKey,
                p = v.key;
              if (!y) {
                if (Or(p)) return yt(v, o, u);
                var g = v.fullKeyPath,
                  S = v.keyPath,
                  h = v.parentType,
                  m = hr(v, i),
                  E = W(g, u),
                  T = { depKey: E, keyPath: g, parentKeyPath: S, sharedKey: u };
                Xn(e, T, { parentType: h, rawVal: m });
              }
            };
            if (t) {
              var c = St(r, { onRead: s }),
                f = c.draft,
                l = c.draftRoot;
              (e.proxyState = l), (e.proxyStateVal = f);
            } else e.proxyState = (0, X.OA)(n, { onOperate: s, compareVer: !0 });
          } else
            e.proxyState = me(n, {
              set: function () {
                return Fe('changing shared state is invalid'), !0;
              },
              get: function (v, y) {
                var p = v[y];
                if (Or(y)) return Sr(!0, o, u, y, p);
                var g = hr(Ve(y, p, { isChanged: !1, parentKeyPath: [] }), i),
                  S = Lr(y, u),
                  h = Ae(v) ? fr : Qu;
                return Xn(e, { depKey: S, keyPath: [y], sharedKey: u }, { parentType: h, rawVal: g }), g;
              },
            });
        }
        function _o(e) {
          var r,
            t = e.updater,
            n = e.sharedState,
            a = e.id,
            u = a === void 0 ? '' : a,
            i = e.globalId,
            o = i === void 0 ? '' : i,
            s = e.collectType,
            c = s === void 0 ? 'every' : s,
            f = e.deps,
            l = e.pure,
            d = l === void 0 ? !0 : l,
            v = e.arrDep,
            y = v === void 0 ? !0 : v,
            p = e.isReactive,
            g = p === void 0 ? !1 : p,
            S = y && (r = e.arrIndexDep) !== null && r !== void 0 ? r : !0,
            h = B(n);
          if (!h) throw new Error('ERR_OBJ_NOT_SHARED: input object is not a result returned by share api');
          var m = Mi(),
            E = h.rawState,
            T = h.isDeep,
            I = h.ver,
            _ = h.ruleConf,
            A = h.level1ArrKeys,
            F = h.forAtom,
            L = h.sharedKey,
            b = h.sharedKeyStr,
            K = h.snap,
            C = _.stopDepInfo,
            R = {
              readMap: {},
              delReadMap: {},
              pure: d,
              depKeys: [],
              fixedDepKeys: [],
              currentDepKeys: [],
              isDeep: T,
              isReactive: g,
              insKey: m,
              internal: h,
              rawState: E,
              sharedState: n,
              proxyState: {},
              proxyStateVal: {},
              updater: t,
              mountStatus: or,
              renderStatus: Le,
              needEFUpdate: !1,
              createTime: Date.now(),
              rootVal: null,
              ver: I,
              id: u,
              globalId: o,
              collectType: c,
              canCollect: c !== 'no',
              isFirstRender: !0,
              subscribe: function (O) {
                O();
              },
              extra: {},
              getDeps: function () {
                return At(R, !0);
              },
              renderInfo: {
                setDraft: h.insSetDraft,
                time: Date.now(),
                sn: 0,
                snap: K,
                insKey: m,
                getDeps: function () {
                  return At(R, !0);
                },
                getPrevDeps: function () {
                  return At(R, !1);
                },
              },
              recordDep: function (O, re, ne) {
                var P = O.depKey;
                Nn(O, {
                  stopDepInfo: C,
                  level1ArrKeys: A,
                  recordCb: function (Qf) {
                    P = Qf;
                  },
                });
                var z = R.renderStatus,
                  ae = R.fixedDepKeys;
                if (z !== Gr) {
                  var De = R.readMap,
                    Te = R.insKey,
                    Ze = R.currentDepKeys,
                    gu = R.delReadMap;
                  Ie([P], {}), Xi() && (ie(Ze, P), U(R.fixedDepKeys, P));
                  var hu = function () {
                    (De[P] = 1), h.recordDep(P, Te), ae.includes(P) || U(Ze, P);
                  };
                  if (!De[P] && !gu[P]) {
                    var $t = O.parentKeyPath;
                    if (d && re === fr && $t) {
                      var wr = $t.length ? W($t, L) : b;
                      De[wr] && (delete De[wr], (gu[wr] = 1), ie(Ze, wr));
                    }
                    var mu = Pn(re);
                    if (mu) {
                      S && hu();
                      return;
                    }
                    (!ne || (!mu && y)) && hu();
                  }
                }
              },
            };
          if ((o && Gn(o, m), Wn(R), h.mapInsCtx(R, m), h.recordId(u, m), $(f))) {
            var M = F ? R.proxyState.val : R.proxyState,
              x = de(f, M),
              V = R.getDeps().slice();
            x.includes(M) && V.push(h.rootValKey), (R.fixedDepKeys = V);
          }
          return R;
        }
        function zn(e) {
          var r = e.result,
            t = e.forAtom;
          e.proxyResult = me(r, {
            set: function () {
              return Fe('changing derived result is invalid'), !1;
            },
            get: function (a, u) {
              return ar === u ? t : (Le === e.renderStatus && dt(e), r[u]);
            },
          });
        }
        function Ko(e) {
          var r = e.proxyState,
            t = e.internal,
            n = e.renderInfo,
            a = e.canCollect,
            u = e.isReactive,
            i = t.sharedKey,
            o = t.sharedKeyStr,
            s = t.insSetState,
            c = t.forAtom;
          (n.snap = t.snap), (n.time = Date.now());
          var f = c ? r.val : r;
          e.isFirstRender && ((e.rootVal = f), ut.set(e.rootVal, e)), !c && a && e.recordDep({ depKey: o, keyPath: [], sharedKey: i }, fr);
          var l = u ? r : f;
          return [l, s, n];
        }
        function Do(e, r) {
          if (r && !xe(e)) throw new Error('useAtom only accept atom');
        }
        function To(e) {
          var r = e.ver,
            t = e.internal.ver;
          r !== t && ((e.ver = t), Wn(e));
        }
        function Ro(e) {
          e.mountStatus = sr;
          var r = e.id,
            t = e.globalId,
            n = e.insKey;
          e.internal.recordId(r, n), Gn(t, n), mo(e);
        }
        function Fo(e) {
          e.mountStatus = an;
          var r = e.id,
            t = e.globalId,
            n = e.insKey;
          e.internal.delId(r, n), fo(t, n), jn(e);
        }
        function bo(e, r) {
          var t = B(r).sharedKey;
          return e.internal.sharedKey !== t;
        }
        function Ar(e) {
          try {
            for (var r, t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), a = 1; a < t; a++) n[a - 1] = arguments[a];
            (r = e.react).useSyncExternalStore.apply(r, n);
          } catch (u) {
            console.error(u);
          }
        }
        var Io = null;
        function Jn(e, r, t) {
          var n = e.hookImpl,
            a = e.react,
            u = n.useForceUpdate(),
            i = a.useRef({ ctx: Io }),
            o = i.current.ctx;
          return (!o || bo(o, r)) && ((o = _o(D()({ updater: u, sharedState: r }, t))), (i.current.ctx = o)), o;
        }
        function Zn(e, r) {
          e.react.useEffect(
            function () {
              return (
                (r.isFirstRender = !1),
                ut.del(r.rootVal),
                r.collectType === 'first' && (r.canCollect = !1),
                r.needEFUpdate && ((r.needEFUpdate = !1), r.updater()),
                Ro(r),
                function () {
                  Fo(r);
                }
              );
            },
            [r],
          );
        }
        function Co(e, r, t, n) {
          (t.renderStatus = Le),
            Ao(t),
            Ar(e, t.subscribe, function () {
              return B(r).snap;
            }),
            e.react.useEffect(function () {
              (t.renderStatus = Gr), (t.isFirstRender = !1), So(t);
            });
        }
        function Et(e, r) {
          var t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
            n = Jn(e, r, t);
          return (
            Ar(e, n.subscribe, function () {
              return B(r).snap;
            }),
            Zn(e, n),
            n
          );
        }
        function Er(e, r) {
          var t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
            n = t.forAtom;
          Do(r, n);
          var a = Jn(e, r, t);
          Co(e, r, a, t), Zn(e, a), To(a);
          var u = Ko(a);
          return { tuple: u, insCtx: a };
        }
        function Qn(e, r) {
          var t = r || {},
            n = t.forAtom,
            a = t.label,
            u = t.strict,
            i = u === void 0 ? !1 : u,
            o;
          if ((typeof e == 'number' ? (o = Ye(e)) : (o = B(e)), !o && e)) {
            var s = e[tn];
            o = Ye(s == null ? void 0 : s.sharedKey);
          }
          var c = a ? '[['.concat(a, ']] err:') : 'err:';
          if (!o)
            if (i) ye(''.concat(c, ' not a valid shared or atom'), { throwErr: !0 });
            else return null;
          return (
            n !== void 0
              && (n && !o.forAtom && ye(''.concat(c, ' expect a shared but recived a atom'), { throwErr: !0 }),
              !n && o.forAtom && ye(''.concat(c, ' expect a atom but recived a shared'), { throwErr: !0 })),
            o
          );
        }
        function Ee(e, r) {
          return Qn(e, D()(D()({}, r || {}), {}, { strict: !0 }));
        }
        var Mo = G.MUTATE,
          wo = G.LOADING,
          Po = q.GLOGAL_LOADING,
          ko = q.PRIVATE_LOADING,
          Oo = rr.PRIVATE,
          No = rr.GLOBAL,
          qn = {},
          Lo = {},
          xo = { time: 0, sn: 0, getDeps: Re, getPrevDeps: Re, insKey: 0, setDraft: N },
          Uo = [_e(qn, Lo, Mo), N, xo];
        function $o(e, r) {
          var t = r.internal,
            n = r.apiCtx,
            a = t.mutateFnDict,
            u = t.moduleName,
            i = {};
          Object.keys(a).forEach(function (c) {
            i[c] = { loading: !1, err: null, ok: !0 };
          });
          var o = u ? ''.concat(u, '@Loading') : '',
            s = e({ apiCtx: n, rawState: i, isLoading: !0, stateType: ko }, { moduleName: o });
          return s.state;
        }
        var ea = null;
        function Yo() {
          return ea;
        }
        function ra() {
          return j().globalLoadingInternal;
        }
        function Vo(e, r) {
          var t = j(),
            n = t.globalLoading;
          if (!n) {
            var a = r({ apiCtx: e, rawState: {}, stateType: Po }, { moduleName: Bu }),
              u = a.state,
              i = B(u);
            (t.globalLoadingInternal = i), (t.globalLoading = u);
          }
          return (ea = n), n;
        }
        function _t(e, r) {
          var t = r;
          return Or(r) && (t = r.toString()), ''.concat(e, '>').concat(t);
        }
        function ta(e, r, t) {
          if (r) {
            var n = e.loadingInternal;
            n.innerSetState(
              function (a) {
                a[r] = t;
              },
              { from: wo },
            ),
              t.err && (pn(e, Oe.ON_ERROR_OCCURED, { err: t.err }), console.error(t.err));
          }
        }
        function _e(e, r, t) {
          var n = e[t];
          return (
            n
              || ((n = me(r, {
                get: function (u, i) {
                  var o = _t(t, i);
                  return u[o] || { loading: !1, ok: !0, err: null };
                },
              })),
              (e[t] = n)),
            n
          );
        }
        function _r(e, r) {
          var t = r.internal,
            n = r.from,
            a = t.stateType,
            u = t.recordLoading,
            i = q.USER_STATE === a,
            o = _e(qn, {}, n),
            s = {};
          if (i)
            if (Oo === u)
              (s = t.extra.loadingProxy),
                s || ((s = $o(e, r)), (t.extra.loadingProxy = s), (t.loadingInternal = B(s))),
                (o = _e(t.extra, s, n));
            else if (No === u) {
              var c = ra();
              (s = Yo()), (t.loadingInternal = c), (o = _e(c.extra, s, n));
            } else s = gt();
          else (s = t.sharedState), (o = _e(t.extra, s, n));
          return { loadingState: o, loadingProxy: s };
        }
        function na(e, r) {
          if (!Ae(r)) return e;
          var t = Object.keys(r);
          if (!t.length) return e;
          var n = r[t[0]];
          return n.__sharedKey ? D()(D()({}, e), {}, { internal: Ee(n.__sharedKey) }) : e;
        }
        function aa(e, r) {
          var t = r.internal,
            n = r.from,
            a = r.apiCtx,
            u = t.stateType,
            i = q.USER_STATE === u,
            o = function () {
              return Uo;
            };
          return (
            i
              && (o = function (c) {
                var f = na(r, c),
                  l = _r(e, f).loadingProxy,
                  d = Er(a, l),
                  v = d.insCtx,
                  y = v.proxyState,
                  p = v.internal,
                  g = v.extra,
                  S = v.renderInfo;
                return [_e(g, y, n), p.setState, S];
              }),
            {
              useLoading: o,
              getLoading: function (c) {
                var f = na(r, c);
                return _r(e, f).loadingState;
              },
            }
          );
        }
        function Kr(e) {
          var r = _n();
          return Object.assign(r, e || {});
        }
        function fl() {
          var e = getFnScope(),
            r = e.runningFnKey,
            t = getFnCtx(r);
          return t && t.depKeys.slice();
        }
        function Ce() {
          var e = H(),
            r = e.runningFnKey;
          if (!r) return [];
          var t = Se(r),
            n = [];
          if (t) {
            var a = e.depKeys,
              u = t.depKeys,
              i = {};
            a.forEach(function (s) {
              return (i[s] = 1);
            }),
              a.forEach(function (s) {
                var c = jt(i, s);
                c && c !== s && delete i[c];
              });
            var o = Object.keys(i);
            o.forEach(function (s) {
              return U(u, s);
            }),
              (n = u.slice());
          }
          return (e.runningFnKey = ''), (e.depKeys = []), (e.runningSharedKey = 0), n;
        }
        function ua(e, r) {
          var t = H();
          (t.runningFnKey = e), (t.runningSharedKey = r), (t.isIgnore = !1);
        }
        function ia(e, r) {
          var t = r.specificProps,
            n = r.fnCtxBase,
            a = t.scopeType,
            u = In(e, a),
            i = D()({ fn: e, fnKey: u }, t),
            o = n ? Object.assign(n, i) : Kr(i);
          return ot(a).set(u, o), o;
        }
        function ll(e) {
          var r = getFnKey(e);
          if (r) {
            var t = getFnCtx(r);
            t && Dr(t);
          }
        }
        function Dr(e) {
          var r,
            t = H(),
            n = t.FNKEY_HOOK_CTX_MAP,
            a = t.UNMOUNT_INFO_MAP,
            u = e.fnKey;
          vt(e),
            (e.extra.deferedWatch = null),
            n.delete(u),
            ((r = a.get(u)) === null || r === void 0 ? void 0 : r.c) === 2 && a.delete(u),
            uo();
        }
        function oa(e) {
          var r = H(),
            t = r.DEPKEY_COMPUTING_FNKEYS_MAP,
            n = e.prevLevelFnKeys,
            a = e.depKeys,
            u = !1,
            i = Xe()(a),
            o;
          try {
            for (i.s(); !(o = i.n()).done; ) {
              var s = o.value,
                c = t.get(s) || [];
              if (Yt(c, n)) {
                u = !0;
                break;
              }
            }
          } catch (f) {
            i.e(f);
          } finally {
            i.f();
          }
          return u;
        }
        function Go(e) {
          var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0,
            t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : be;
          return e.map(function (n) {
            var a = n.split('/'),
              u = Q()(a, 2),
              i = u[0],
              o = u[1],
              s = o.split(be),
              c = r ? ''.concat(Ye(Number(i)).usefulName, '/') : '';
            return ''.concat(c).concat(s.join(t));
          });
        }
        var Tr,
          Rr = new Map(),
          Fr = { WATCH: '1', MUTATE: '2' },
          Ho = ((Tr = {}), k()(Tr, Fr.WATCH, 'watch'), k()(Tr, Fr.MUTATE, 'mutate fn or task'), Tr);
        function Bo() {
          var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
          return { sn: e, descs: [], errs: [], timer: null, cycle: [] };
        }
        function sa(e, r, t) {
          var n = new Error(
            'DEAD_CYCLE: module('.concat(e, ') found mutate fn(').concat(t, ') in these dead cycle fns [').concat(r.join(','), ']'),
          );
          return (n.cause = 'DeadCycle'), (n.data = r), n;
        }
        function jo(e) {
          Rr.delete(e);
        }
        function Xo(e, r, t, n) {
          var a = Ho[n],
            u = r.subFnInfo,
            i = u.desc,
            o = u.task,
            s = u.fn,
            c = u.isFake,
            f = i ? '('.concat(i, ')') : '',
            l =
              'DEAD_CYCLE: found reactive object in '.concat(a).concat(f, ' cb')
              + ' is changing module('.concat(e.usefulName, ")'s some of these dep keys(").concat(Go(t, !1, '.'), '), ')
              + 'it will cause a infinity loop call!',
            d = c ? r.fn : o || s;
          return {
            err: new Error('[only-dev-mode alert] '.concat(l)),
            tipFn: function () {
              return console.error(
                ' '.concat(
                  l,
                  ` open the stack to find the below fn: 
`,
                ),
                d,
              );
            },
          };
        }
        function Wo(e, r, t) {
          if (e && t) {
            var n = e.usefulName,
              a = qe(Rr, n, Bo(r));
            a.sn !== r && ((a.descs = []), (a.errs = []));
            var u = a.descs;
            if (u.length > 1 && u[0] === t) {
              var i = u.slice();
              throw ((a.cycle = i), (u.length = 0), sa(n, i, t));
            }
            U(u, t);
          }
        }
        function Kt(e, r) {
          r.tipFn(), ye(r.err, { logErr: !1, throwErr: !1, alertErr: e.alertDeadCycleErr });
        }
        function Ke(e, r, t) {
          var n = r.depKeys,
            a = r.subFnInfo,
            u = r.depKeys,
            i = t;
          n.length > t.length && ((u = t), (i = n));
          var o = !1;
          if (Yt(u, i)) {
            var s = a.desc ? Fr.MUTATE : Fr.WATCH,
              c = Xo(e, r, t, s);
            Kt(e, c), (r.dcErrorInfo = c), (o = !0);
          }
          return o;
        }
        function zo(e, r) {
          var t = Rr.get(e);
          return !t || !t.cycle.includes(r) ? { isIn: !1, cycle: [] } : { isIn: !0, cycle: t.cycle };
        }
        function Jo(e, r) {
          var t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0,
            n = Rr.get(e);
          if (n) {
            var a = n.timer,
              u = n.errs;
            u.push(r),
              a && clearTimeout(a),
              (n.timer = setTimeout(function () {
                var i = null,
                  o = Xe()(u),
                  s;
                try {
                  for (o.s(); !(s = o.n()).done; ) {
                    var c = s.value;
                    i ? c.data.length > i.data.length && (i = c) : (i = c);
                  }
                } catch (f) {
                  o.e(f);
                } finally {
                  o.f();
                }
                i && ye(i, { alertErr: t }), (u.length = 0);
              }, 0));
          }
        }
        function Dt(e) {
          var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0,
            t = Se(e);
          t && (t.showLoading && (t.setLoading(!0), t.updater()), r && (t.remainRunCount += r));
        }
        var Zo = cr.MAY_TRANSFER;
        function Qo(e, r) {
          var t = r.isFirstCall,
            n = t === void 0 ? !1 : t,
            a = r.triggerReasons,
            u = a === void 0 ? [] : a,
            i = r.sn,
            o = i === void 0 ? 0 : i,
            s = r.from,
            c = r.internal,
            f = c === void 0 ? Tn : c,
            l = r.desc,
            d = r.fromFnKey;
          if (e.dcErrorInfo.err) {
            Kt(f, e.dcErrorInfo);
            return;
          }
          if (e.fnKey === d) {
            Ke(f, e, e.depKeys);
            return;
          }
          if (e.isSimpleWatch || !e.checkDeadCycle) return e.fn({ isFirstCall: n, triggerReasons: u, sn: o });
          if ((G.MUTATE === s && Wo(f, o, l), !(e.isRunning && Ke(f, e, r.depKeys || [])))) {
            var v = fe.current();
            if (!(v.fnKey === e.fnKey && Ke(f, e, v.writeKeys))) {
              ze(v.sharedKey, v.desc);
              var y = e.isRunning === !0 && v.isTop;
              if (!(y && Ke(f, e, v.writeKeys))) {
                (e.isRunning = !0), Ge.set(e.fnKey);
                var p = e.fn({ isFirstCall: n, triggerReasons: u, sn: o });
                Ge.del();
                var g = fe.current();
                if (
                  !(g.isTop && g.fnKey === e.fnKey && Ke(f, e, g.writeKeys))
                  && !(p && p.task && g.from === G.MUTATE && Ke(f, e, e.subFnInfo.writeKeys))
                )
                  return (e.isRunning = !1), p;
              }
            }
          }
        }
        function Je(e) {
          var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
            t = r.isFirstCall,
            n = t === void 0 ? !1 : t,
            a = r.forceFn,
            u = a === void 0 ? !1 : a,
            i = r.forceTask,
            o = i === void 0 ? !1 : i,
            s = r.throwErr,
            c = s === void 0 ? !1 : s,
            f = r.triggerReasons,
            l = f === void 0 ? [] : f,
            d = r.sn,
            v = d === void 0 ? 0 : d,
            y = r.err,
            p = r.unbox,
            g = p === void 0 ? !1 : p,
            S = r.internal,
            h = S === void 0 ? Tn : S,
            m = Se(e),
            E = function () {
              var z = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
              if (z && c) throw z;
              var ae = m || Rn;
              return g ? [ae.result.val, z] : [ae.result, z];
            };
          if (!m) return E(new Error('not a valid watch or derive cb for key '.concat(e)));
          if (m.fnType === un) return Qo(m, r);
          var T = m.isAsync,
            I = m.fn,
            _ = m.task,
            A = m.isAsyncTransfer,
            F = m.forAtom,
            L = m.result,
            b = m.depKeys;
          m.remainRunCount > 0 && (m.remainRunCount -= 1);
          var K = function (z) {
              var ae = F ? { val: z } : z;
              !m.returnUpstreamResult && ae && Object.assign(m.result, ae), (m.shouldReplaceResult = !0);
            },
            C = function () {
              (m.renderInfo.sn = v), m.updater();
            },
            R = function (z) {
              var ae = z.data,
                De = z.err,
                Te = De === void 0 ? null : De;
              Te
                ? m.setLoading(!1, Te)
                : (K(ae), n ? T && m.status.loading && !oa(m) && m.setLoading(!1, Te) : m.remainRunCount === 0 && m.setLoading(!1, Te)),
                C(),
                m.nextLevelFnKeys.forEach(function (Ze) {
                  Je(Ze, { isFirstCall: n, sn: v, triggerReasons: l, err: Te });
                });
            },
            M = F ? L.val : L,
            x = de(m.deps),
            V = { isFirstCall: n, prevResult: M, triggerReasons: l, input: x, sn: v },
            Y = !T || u || (T && !_);
          if (Y) {
            var O = I(V);
            return R({ data: O }), E();
          }
          if (
            (T
              && n
              && m.nextLevelFnKeys.forEach(function (P) {
                return Dt(P, 0);
              }),
            A)
          )
            return R({ err: y }), E();
          if (m.asyncType === Zo) {
            var re = I(V);
            return R({ data: re }), E();
          }
          if (_) {
            var ne = _u;
            return (
              n
                ? (b.forEach(function (P) {
                    return Gi(P, e);
                  }),
                  (ne = function () {
                    return b.forEach(function (z) {
                      return Hi(z, e);
                    });
                  }))
                : o
                  && m.nextLevelFnKeys.forEach(function (P) {
                    return Dt(P);
                  }),
              Promise.resolve(function () {
                var P = _(V);
                return Nr(P) ? P : (ye('ERR_NON_FN: derive task arg should be async function!', { throwErr: c }), null);
              })
                .then(function (P) {
                  return P();
                })
                .then(function (P) {
                  return ne(), R({ data: P }), E();
                })
                .catch(function (P) {
                  if ((ne(), R({ err: P }), c)) throw P;
                  return yn(h, P), E(P);
                })
            );
          }
          return E(y);
        }
        function br(e, r) {
          var t = je(e);
          if (!t) throw new Error('[Helux]: not a derived result');
          return Je(t.fnKey, D()({}, r || {}));
        }
        function qo(e, r) {
          return br(e, { forceFn: !0, throwErr: r });
        }
        function es(e, r) {
          return Promise.resolve(br(e, { forceTask: !0, throwErr: r }));
        }
        function rs(e, r) {
          return br(e, { forceFn: !0, throwErr: r, unbox: !0 });
        }
        function ts(e, r) {
          return Promise.resolve(br(e, { forceTask: !0, throwErr: r, unbox: !0 }));
        }
        function ns(e) {
          var r = je(e);
          return r ? r.status : { loading: !1, err: null, ok: !0 };
        }
        function Tt(e, r, t) {
          var n = e.get(r);
          n && ((n.renderInfo.sn = t), Eo(n));
        }
        function as(e) {
          var r = e.mutateCtx,
            t = e.internal,
            n = r.ids,
            a = r.globalIds,
            u = r.depKeys,
            i = r.triggerReasons,
            o = r.isFirstCall,
            s = r.from,
            c = r.sn,
            f = r.desc,
            l = r.fnKey,
            d = t.key2InsKeys,
            v = t.id2InsKeys,
            y = t.insCtxMap,
            p = t.rootValKey,
            g = [],
            S = [],
            h = [],
            m = [],
            E = {};
          if (o) {
            var T = Ce();
            Be.set(T);
          }
          var I = function (F) {
            if (mr(t, F)) {
              var L = d[F] || [],
                b = [],
                K = Xe()(L),
                C;
              try {
                for (K.s(); !(C = K.n()).done; ) {
                  var R = C.value;
                  if (!g.includes(R)) {
                    var M = y.get(R);
                    if (M) {
                      var x = M.getDeps();
                      if (x[0] === p) {
                        mr(t, p) && b.push(R);
                        continue;
                      }
                      Ln(t, x, F) && b.push(R);
                    }
                  }
                }
              } catch (re) {
                K.e(re);
              } finally {
                K.f();
              }
              g = g.concat(b);
              var V = ao(t, F, E),
                Y = V.firstLevelFnKeys,
                O = V.asyncFnKeys;
              (h = h.concat(Y)), (m = m.concat(O));
            }
          };
          if (
            (u.forEach(function (A) {
              return I(A);
            }),
            u.includes(p) || I(p),
            no(),
            n.forEach(function (A) {
              g = g.concat(v[A] || []);
            }),
            a.forEach(function (A) {
              ht(A).forEach(function (F) {
                return U(S, F);
              });
            }),
            (g = Qe(g)),
            (h = Qe(h)),
            (m = Qe(m)),
            m.forEach(function (A) {
              return Dt(A, E[A]);
            }),
            h.forEach(function (A) {
              return Je(A, { depKeys: u, sn: c, from: s, triggerReasons: i, internal: t, desc: f, isFirstCall: o, fromFnKey: l });
            }),
            g.forEach(function (A) {
              return Tt(y, A, c);
            }),
            S.length)
          ) {
            var _ = co().insCtxMap;
            S.forEach(function (A) {
              return Tt(_, A, c);
            });
          }
        }
        function us(e) {
          var r = e.state,
            t = e.internal,
            n = e.mutateCtx,
            a = t.rawState,
            u = t.isDeep,
            i = t.ver,
            o = t.snap;
          u ? ((t.prevSnap = i === 0 ? D()({}, o) : o), (t.snap = r), Object.assign(a, r)) : (t.snap = D()({}, a)),
            (t.ver += 1),
            (t.sn = n.sn),
            as(e);
        }
        var is = G.MUTATE;
        function ca(e, r) {
          var t = r.writeKey,
            n = r.ids,
            a = r.internal,
            u = r.opParams,
            i = a.snap,
            o = u.fullKeyPath,
            s = u.value;
          Object.keys(e).forEach(function (c) {
            t.startsWith(c)
              && ge(i, o) !== s
              && e[c].forEach(function (f) {
                return U(n, f);
              });
          });
        }
        function fa(e, r) {
          var t = e.isChanged,
            n = e.fullKeyPath,
            a = e.keyPath,
            u = e.parentType,
            i = e.value,
            o = r.internal,
            s = r.mutateCtx,
            c = s.arrKeyDict,
            f = s.isReactive,
            l = s.readKeys,
            d = o.sharedKey,
            v = Pn(u),
            y = fe.current();
          if (e.op === 'get') {
            v && (c[W(a, d)] = 1);
            var p = W(n, d);
            (l[p] = 1),
              s.enableDep
                && (y.onRead ? y.onRead(e) : (gr().fnCtx && Ie([p], { sharedKey: d }), f && (ft([p]), pt(d, i, o.sharedState, p, n))));
            return;
          }
          if (t) {
            var g = o.moduleName,
              S = o.ruleConf,
              h = o.level1ArrKeys,
              m = s.writeKeyPathInfo,
              E = s.ids,
              T = s.globalIds,
              I = s.writeKeys,
              _ = W(n, d);
            if ((y.key && (y.isTop ? U(y.writeKeys, _) : y.from === is && U(st(y.fnKey).subFnInfo.writeKeys || [], _)), v)) {
              var A = W(a, d);
              (m[A] = { sharedKey: d, moduleName: g, keyPath: a }), (I[A] = 1);
            }
            var F = S.hasIds,
              L = S.hasGlobalIds,
              b = S.stopDepInfo;
            m[_] = { sharedKey: d, moduleName: g, keyPath: n };
            var K = jt(c, _);
            K && (I[K] = 1);
            var C = { sharedKey: d, keyPath: n, depKey: _ };
            Nn(C, {
              stopDepInfo: b,
              level1ArrKeys: h,
              recordCb: function (M) {
                I[M] = 1;
              },
            }) || (I[_] = 1),
              F && ca(S.idsDict, { ids: E, writeKey: _, internal: o, opParams: e }),
              L && ca(S.globalIdsDict, { ids: T, writeKey: _, internal: o, opParams: e }),
              f ? ho(d, y.desc) : go(d);
          }
        }
        function la(e, r) {
          Object.keys(r).forEach(function (t) {
            e[t] = r[t];
          });
        }
        function Ir(e, r) {
          if (!r) return e;
          lt(!0);
          var t = e.val;
          return lt(!1), t;
        }
        function da(e) {
          var r = e.partial,
            t = e.forAtom,
            n = e.draftRoot,
            a = e.draftNode;
          if (r) {
            if (!t) {
              Ae(r) && la(a, r);
              return;
            }
            var u = r.val;
            if (Ae(a)) {
              Ae(u) ? la(a, u) : console.warn('dict atom deny to handle a non-dict returned value!');
              return;
            }
            n.val = u;
          }
        }
        function os(e, r) {
          var t = e.internal,
            n = e.mutateCtx,
            a = Ir(r, t.forAtom),
            u = n.from,
            i = n.sn,
            o = n.desc;
          t.before({ from: u, draftRoot: r, draft: a, desc: o, sn: i }), ii(t, r, a, i);
        }
        function va(e, r, t, n) {
          var a = e.mutateCtx,
            u = e.internal,
            i = a.writeKeys,
            o = a.writeKeyPathInfo,
            s = a.handleCbReturn,
            c = u.forAtom;
          s && da({ partial: n, forAtom: c, draftRoot: r, draftNode: t }),
            os(e, r),
            (a.depKeys = Object.keys(i)),
            yr.del(),
            it.del(),
            (e.state = (0, X._x)(r)),
            e.state !== u.rawState && ((a.triggerReasons = Object.values(o)), us(e), fi(u, a));
        }
        function pa(e, r) {
          var t = r.ids,
            n = r.globalIds,
            a = r.from,
            u = r.desc,
            i = r.fnKey;
          t
            && t.forEach(function (o) {
              return U(e.ids, o);
            }),
            n
              && n.forEach(function (o) {
                return U(e.globalIds, o);
              }),
            a && (e.from = a),
            u && (e.desc = u),
            i && (e.fnKey = i);
        }
        function ss(e) {
          var r = e.internal,
            t = e.setFactoryOpts,
            n = r.forAtom,
            a = r.rawState,
            u = Wr(t),
            i = (0, X.P2)(a, {
              customKeys: ur,
              onOperate: function (c) {
                if (c.isCustom) return yt(c, n, r.sharedKey);
                fa(c, { internal: r, mutateCtx: u });
              },
            });
          yr.set(i), it.set(u);
          var o = Ir(i, n);
          return (
            n && (u.readKeys = {}),
            {
              draftRoot: i,
              draftNode: o,
              finishMutate: function (c) {
                var f = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
                pa(u, f);
                var l = { state: {}, mutateCtx: u, internal: r };
                va(l, i, o, c);
              },
            }
          );
        }
        var cs = w(79664),
          Rt = w.n(cs);
        function fs(e) {
          gn(e);
          var r = _i(e);
          return r;
        }
        function ls(e) {
          if (!e) return {};
          var r = e.desc,
            t = e.ids,
            n = e.globalIds;
          return { desc: r, ids: t, globalIds: n };
        }
        function ds(e) {
          var r = e.forAtom,
            t = r === void 0 ? !1 : r,
            n = e.rawState,
            a = $(n),
            u = !1;
          if (t) (n = a ? { val: n() } : { val: n }), (u = !n.val || !Bt(n.val));
          else {
            if (((n = a ? n() : n), !Z(n))) throw new Error('ERR_NON_OBJ: pass an non-object to createShared!');
            if (ce(n)) throw new Error('ERR_ALREADY_SHARED: pass a shared object to createShared!');
          }
          return { isPrimitive: u, rawState: n };
        }
        function dl(e, r) {
          var t = e || r || genFnKey(FROM.MUTATE);
          return t;
        }
        function ya(e, r, t) {
          var n = null,
            a = r || '';
          if ($(e) && e !== N) {
            var u;
            n =
              ((u = {}),
              k()(u, rn, 1),
              k()(u, 'fn', e),
              k()(u, 'deps', Re),
              k()(u, 'oriDesc', a),
              k()(u, 'onlyDeps', !1),
              k()(u, 'desc', a),
              k()(u, 'depKeys', []),
              k()(u, 'writeKeys', []),
              k()(u, 'checkDeadCycle', void 0),
              k()(u, 'watchKey', ''),
              k()(u, 'isFake', !1),
              u);
          } else if (Z(e)) {
            var i = e.fn,
              o = e.desc,
              s = e.deps,
              c = e.task,
              f = e.immediate,
              l = e.checkDeadCycle,
              d = e.onlyDeps,
              v = d === void 0 ? !1 : d,
              y = r || o || '',
              p = $(i) ? i : void 0,
              g = $(c) ? c : void 0,
              S = $(s) ? s : Re;
            if (i || c) {
              var h;
              n =
                ((h = {}),
                k()(h, rn, 1),
                k()(h, 'checkDeadCycle', l),
                k()(h, 'fn', p),
                k()(h, 'watchKey', ''),
                k()(h, 'desc', y),
                k()(h, 'oriDesc', y),
                k()(h, 'deps', S),
                k()(h, 'task', g),
                k()(h, 'onlyDeps', v),
                k()(h, 'immediate', f),
                k()(h, 'depKeys', []),
                k()(h, 'writeKeys', []),
                k()(h, 'isFake', !1),
                h);
            }
          }
          if (n && t) {
            var m = n,
              E = m.oriDesc;
            (!E || t[E]) && (n.desc = Xr(G.MUTATE));
          }
          return n;
        }
        function ga(e, r) {
          var t = {},
            n = r || {};
          if (!e) return t;
          var a = function (s, c) {
            var f = ya(s, c, n);
            f && ((t[f.desc] = f), (n[f.desc] = f));
          };
          if (Array.isArray(e))
            if (e.length === 1) {
              var u = e[0],
                i = (Z(u) ? u.desc : '') || ir;
              a(e[0], i);
            } else
              e.forEach(function (o) {
                return a(o);
              });
          else
            $(e)
              ? a(e, ir)
              : Z(e)
                && Object.keys(e).forEach(function (o) {
                  a(e[o], o);
                });
          return t;
        }
        function vs(e) {
          var r,
            t,
            n,
            a,
            u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
            i = e.forAtom,
            o = i === void 0 ? !1 : i,
            s = e.forGlobal,
            c = s === void 0 ? !1 : s,
            f = e.stateType,
            l = f === void 0 ? q.USER_STATE : f,
            d = ds(e),
            v = d.rawState,
            y = d.isPrimitive,
            p = fs(v),
            g = u.moduleName || '',
            S = (r = u.alertDeadCycleErr) !== null && r !== void 0 ? r : pe(),
            h = (t = u.deep) !== null && t !== void 0 ? t : !0,
            m = (n = u.checkDeadCycle) !== null && n !== void 0 ? n : !0,
            E = u.recordLoading || rr.PRIVATE,
            T = u.rules || [],
            I = u.before || N,
            _ = u.mutate || N,
            A = (a = u.stopArrDep) !== null && a !== void 0 ? a : !0,
            F = u.stopDepth || ju,
            L = ''.concat(p),
            b = o ? ''.concat(p, '/val') : L,
            K = g || L,
            C = Ji(g),
            R = ga(_);
          return {
            isDestroyed: !1,
            alertDeadCycleErr: S,
            checkDeadCycle: m,
            rawState: v,
            sharedKey: p,
            sharedKeyStr: L,
            rootValKey: b,
            moduleName: g,
            usefulName: K,
            forAtom: o,
            forGlobal: c,
            loc: C,
            deep: h,
            rules: T,
            before: I,
            mutate: _,
            mutateFnDict: R,
            onRead: null,
            stateType: l,
            recordLoading: E,
            stopArrDep: A,
            stopDepth: F,
            isPrimitive: y,
          };
        }
        function ps(e) {
          var r = e.rawState,
            t = e.sharedKey,
            n = e.rootValKey,
            a = e.deep,
            u = e.rules,
            i = e.stopDepth,
            o = e.stopArrDep,
            s = e.forAtom,
            c = {},
            f = {},
            l = { keys: [], isArrDict: {}, arrKeyStopDcit: {}, depth: i, stopArrDep: o },
            d = {},
            v = xr(a);
          u.forEach(function (g) {
            var S = [],
              h = g.when,
              m = g.ids,
              E = m === void 0 ? [] : m,
              T = g.globalIds,
              I = T === void 0 ? [] : T,
              _ = g.stopDep,
              A;
            if (v) {
              var F = '';
              A = (0, X.OA)(r, {
                onOperate: function (M) {
                  var x = M.fullKeyPath,
                    V = M.value,
                    Y = M.isBuiltInFnKey;
                  if (!Y) {
                    var O = W(x, t);
                    F && O.includes(F) && S.pop(), S.push(O), (d[O] = Array.isArray(V)), (F = O);
                  }
                },
              });
            } else
              A = me(r, {
                set: Iu,
                get: function (M, x) {
                  var V = W([x], t);
                  S.push(V);
                  var Y = M[x];
                  return (d[V] = Array.isArray(Y)), Y;
                },
              });
            var L = s ? A.val : A,
              b = de(h, L),
              K = function (M, x, V) {
                var Y = ke(M, V, []);
                x.forEach(function (O) {
                  return U(Y, O);
                });
              },
              C = function (M) {
                K(c, E, M), K(f, I, M);
                var x;
                d[M] ? ((x = _ != null ? _ : Xu), (l.arrKeyStopDcit[M] = x), (l.isArrDict[M] = d[M])) : (x = _ != null ? _ : !1),
                  x && U(l.keys, M);
              };
            S.forEach(C), b.includes(L) && C(n);
          });
          var y = Object.keys(c).length > 0,
            p = Object.keys(f).length > 0;
          return { hasIds: y, idsDict: c, hasGlobalIds: p, globalIdsDict: f, stopDepInfo: l };
        }
        function ys(e) {
          var r = {},
            t = r.out,
            n = t === void 0 ? !0 : t,
            a = r.desc,
            u = a === void 0 ? ir : a,
            i = r.strict,
            o = i === void 0 ? !1 : i;
          return typeof e == 'string' ? { out: n, desc: e, strict: o } : D()({ out: n, desc: u, strict: o }, e);
        }
        function ha(e) {
          var r = N,
            t = !1;
          if ($(e)) r = e;
          else if (Z(e)) {
            var n;
            (r = e.deps || N), (t = (n = e.immediate) !== null && n !== void 0 ? n : !1);
          }
          return { immediate: t, deps: r };
        }
        function gs(e) {
          return e ? (typeof e == 'boolean' ? { enableStatus: e } : Z(e) ? e : {}) : {};
        }
        function hs(e) {
          Array.isArray(e)
            && e.forEach(function (r) {
              var t = ut.current(r),
                n = B(r) || (t == null ? void 0 : t.internal);
              if (n) {
                var a = wn(n),
                  u = a.depKey,
                  i = a.sharedKey;
                Ie([u], { sharedKey: i });
              }
              t && t.recordDep(wn(n));
            });
        }
        function Cr(e, r) {
          var t = r.scopeType,
            n = r.fnCtxBase,
            a = r.immediate,
            u = r.deps,
            i = u === void 0 ? N : u,
            o = r.label,
            s = o === void 0 ? 'watch' : o,
            c = r.sharedState,
            f = r.isSimpleWatch;
          if (!$(e)) throw new Error('ERR_NON_FN: pass an non-function to '.concat(s, '!'));
          var l = ia(e, { specificProps: { scopeType: t, fnType: un, isSimpleWatch: f }, fnCtxBase: n });
          ua(l.fnKey, ce(c));
          var d = i() || [];
          return hs(d), a && e({ isFirstCall: !0 }), Ce(), l;
        }
        function ms(e, r) {
          var t = ha(r),
            n = t.deps,
            a = t.immediate,
            u = Cr(e, { scopeType: te.STATIC, deps: n, immediate: a });
          return {
            run: function (o) {
              return Je(u.fnKey, { throwErr: o });
            },
            unwatch: function () {
              return vt(u);
            },
          };
        }
        var ma = function () {},
          Ft = new Map();
        function Sa(e, r) {
          var t = e.forAtom,
            n = e.rawState;
          return t ? de(r.deps, n.val) : de(r.deps, n);
        }
        function Ss(e) {
          var r;
          return (r = Ft.get(e)) !== null && r !== void 0 ? r : !1;
        }
        function bt(e, r) {
          var t = r.sn,
            n = r.getArgs,
            a = n === void 0 ? N : n,
            u = r.from,
            i = r.throwErr,
            o = r.isFirstCall,
            s = r.fnItem,
            c = r.mergeReturn,
            f = s.desc,
            l = f === void 0 ? '' : f,
            d = s.depKeys,
            v = s.task,
            y = v === void 0 ? ma : v,
            p = B(e),
            g = p.sharedKey,
            S = { desc: l, sn: t, from: u },
            h = _t(u, l),
            m = St(p, { depKeys: d, desc: l, from: u }),
            E = m.draft,
            T = m.draftRoot,
            I = function (O) {
              ze(g, O);
            },
            _ = function (O) {
              I(l);
              var re = p.setStateFactory(S),
                ne = re.finish;
              return ne(O);
            },
            A = G.MUTATE === u ? Sa(p, s) : [],
            F = { isFirstCall: o, desc: l, setState: _, input: A, draft: E, draftRoot: T, flush: I },
            L = a(F) || [F],
            b = Ft.get(y),
            K = b === void 0,
            C = function (O, re, ne) {
              (K || b) && ta(p, h, { loading: O, err: re, ok: ne });
            };
          C(!0, null, !1);
          var R = function (O) {
              if ((Be.del(), C(!1, O, !1), i)) throw O;
              return { snap: p.snap, err: O, result: null };
            },
            M = function (O) {
              return c && O && _(O), C(!1, null, !0), I(l), { snap: p.snap, err: null, result: O };
            };
          try {
            var x = y.apply(void 0, Rt()(L)),
              V = Nr(x);
            return Ft.set(y, V), V ? Promise.resolve(x).then(M).catch(R) : M(x);
          } catch (Y) {
            return R(Y);
          }
        }
        function Aa(e, r) {
          var t = r.sn,
            n = r.getArgs,
            a = n === void 0 ? N : n,
            u = r.from,
            i = r.throwErr,
            o = r.isFirstCall,
            s = o === void 0 ? !1 : o,
            c = r.fnItem,
            f = c.desc,
            l = f === void 0 ? '' : f,
            d = c.watchKey,
            v = c.fn,
            y = v === void 0 ? ma : v,
            p = G.MUTATE === u;
          p && Ge.set(d);
          var g = B(e),
            S = g.setStateFactory,
            h = g.forAtom,
            m = g.sharedState,
            E = p && s,
            T = { desc: l, sn: t, from: u, isFirstCall: s, enableDep: E },
            I = function (V) {
              var Y = S(T),
                O = Y.finish;
              return O(V);
            },
            _ = Ir(m, h),
            A = p ? Sa(g, c) : [],
            F = S(T),
            L = F.draftNode,
            b = F.draftRoot,
            K = F.finish,
            C = a({ isFirstCall: s, draft: L, draftRoot: b, setState: I, desc: l, input: A }) || [
              L,
              { input: A, state: _, draftRoot: b, isFirstCall: s },
            ];
          try {
            var R = st(c.watchKey);
            if (R.dcErrorInfo.err) return Kt(g, R.dcErrorInfo), { snap: g.snap, err: null, result: null };
            var M = y.apply(void 0, Rt()(C));
            return K(M, { fnKey: R.fnKey }), Ea(g, c, s), { snap: g.snap, err: null, result: null };
          } catch (x) {
            if ((Ea(g, c, s), i)) throw x;
            return { snap: g.snap, err: x, result: null };
          }
        }
        function Ea(e, r, t) {
          if (t && !r.onlyDeps) {
            var n = gr().fnCtx;
            n ? (r.depKeys = Ce()) : (r.depKeys = Be.current()), Be.del();
          }
          var a = fe.current();
          a.isTop && a.fnKey === r.watchKey && Ke(e, st(r.watchKey), a.writeKeys), Ge.del();
        }
        function As(e, r) {
          yo(), Be.del(), lt(!1);
          var t = gr().fnCtx;
          if (t) {
            var n;
            (t.subFnInfo = r),
              (t.checkDeadCycle = (n = r.checkDeadCycle) !== null && n !== void 0 ? n : e.checkDeadCycle),
              (r.watchKey = t.fnKey);
          }
          r.onlyDeps && (r.depKeys = Ce());
        }
        function It(e) {
          var r = e.target,
            t = e.dict,
            n = Object.keys(t);
          if (n.length) {
            var a = B(r),
              u = a.mutateFnDict,
              i = a.usefulName,
              o = a.forAtom,
              s = a.sharedState,
              c = function (l) {
                return yn(a, l);
              };
            n.forEach(function (f) {
              var l = u[f];
              Cr(
                function (d) {
                  var v = d.sn,
                    y = d.isFirstCall;
                  y && As(a, l);
                  var p = l.desc,
                    g = l.fn,
                    S = l.task,
                    h = l.immediate,
                    m = zo(i, p);
                  try {
                    if (m.isIn) throw sa(i, m.cycle, p);
                    var E = { sn: v, throwErr: !0, isFirstCall: y, fnItem: l, from: G.MUTATE };
                    if ((g && (y || !S) && Aa(r, E), S)) {
                      y && (l.depKeys = Ce());
                      var T = y && (h != null ? h : !g);
                      if (!y || T) {
                        var I = bt(r, E);
                        I.catch(c);
                      }
                    }
                    return l;
                  } catch (_) {
                    _.cause === 'DeadCycle' && Jo(i, _, a.alertDeadCycleErr), c(_);
                  }
                },
                {
                  deps: function () {
                    return l.deps ? l.deps(Ir(s, o)) || [] : [];
                  },
                  sharedState: r,
                  scopeType: te.STATIC,
                  immediate: !0,
                },
              );
            });
          }
        }
        var _a = G.ACTION;
        function Es(e, r) {
          var t = r.label,
            n = r.throwErr,
            a = r.desc,
            u = a === void 0 ? '' : a,
            i = r.task,
            o = r.mergeReturn,
            s = o === void 0 ? !0 : o,
            c = Ee(e, { label: t }),
            f = c.forAtom,
            l = function (v, y) {
              var p = y != null ? y : n,
                g = zr({ desc: u, task: i, depKeys: [] }),
                S = function (m, E) {
                  return m.__action ? m.__action(E) : m(E);
                };
              return bt(e, {
                fnItem: g,
                from: _a,
                mergeReturn: s,
                throwErr: p,
                getArgs: function (m) {
                  var E = m.draft,
                    T = m.draftRoot,
                    I = m.setState,
                    _ = m.desc,
                    A = m.flush,
                    F = function (b) {
                      da({ partial: b, forAtom: f, draftRoot: T, draftNode: E });
                    };
                  return [{ draft: E, draftRoot: T, setState: I, desc: _, payload: v, flush: A, merge: F, dispatch: S }];
                },
              });
            };
          return (
            ta(c, _t(_a, u), { loading: !1, ok: !0, err: null }),
            (l.__sharedKey = c.sharedKey),
            (l.__fnName = u),
            (l.__task = i),
            (i.__action = l),
            l
          );
        }
        function Ka(e) {
          return function (r) {
            return function (t) {
              var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : '',
                a = arguments.length > 2 ? arguments[2] : void 0;
              return Es(e, { task: t, desc: n, label: 'action', mergeReturn: r, throwErr: a });
            };
          };
        }
        var Da = cr.TASK,
          _s = te.STATIC,
          Ks = te.HOOK;
        function Ta(e, r, t) {
          if (!t && (!Z(r) || Nr(r))) throw new Error('ERR_NON_OBJ: derive,deriveAsync expect result to be a plain object');
          var n = e.isAsync,
            a = e.isAsyncTransfer;
          if (n && !a) {
            var u = Cn(r),
              i = ce(r);
            if ((u && e.fnKey !== u) || i)
              throw new Error(
                'ERR_INVALID_CALL: derive,deriveAsync can not transfer another derived result or shared state, it will cause wrong result',
              );
          }
        }
        function Ds(e, r) {
          var t = me(e.result, {
            set: function () {
              return Fe('changing derived result is invalid'), !1;
            },
            get: function (a, u) {
              if (u === ar) return r;
              var i = a[u];
              return Ie(e.depKeys, { belongCtx: e }), ft(e.depKeys, t), pt(0, i, t, '', [u], !0, r), i;
            },
          });
          return (e.proxyResult = t), t;
        }
        function Ra(e, r) {
          var t = je(r.result);
          if (t) {
            var n;
            (e.depKeys = Qe(e.depKeys.concat(t.depKeys))),
              U(t.nextLevelFnKeys, e.fnKey),
              U(e.prevLevelFnKeys, t.fnKey),
              (e.isFirstLevel = !1),
              (n = r.isUpstream) === null || n === void 0 || n.call(r);
          }
        }
        function Ts(e) {
          var r,
            t,
            n = e.scopeType,
            a = n === void 0 ? _s : n,
            u = e.fnCtxBase,
            i = e.isAsyncTransfer,
            o = i === void 0 ? !1 : i,
            s = e.asyncType,
            c = s === void 0 ? Da : s,
            f = e.returnUpstreamResult,
            l = e.runAsync,
            d = l === void 0 ? !0 : l,
            v = e.forAtom,
            y = v === void 0 ? !1 : v,
            p = e.immediate;
          if (!$(e.fn)) throw new Error('ERR_NON_FN: derive need fn arg!');
          var g = e.fn,
            S = g === void 0 ? N : g,
            h = e.deps,
            m = h === void 0 ? N : h,
            E = e.task,
            T = function (R) {
              var M = de(m);
              return (
                R.isFirstCall
                  && M.forEach(function (x) {
                    return Ra(A, { result: x });
                  }),
                S(D()(D()({}, R), {}, { input: M }))
              );
            },
            I = (r = e.isAsync) !== null && r !== void 0 ? r : $(E),
            _ = (t = e.showLoading) !== null && t !== void 0 ? t : I,
            A = ia(T, {
              specificProps: {
                forAtom: y,
                scopeType: a,
                fnType: zu,
                task: E,
                deps: m,
                isAsync: I,
                asyncType: c,
                isAsyncTransfer: o,
                showLoading: _,
              },
              fnCtxBase: u,
            });
          ua(A.fnKey, 0);
          var F = T({ isFirstCall: !0, prevResult: null, triggerReasons: [] });
          Ce();
          var L = je(F);
          y && !L && (F = { val: F, z__is_atom_result__: !0 });
          var b = A.fnKey;
          Ta(A, F),
            Ra(A, {
              result: F,
              isUpstream: function () {
                A.returnUpstreamResult = f != null ? f : !I;
              },
            }),
            dt(A),
            A.returnUpstreamResult || In(F, a, b);
          var K = d && c === Da && (p != null ? p : !e.fn);
          return (
            E
              && K
              && Je(b, { isFirstCall: !0, sn: A.renderInfo.sn + 1 })
                .then(function (C) {
                  Ta(A, C[0], y);
                })
                .catch(function (C) {
                  return ye(C);
                }),
            (A.result = F),
            a === Ks && oa(A) && A.setLoading(!0),
            A.returnUpstreamResult ? (A.proxyResult = F) : Ds(A, y),
            A
          );
        }
        function Ct(e, r) {
          var t = $(e) ? { fn: e } : e || {},
            n = Ts(D()(D()({}, r || {}), t));
          return n;
        }
        function Fa(e) {
          var r = Ct(e, { forAtom: !0 });
          return r.proxyResult;
        }
        function Rs(e) {
          var r = Ct(e);
          return r.proxyResult;
        }
        function Fs(e) {
          return function (r) {
            return D()(D()({}, r), {}, { deps: e });
          };
        }
        function bs(e) {
          return e;
        }
        var Mr = function (r) {
          return [r.snap, r.err];
        };
        function Mt(e) {
          var r = e.target,
            t = e.desc,
            n = t === void 0 ? '' : t,
            a = e.forTask,
            u = a === void 0 ? !1 : a,
            i = B(r),
            o = i.mutateFnDict,
            s = i.snap,
            c = n || ir,
            f = o[c];
          if (!f) return { snap: s, err: new Error('mutate fn '.concat(c, ' not defined')), result: null };
          if (u && !f.task) return { snap: s, err: new Error('mutate task '.concat(c, ' not defined')), result: null };
          var l = { sn: 0, fnItem: f, from: G.MUTATE };
          return u ? bt(r, l) : Aa(r, l);
        }
        function ba(e, r, t, n) {
          return {
            run: function () {
              var u = Mt({ target: e, desc: r });
              return Mr(u);
            },
            runTask: function () {
              return Promise.resolve(Mt({ target: e, desc: r, forTask: !0 })).then(Mr);
            },
            desc: r,
            oriDesc: t,
            getSnap: function () {
              return n.snap;
            },
            snap: n.snap,
            __sharedKey: n.sharedKey,
          };
        }
        function Is(e) {
          var r = e.target,
            t = e.fnItem,
            n = e.label,
            a = Ee(r, { label: n }),
            u = ya(t, '', a.mutateFnDict);
          if (!u) throw new Error('not a fn or fnItem { fn }');
          a.mutateFnDict[u.desc] = u;
          var i = k()({}, u.desc, u);
          return It({ target: r, dict: i }), ba(r, u.desc, u.oriDesc, a);
        }
        function Cs(e) {
          var r = e.target,
            t = e.fnDict,
            n = e.label,
            a = Ee(r, { label: n }),
            u = ga(t, a.mutateFnDict);
          It({ target: r, dict: u });
          var i = {};
          return (
            Object.keys(u).forEach(function (o) {
              i[o] = ba(r, o, o, a);
            }),
            i
          );
        }
        function Ms(e, r) {
          var t = r.label,
            n = r.descOrOptions,
            a = r.forTask,
            u = a === void 0 ? !1 : a,
            i = ys(n),
            o = i.desc,
            s = i.strict;
          if (!o) return { ok: !1, desc: o, forTask: u, err: new Error('miss desc') };
          var c = Qn(e, { label: t, strict: s });
          return c
            ? { ok: !0, desc: o, forTask: u, err: null }
            : { ok: !1, desc: o, forTask: u, err: new Error('not a valid atom or shared result') };
        }
        function Ia(e, r) {
          var t = Ms(e, r),
            n = t.ok,
            a = t.desc,
            u = t.forTask,
            i = t.err;
          if (!n) return u ? Promise.resolve([e, i]) : [e, i];
          var o = Mt({ target: e, desc: a, forTask: u });
          return u ? Promise.resolve(o).then(Mr) : Mr(o);
        }
        function Ca(e, r) {
          return Ia(e, { descOrOptions: r, label: 'runMutate' });
        }
        function Ma(e, r) {
          return Ia(e, { descOrOptions: r, label: 'runMutateTask', forTask: !0 });
        }
        function wa(e) {
          return function (r) {
            return Is({ target: e, fnItem: r, label: 'mutate' });
          };
        }
        function Pa(e) {
          return function (r) {
            return Cs({ target: e, fnDict: r, label: 'mutateDict' });
          };
        }
        function ka(e, r) {
          var t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
            n = Er(e, r, t),
            a = n.tuple;
          return a;
        }
        function ws(e, r) {
          var t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
            n = Er(e, r, t),
            a = n.tuple,
            u = Q()(a, 3),
            i = u[0],
            o = u[1],
            s = u[2];
          return D()(D()({}, s), {}, { state: i, setState: o });
        }
        var Ps = w(90393),
          Oa = w.n(Ps),
          ks = w(7392),
          Os = w.n(ks),
          Ns = 'ERR_NOT_DERIVED_RESULT: useDerived only accept derived result',
          Ls = 'ERR_NOT_ATOM_RESULT: useDerivedAtom only accept derived atom';
        function xs(e, r, t) {
          return e.isExpired ? ((e.isExpired = !1), !0) : $(t) ? !1 : t !== r;
        }
        function Us(e) {
          Dr(e), (e.depKeys.length = 0), (e.prevLevelFnKeys.length = 0), (e.renderInfo.sn += 1);
        }
        function $s(e, r) {
          var t = r.result,
            n = r.forAtom,
            a = r.showLoading,
            u = e.fnCtx,
            i = e.input,
            o = e.deriveFn,
            s = !1;
          if (o) {
            var c = xs(u, i, t);
            if (c) (s = !0), Us(u);
            else return;
          }
          e.input = t;
          var f = je(t);
          if (!f) throw new Error(Ns);
          if (n && !he(t)) throw new Error(Ls);
          (e.deriveFn = function () {
            return f.result;
          }),
            Ct(
              {
                fn: function () {
                  return f.result;
                },
                deps: function () {
                  return [];
                },
                task: (function () {
                  var l = Os()(
                    Oa()().mark(function v() {
                      return Oa()().wrap(function (p) {
                        for (;;)
                          switch ((p.prev = p.next)) {
                            case 0:
                              return p.abrupt('return', f.result);
                            case 1:
                            case 'end':
                              return p.stop();
                          }
                      }, v);
                    }),
                  );
                  function d() {
                    return l.apply(this, arguments);
                  }
                  return d;
                })(),
              },
              {
                isAsync: f.isAsync,
                scopeType: te.HOOK,
                fnCtxBase: u,
                isAsyncTransfer: !0,
                runAsync: !1,
                returnUpstreamResult: !0,
                forAtom: n,
                asyncType: cr.MAY_TRANSFER,
                showLoading: a,
              },
            ),
            zn(u),
            s && u.updater();
        }
        function Na(e, r) {
          var t = r.result,
            n = r.forAtom,
            a = e.hookImpl,
            u = e.react,
            i = a.useForceUpdate(),
            o = u.useRef({ input: t, deriveFn: null, fnCtx: null }),
            s = o.current;
          s.fnCtx || (s.fnCtx = Kr({ updater: i, scopeType: te.HOOK, forAtom: n }));
          var c = s.fnCtx;
          return (c.renderStatus = Le), $s(s, r), c;
        }
        function Ys(e, r) {
          r.shouldReplaceResult && (zn(r), (r.shouldReplaceResult = !1)),
            Ar(e, r.subscribe, function () {
              return Un(r);
            }),
            e.react.useEffect(function () {
              r.renderStatus = Gr;
            });
        }
        function La(e, r) {
          e.react.useEffect(
            function () {
              return (
                (r.mountStatus = sr),
                xn(r),
                function () {
                  Dr(r);
                }
              );
            },
            [r],
          );
        }
        function wt(e, r) {
          var t = Na(e, r);
          return (
            Ar(e, t.subscribe, function () {
              return Un(t);
            }),
            La(e, t),
            t
          );
        }
        function Vs(e, r) {
          var t = Na(e, r);
          return Ys(e, t), La(e, t), t;
        }
        function Pt(e, r, t) {
          var n = Vs(e, D()({ result: r }, t || {})),
            a = n.proxyResult,
            u = n.status,
            i = n.renderInfo,
            o = he(r) ? a.val : a;
          return [o, u, i];
        }
        function xa(e, r, t) {
          if (r === null) return t;
          if (!$(r)) return null;
          var n = e.sharedState,
            a = e.forAtom,
            u = a ? n.val : n,
            i = {};
          at.set(function (s) {
            return (i[s[0]] = 1);
          });
          var o = de(r, u);
          return at.del(), o.includes(u) ? e.key2InsKeys : i;
        }
        function Ua(e, r, t) {
          var n = Ee(r),
            a = e.react.useState(function () {
              return xa(n, t, null);
            }),
            u = Q()(a, 1),
            i = u[0];
          return function (o) {
            var s = n.insCtxMap,
              c = n.key2InsKeys,
              f = xa(n, o, c) || i || c,
              l = {};
            Object.keys(f).forEach(function (y) {
              var p = c[y] || [];
              p.forEach(function (g) {
                return (l[g] = 1);
              });
            });
            var d = Object.keys(l);
            if (d.length) {
              n.sn += 1;
              var v = n.sn;
              Object.keys(l).forEach(function (y) {
                Tt(s, Number(y), v);
              });
            }
          };
        }
        function Gs(e, r) {
          Nt(e);
          var t = gt(),
            n = Et(e, t, { collectType: 'no', globalId: r });
          return n.renderInfo;
        }
        var $a = G.ACTION,
          Ya = G.MUTATE;
        function kt(e, r) {
          Nt(e);
          var t = r || {},
            n = t.target,
            a = t.from,
            u = a === void 0 ? 'Mutate' : a,
            i = ra();
          n && (i = Ee(n));
          var o = _r(le, { apiCtx: e, internal: i, from: u }),
            s = o.loadingProxy,
            c = o.loadingState;
          return { loadingProxy: s, loadingState: c, internal: i, from: u };
        }
        function Va(e, r) {
          var t = kt(e, r),
            n = t.loadingProxy,
            a = t.internal,
            u = t.from,
            i = Et(e, n),
            o = i.proxyState,
            s = i.extra,
            c = i.renderInfo;
          return [_e(s, o, u), a.setState, c];
        }
        function Hs(e, r) {
          var t = kt(e, { target: r, from: Ya }),
            n = t.loadingProxy;
          return n;
        }
        function Bs(e, r) {
          return Va(e, { target: r, from: Ya });
        }
        function js(e, r) {
          var t = kt(e, { target: r, from: $a }),
            n = t.loadingProxy;
          return n;
        }
        function Xs(e, r) {
          return Va(e, { target: r, from: $a });
        }
        function Ga(e) {
          var r = e.hookImpl.useForceUpdate();
          return r;
        }
        function Ha(e, r) {
          var t = function (a, u) {
            var i = null;
            if ($(a)) {
              var o = (0, X.P2)(u),
                s = a(o);
              (i = (0, X._x)(o)), Z(s) && Object.assign(i, s);
            } else Z(a) && (i = D()(D()({}, u), a));
            return i;
          };
          return e.hookImpl.useObjectLogic(r, t, !0);
        }
        function Ws(e, r, t) {
          e.react.useEffect(function () {
            var n = di();
            return (
              n.on(r, t),
              function () {
                return n.off(r, t);
              }
            );
          }, []);
        }
        function Ba(e, r) {
          var t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},
            n = xe(r),
            a = Er(e, r, D()(D()({}, t), {}, { forAtom: n, isReactive: !0 })),
            u = a.insCtx;
          return [u.proxyStateVal, u.proxyState, u.renderInfo];
        }
        function zs(e, r, t) {
          var n = Z(t) ? t : {};
          e.react.useEffect(function () {
            var a = n.srvRef;
            $(a) && a(r);
          }, []);
        }
        function Js(e, r, t) {
          var n = e.hookImpl.useStable(r);
          return zs(e, n, t), n;
        }
        function Zs(e) {
          return function (r) {
            return (e.current = r);
          };
        }
        var ja = te.HOOK;
        function Xa(e, r) {
          e(
            function () {
              var t, n;
              return (
                (r.mountStatus = sr),
                xn(r),
                (t = (n = r.extra).deferedWatch) === null || t === void 0 || t.call(n),
                function () {
                  Dr(r);
                }
              );
            },
            [r],
          );
        }
        function Qs(e, r, t) {
          var n = e.react,
            a = n.useState,
            u = n.useEffect,
            i = a(function () {
              return Kr();
            }),
            o = Q()(i, 1),
            s = o[0];
          if (s.fn === N) {
            var c = t.manualDepKeys,
              f = c === void 0 ? [] : c,
              l = function () {
                return f.map(function (v) {
                  var y = Mn(v),
                    p = y.sharedKey,
                    g = y.keyPath,
                    S = Di(p);
                  return ge(S, g);
                });
              };
            Cr(r, { scopeType: ja, fnCtxBase: s, deps: l, isSimpleWatch: !0 });
          }
          Xa(u, s);
        }
        function qs(e, r, t) {
          var n = e.react,
            a = n.useRef,
            u = n.useState,
            i = n.useMemo,
            o = n.useEffect,
            s = a({ fn: r, wrap: null }),
            c = u(function () {
              return Kr();
            }),
            f = Q()(c, 1),
            l = f[0];
          if (
            ((s.current.fn = i(
              function () {
                return r;
              },
              [r],
            )),
            !s.current.wrap)
          ) {
            var d = ha(t),
              v = d.deps,
              y = d.immediate;
            (s.current.wrap = function (p) {
              l.mountStatus === sr
                ? s.current.fn(p)
                : (l.extra.deferedWatch = function () {
                    return s.current.fn(p);
                  });
            }),
              Cr(s.current.wrap, { scopeType: ja, fnCtxBase: l, deps: v, immediate: y, label: 'useWatch' });
          }
          Xa(o, l);
        }
        function ec(e) {
          var r = e.internal,
            t = e.setFactoryOpts,
            n = r.rawState,
            a = r.forAtom,
            u = r.stopDepth,
            i = r.sharedKey,
            o = Wr(t),
            s = D()({}, n),
            c = function (y, p, g, S) {
              var h = Ve(p, g, { parentType: kn(y), parentKeyPath: S });
              fa(h, { internal: r, mutateCtx: o }), Wt(s, h.fullKeyPath, g);
            },
            f = function v(y, p, g) {
              return Ue(y, {
                set: function (h, m, E) {
                  return c(h, m, E, g), !0;
                },
                get: function (h, m) {
                  var E = h[m];
                  if (ur.includes(m)) return Sr(p === 1, a, i, m, E);
                  var T = Ve(m, E, { isChanged: !1, parentKeyPath: g, op: 'get', parentType: kn(h) });
                  return p < u && Ae(E) ? v(E, p + 1, T.fullKeyPath) : ge(s, T.fullKeyPath);
                },
              });
            },
            l = f(s, 1, []);
          yr.set(l), it.set(o);
          var d = a ? l.val : l;
          return {
            draftRoot: l,
            draftNode: d,
            finishMutate: function (y) {
              var p = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
              pa(o, p);
              var g = D()({ state: {}, mutateCtx: o }, e);
              va(g, l, d, y);
            },
          };
        }
        function rc(e) {
          var r = e;
          if (e) {
            e.persist && e.persist();
            var t = e.currentTarget;
            t && e.type
              ? t.tagName === 'INPUT' && t.type === 'checkbox'
                ? (r = t.checked)
                : (r = t.value)
              : e.nativeEvent && e.target && (r = e.target.value);
          }
          return r;
        }
        function tc(e) {
          var r = [],
            t = Qi(e, function (n) {
              var a = n.fullKeyPath;
              r = a;
            });
          return {
            target: t,
            getPath: function () {
              return r;
            },
          };
        }
        function Wa(e, r, t) {
          var n = function (u) {
            var i = rc(u);
            e(
              function (o) {
                var s = yr.current(),
                  c = o !== s,
                  f = { draft: o, draftRoot: s, path: r, isAtom: c, UNDEFINED: Hu },
                  l = t == null ? void 0 : t(i, f);
                Wt(s, r, l !== void 0 ? l : i);
              },
              { from: G.SYNC },
            );
          };
          return n;
        }
        function Ot(e, r) {
          var t = r.sharedKey,
            n = r.innerSetState,
            a = W(e, t),
            u = za.get(a);
          return u || ((u = Wa(n, e)), za.set(a, u)), u;
        }
        var za = new Map();
        function Ja(e) {
          var r = e.forAtom,
            t = e.rawState;
          return r
            ? Bt(t.val)
              ? Ue(t.val, {
                  get: function (a, u) {
                    return Ot(['val', u], e);
                  },
                })
              : Ot(['val'], e)
            : Ue(t, {
                get: function (a, u) {
                  return Ot([u], e);
                },
              });
        }
        var Za = new Map();
        function Qa(e) {
          var r = e.forAtom,
            t = e.sharedKey,
            n = e.innerSetState,
            a = e.rawState,
            u = tc(a);
          return function (i, o) {
            var s = [];
            if (Array.isArray(i)) s = r ? ['val'].concat(Rt()(i)) : i;
            else {
              var c = u.target,
                f = u.getPath;
              i(r ? c.val : c), (s = f());
            }
            var l = W(s, t);
            o && (l += ''.concat(o.toString()));
            var d = Za.get(l);
            return d || ((d = Wa(n, s, o)), Za.set(l, d)), d;
          };
        }
        function nc(e, r) {
          var t = r.deep,
            n = r.forAtom,
            a = r.sharedKey,
            u = ps(r),
            i = xr(t),
            o = function () {
              var S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
                h = { internal: p, setFactoryOpts: S },
                m = i ? ss(h) : ec(h),
                E = m.finishMutate,
                T = m.draftRoot,
                I = m.draftNode;
              return {
                finish: function (A) {
                  var F = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
                    L = p.snap;
                  if (A === L) return L;
                  var b = eo(n, A, I);
                  return E(b, F), p.snap;
                },
                draftRoot: T,
                draftNode: I,
              };
            },
            s = function () {
              var S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
              return o(S);
            },
            c = function (S) {
              var h = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
              return o().finish(S, h);
            },
            f = function (S, h) {
              var m = Q()(h, 3),
                E = m[0],
                T = m[1],
                I = m[2];
              mt(e, He.current(a));
              var _ = o({ handleCbReturn: E, enableDep: T });
              return _.finish(S, ls(I));
            },
            l = function (S, h) {
              return f(S, [!0, !0, h]);
            },
            d = function (S, h) {
              return f(S, [!1, !0, h]);
            },
            v = function (S, h) {
              return f(S, [!0, !1, h]);
            },
            y = function (S, h) {
              return f(S, [!1, !1, h]);
            },
            p = An(r, {
              sharedState: e,
              setState: l,
              setDraft: d,
              insSetState: v,
              insSetDraft: y,
              setStateFactory: s,
              innerSetState: c,
              ruleConf: u,
              isDeep: i,
            });
          return (p.sync = Qa(p)), (p.syncer = Ja(p)), Si(e, p), p;
        }
        function ac(e, r) {
          var t = vs(e, r),
            n = oo(t),
            a = n.sharedRoot,
            u = n.sharedState,
            i = nc(a, t);
          Ti(a, t), ji(), It({ target: a, dict: t.mutateFnDict });
          var o = St(i, { isTop: !0 }),
            s = o.draft,
            c = o.draftRoot;
          return (
            (i.reactive = s),
            (i.reactiveRoot = c),
            mi(t.moduleName, i.loc),
            jo(i.usefulName),
            li(i),
            { sharedRoot: a, sharedState: u, internal: i, parsedOptions: t }
          );
        }
        var qa = q.USER_STATE,
          uc = G.MUTATE,
          eu = G.ACTION;
        function Nt(e, r) {
          var t = r || qa;
          qa === t && !gt() && (so(e, le), Vo(e, le));
        }
        function ru(e, r) {
          var t = e.createFn,
            n = e.ldAction,
            a = e.actionDict,
            u = e.actionCreator,
            i = e.internal,
            o = e.apiCtx,
            s = e.forTp,
            c = s === void 0 ? !1 : s;
          _r(t, { internal: i, from: eu, apiCtx: o });
          var f = {},
            l = {};
          return (
            Object.keys(a).forEach(function (d) {
              var v = a[d],
                y = c ? v.__task : v,
                p = u(!1)(y, d, r);
              (p.__fnName = d), (l[d] = p);
              var g = function () {
                var h = p.apply(void 0, arguments);
                return Ss(y)
                  ? Promise.resolve(h).then(function (m) {
                      return m.result;
                    })
                  : h.result;
              };
              (g.__fnName = d), (f[d] = g);
            }),
            {
              actions: f,
              eActions: l,
              getLoading: function () {
                return n.getLoading(f);
              },
              useLoading: function () {
                return n.useLoading(f)[0];
              },
              useLoadingInfo: function () {
                return n.useLoading(f);
              },
            }
          );
        }
        function tu(e) {
          var r = e.state,
            t = e.ldMutate,
            n = e.mutateFnDict,
            a = Pa(r)(n);
          return {
            witnessDict: a,
            getLoading: function () {
              return t.getLoading(a);
            },
            useLoading: function () {
              return t.useLoading(a)[0];
            },
            useLoadingInfo: function () {
              return t.useLoading(a);
            },
          };
        }
        function ic(e) {
          var r = e.apiCtx,
            t = e.ldMutate,
            n = e.inital,
            a = e.mutateFnDict,
            u = Lt(r, n),
            i = Q()(u, 3),
            o = i[0],
            s = i[2],
            c = tu({ state: o, ldMutate: t, mutateFnDict: a }),
            f = function (d) {
              var v = s.useState(d),
                y = Q()(v, 3),
                p = y[0],
                g = y[2];
              return [p, g];
            };
          return D()({ derivedState: o, useDerivedState: f }, c);
        }
        function oc(e) {
          var r = e.apiCtx,
            t = e.deriveFnDict,
            n = e.throwErr,
            a = {},
            u = {};
          Object.keys(t).forEach(function (o) {
            var s = Fa(t[o]);
            (a[o] = s),
              (u[o] = {
                runDerive: function (f) {
                  return rs(s, f != null ? f : n);
                },
                runDeriveTask: function (f) {
                  return ts(s, f != null ? f : n);
                },
                useDerived: function (f) {
                  return Pt(r, s, f)[0];
                },
                useDerivedInfo: function (f) {
                  return Pt(r, s, f);
                },
              });
          });
          var i = new Proxy(a, {
            get: function (s, c) {
              return a[c].val;
            },
          });
          return { result: i, helper: u };
        }
        function le(e, r) {
          var t = e.stateType,
            n = e.apiCtx;
          Nt(n, t);
          var a = ac(e, r),
            u = a.sharedRoot,
            i = a.sharedState,
            o = a.internal,
            s = o.syncer,
            c = o.sync,
            f = o.forAtom,
            l = o.setState,
            d = o.setDraft,
            v = o.sharedKey,
            y = o.sharedKeyStr,
            p = o.rootValKey,
            g = o.reactive,
            S = o.reactiveRoot,
            h = Ka(u),
            m = h(),
            E = { internal: o, from: uc, apiCtx: n },
            T = le,
            I = aa(T, D()(D()({}, E), {}, { from: eu })),
            _ = aa(T, E),
            A = function (K) {
              return (o.onRead = K);
            },
            F = { createFn: T, internal: o, apiCtx: n },
            L = D()(D()({}, F), {}, { ldAction: I, actionCreator: h });
          return {
            state: u,
            stateVal: i,
            setState: l,
            setDraft: d,
            defineActions: function (K) {
              return function (C) {
                return ru(D()(D()({}, L), {}, { actionDict: C }), K);
              };
            },
            defineTpActions: function (K) {
              return function (C) {
                return ru(D()(D()({}, L), {}, { actionDict: C, forTp: !0 }), K);
              };
            },
            defineMutateDerive: function (K) {
              return function (C) {
                return ic(D()(D()({}, F), {}, { ldMutate: _, inital: K, mutateFnDict: C }));
              };
            },
            defineMutateSelf: function () {
              return function (K) {
                return tu({ ldMutate: _, state: u, mutateFnDict: K });
              };
            },
            defineFullDerive: function (K) {
              return function (C) {
                return oc({ apiCtx: n, deriveFnDict: C, throwErr: K });
              };
            },
            mutate: wa(u),
            runMutate: function (K) {
              return Ca(u, K);
            },
            runMutateTask: function (K) {
              return Ma(u, K);
            },
            action: h,
            call: function (K, C, R, M) {
              return m(K, R, M)(C);
            },
            useState: function (K) {
              return ka(n, u, K);
            },
            useForceUpdate: function (K) {
              return Ua(n, u, K);
            },
            useLocalState: function (K) {
              return Ha(n, K);
            },
            useLocalForceUpdate: function () {
              return Ga(n);
            },
            getMutateLoading: _.getLoading,
            useMutateLoading: _.useLoading,
            getActionLoading: I.getLoading,
            useActionLoading: I.useLoading,
            sync: c,
            syncer: s,
            setOnReadHook: A,
            sharedKey: v,
            sharedKeyStr: y,
            rootValKey: p,
            reactive: g,
            reactiveRoot: S,
            reactiveDesc: function (K) {
              return Hn(u, K);
            },
            useReactive: function (K) {
              return Ba(n, u, K);
            },
            flush: function (K) {
              return mt(u, K);
            },
            isAtom: f,
          };
        }
        function Lt(e, r, t) {
          var n = le({ apiCtx: e, rawState: r }, t);
          return [n.state, n.setState, n];
        }
        function sc(e, r, t) {
          return le({ apiCtx: e, rawState: r }, t);
        }
        function cc(e, r, t) {
          var n = le({ apiCtx: e, rawState: r, forAtom: !0 }, t);
          return [n.state, n.setState, n];
        }
        function fc(e, r, t) {
          return le({ apiCtx: e, rawState: r, forAtom: !0 }, t);
        }
        function nu(e, r) {
          var t = r.label,
            n = r.isSyncer,
            a = Ee(e, { label: t }),
            u = n ? Ja : Qa;
          return u(a);
        }
        function lc(e) {
          return nu(e, { label: 'sync' });
        }
        function dc(e) {
          return nu(e, { label: 'syncer', isSyncer: !0 });
        }
        var vc = 100,
          pc = 5e3;
        function yc(e, r) {
          return {
            key: e,
            results: [],
            depKeys: [],
            enableStatus: r,
            collected: !1,
            mounted: !1,
            renderAtomOnce: !1,
            time: 0,
            status: { loading: !1, err: null, ok: !0 },
          };
        }
        function gc(e) {
          var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1,
            t = ee();
          e && (t.initCount += 1);
          var n = wi(),
            a = yc(n, r);
          return $n(e).set(n, a), a;
        }
        function hc(e) {
          var r = ee();
          (e.mounted = !0), (e.time = Date.now()), (r.mountedCount += 1);
        }
        function mc(e, r) {
          var t = ee(),
            n = $n(r);
          if ((n.delete(e), r && n.size === vc && t.initCount - t.mountedCount > 2)) {
            (t.initCount = 0), (t.mountedCount = 0);
            var a = Date.now();
            n.forEach(function (u, i) {
              !u.mounted && a - u.time > pc && n.delete(i);
            });
          }
        }
        function Sc(e, r) {
          var t = ee();
          (t.runningKey = e.key), (t.isDynamic = r);
        }
        function Ac(e) {
          var r = ee();
          (r.runningKey = ''), (r.isDynamic = !1), (e.collected = !0);
        }
        function Ec(e, r, t) {
          Qs(e, t, { manualDepKeys: r.depKeys });
        }
        function au(e, r, t) {
          var n = { loading: !1, err: null, ok: !0 };
          return (
            Ec(e, r, t),
            r.results.forEach(function (a) {
              var u = wt(e, { result: a, forAtom: he(a), showLoading: r.enableStatus });
              u.status.ok || (n = u.status);
            }),
            n
          );
        }
        function uu(e, r, t) {
          e.react.useEffect(
            function () {
              return (
                r.mounted || hc(r),
                function () {
                  mc(r.key, t);
                }
              );
            },
            [r],
          );
        }
        var Me = function () {
            return !0;
          },
          _c = function (r) {
            return r;
          };
        function Kc(e) {
          for (var r = [], t = 1; t <= e.length; t++) r.push(e.slice(0, t));
          return r;
        }
        function xt(e, r, t, n, a) {
          var u = r;
          return (u.displayName = t), n ? e.react.memo(u, a) : u;
        }
        function iu(e, r) {
          var t = r.sharedState,
            n = r.depKey,
            a = r.keyPath,
            u = r.compare,
            i = r.sharedKey,
            o = r.format,
            s = o === void 0 ? _c : o,
            c = function () {
              var l = Et(e, t, { arrDep: !0 });
              if (l.isFirstRender)
                if (a.length >= 2) {
                  var d = Kc(a);
                  d.forEach(function (y) {
                    l.recordDep({ sharedKey: i, depKey: W(y, i), keyPath: y, parentKeyPath: y.slice(0, y.length - 1) }, fr);
                  });
                } else l.recordDep({ sharedKey: i, depKey: n, keyPath: a });
              var v = ge(l.internal.rawState, a);
              return s(v);
            };
          return xt(e, c, 'HeluxSignal', !0, u);
        }
        function Ut(e, r, t) {
          var n = function () {
            var u = wt(e, { result: r, forAtom: !0 });
            return u.proxyResult.val;
          };
          return xt(e, n, 'HeluxDerivedAtomSignal', !0, t);
        }
        function Dc(e, r, t, n) {
          var a = function () {
            return wt(e, { result: r, forAtom: !1 }), ge(r, t);
          };
          return xt(e, a, 'HeluxDerivedSignal', !0, n);
        }
        function ou(e, r) {
          var t = r.isDynamic,
            n = r.cb,
            a = r.props,
            u = r.ref,
            i = e.collected,
            o = e.status;
          i || Sc(e, t);
          var s = { props: a, status: o, read: Ku, ref: u },
            c = n(a, s) || '';
          return i || Ac(e), c;
        }
        function su(e, r, t) {
          var n = he(t);
          if (r.renderAtomOnce && !n)
            throw new Error('block cb once returned derived atom but not keep to return it in new render period!');
          if (n) {
            r.renderAtomOnce = !0;
            var a = Ut(e, t);
            return e.react.createElement(a, { status: { loading: !1, err: null, ok: !0 } });
          }
          return on(t);
        }
        function cu(e, r, t, n) {
          var a = n || {},
            u = a.memo,
            i = u === void 0 ? !0 : u,
            o = a.compare,
            s = r.key,
            c = e.react,
            f = c.forwardRef || N,
            l = t(),
            d = f(l);
          pe()
            && ((l.displayName = 'HeluxKeyedBlockForHMR'),
            (d = f(function (y, p) {
              return p && bu(p, 'current') && (r.ref = p), c.createElement(l, D()(D()({}, y), {}, { key: s }));
            })));
          var v = i ? c.memo(d, o) : d;
          return (v.displayName = 'HeluxBlock'), (v[Vr] = !0), v;
        }
        function Tc(e, r) {
          var t = e.cb,
            n = e.isDynamic,
            a = e.apiCtx,
            u = e.blockCtx,
            i = a.hookImpl.useForceUpdate,
            o = n ? uu : N;
          return cu(
            a,
            u,
            function () {
              return function (s, c) {
                var f = u.ref || c,
                  l = ou(u, { isDynamic: n, cb: t, props: s, ref: f }),
                  d = i();
                return au(a, u, d), o(a, u, n), su(a, u, l);
              };
            },
            r,
          );
        }
        function Rc(e, r) {
          var t = e.cb,
            n = e.isDynamic,
            a = e.apiCtx,
            u = e.blockCtx,
            i = n ? uu : N,
            o = a.hookImpl.useForceUpdate,
            s = a.react.useEffect;
          return cu(
            a,
            u,
            function () {
              return function (c, f) {
                var l = u.ref || f,
                  d = ou(u, { isDynamic: n, cb: t, props: c, ref: l }),
                  v = o(),
                  y = au(a, u, v);
                i(a, u, n);
                var p = u.status.loading,
                  g = y.loading;
                return (
                  s(
                    function () {
                      p !== g && v();
                    },
                    [p, g],
                  ),
                  (u.status = y),
                  su(a, u, d)
                );
              };
            },
            r,
          );
        }
        function fu(e, r) {
          var t = gs(r),
            n = t.enableStatus,
            a = D()(D()({}, e), {}, { blockCtx: gc(e.isDynamic, n) });
          return n ? Rc(a, t) : Tc(a, t);
        }
        function Fc(e, r, t) {
          var n = fu({ apiCtx: e, isDynamic: !1, cb: r }, t);
          return n;
        }
        function lu(e, r, t) {
          var n = fu({ apiCtx: e, isDynamic: !0, cb: r }, t);
          return n;
        }
        function du(e, r, t) {
          var n = e.react;
          if (r && r[Vr]) return n.createElement(r);
          if ($(r)) {
            var a = lu(e, r, { compare: Me });
            return n.createElement(a);
          }
          if (he(r)) {
            var u = Ut(e, r, Me);
            return n.createElement(u);
          }
          if (xe(r)) {
            var i = ce(r),
              o = Lr('val', i),
              s = { sharedKey: i, sharedState: r, depKey: o, keyPath: ['val'], compare: Me },
              c = iu(e, s);
            return n.createElement(c);
          }
          var f = io(),
            l = f.sharedKey,
            d = f.val,
            v = f.stateOrResult,
            y = f.depKey,
            p = f.keyPath,
            g = f.isDerivedResult;
          if (r === d && v) {
            if (f.isDerivedAtom) {
              var S = Ut(e, v, Me);
              return n.createElement(S);
            }
            if (g) {
              var h = Dc(e, v, p, Me);
              return n.createElement(h);
            }
            var m = iu(e, { sharedKey: l, sharedState: v, depKey: y, keyPath: p, compare: Me, format: t });
            return n.createElement(m);
          }
          return r;
        }
        var bc = X.Eg.shallowCompare,
          Ic = X.Eg.isDiff,
          Cc = Lt,
          Mc = du;
        function vu(e, r, t) {
          return r(e, t);
        }
        function wc(e, r) {
          return vu(e, r);
        }
        function Pc(e, r) {
          return {
            build: function (n) {
              return vu(e, r, n);
            },
          };
        }
        var kc = [
          'atom',
          'atomx',
          'share',
          'sharex',
          'getMutateLoading',
          'getActionLoading',
          '$',
          'signal',
          'block',
          'blockStatus',
          'dynamicBlock',
          'dynamicBlockStatus',
        ];
        function Oc(e) {
          return e.startsWith('use') || kc.includes(e);
        }
        function Nc(e) {
          return Object.assign({ useSyncExternalStore: N }, e);
        }
        function pu(e, r) {
          var t = Uu(e),
            n = D()({}, t),
            a = { react: Nc(e), hookImpl: t, act: r };
          r
            && (t.useForceUpdate = function () {
              var o = e.useState({}),
                s = Q()(o, 2),
                c = s[1];
              return function () {
                return r(function () {
                  return c({});
                });
              };
            });
          var u = Pr;
          Object.keys(u).forEach(function (o) {
            var s = u[o];
            Oc(o) ? (n[o] = s.bind(null, a)) : (n[o] = s);
          });
          var i = {
            model: function (s) {
              return wc(n, s);
            },
            modelFactory: function (s) {
              return Pc(n, s);
            },
          };
          return Object.assign(i, n);
        }
        function Lc(e) {
          var r = ai(),
            t = r.inited,
            n = r.API;
          if (t) return n;
          var a = e.heluxCtxKey,
            u = e.standalone,
            i = e.transfer,
            o = e.reactLib,
            s = e.act,
            c = ve[a],
            f = function (v) {
              var y = cn(),
                p = pu(o, s);
              return dn({ ROOT: y, inited: !0, api: p }), (ve[v] = y), p;
            };
          if (!c) return f(a);
          if (u) return f(''.concat(String(a), '_').concat(Date.now()));
          if (i) {
            var l = cn();
            dn({ ROOT: l, inited: !0 }), i(c, l);
          }
          return pu(o);
        }
        var xc = w(70079),
          Uc = w.t(xc, 2),
          yu = Lc({ heluxCtxKey: '__HELUX__', reactLib: Uc }),
          $c = yu.share,
          {
            atom: Yc,
            atomx: Vc,
            share: Gc,
            sharex: Hc,
            derive: Bc,
            deriveDict: jc,
            defineDeriveTask: Xc,
            defineDeriveFnItem: Wc,
            runDerive: zc,
            runDeriveTask: Jc,
            watch: Zc,
            useAtom: Qc,
            useAtomX: qc,
            useReactive: ef,
            useDerived: rf,
            useWatch: tf,
            useGlobalId: nf,
            useService: af,
            useOnEvent: uf,
            useMutable: of,
            useMutateLoading: sf,
            useActionLoading: cf,
            useEffect: ff,
            useLayoutEffect: lf,
            useStable: df,
            useObject: vf,
            useLocalForceUpdate: pf,
            useGlobalForceUpdate: yf,
            action: gf,
            signal: hf,
            block: mf,
            dynamicBlock: Sf,
            $: Af,
            mutate: Ef,
            mutateDict: _f,
            runMutate: Kf,
            runMutateTask: Df,
            sync: Tf,
            syncer: Rf,
            model: Ff,
            modelFactory: bf,
            emit: If,
            on: Cf,
            reactiveDesc: Mf,
            flush: wf,
            isAtom: Pf,
            isDerivedAtom: kf,
            storeSrv: Of,
            shallowCompare: Nf,
            isDiff: Lf,
            produce: xf,
            getMutateLoading: Uf,
            getActionLoading: $f,
            getDeriveLoading: Yf,
            getRawState: Vf,
            getSnap: Gf,
            getAtom: Hf,
            addMiddleware: Bf,
            addPlugin: jf,
            EVENT_NAME: Xf,
            RECORD_LOADING: Wf,
            VER: zf,
            LIMU_VER: Jf,
          } = yu;
      },
    },
  ]);
})();
