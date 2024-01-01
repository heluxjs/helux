'use strict';
(self.webpackChunkhelux_docs = self.webpackChunkhelux_docs || []).push([
  [636],
  {
    18636: function (Tt, be, Ne) {
      Ne.d(be, {
        TT: function () {
          return Et;
        },
        P2: function () {
          return Ae;
        },
        _x: function () {
          return Ve;
        },
        OA: function () {
          return At;
        },
        limuUtils: function () {
          return gt;
        },
        Uy: function () {
          return Ct;
        },
      });
      const Dt = 3,
        Ie = '3.11.10',
        U = Symbol('M'),
        se = Symbol('V'),
        ie = Symbol('IMMUT_BASE'),
        A = 'Map',
        x = 'Set',
        V = 'Array',
        Be = 'Object',
        Ke = [Symbol.iterator, Symbol.toStringTag],
        ze = { Map: A, Set: x, Array: V },
        k = '[object Object]',
        H = '[object Map]',
        Y = '[object Set]',
        J = '[object Array]',
        X = '[object Function]',
        Le = { [H]: A, [Y]: x, [J]: V, [k]: Be },
        Ue = ['push', 'pop', 'shift', 'splice', 'unshift', 'reverse', 'copyWithin', 'delete', 'fill'],
        He = ['set', 'clear', 'delete'],
        Ye = ['add', 'clear', 'delete'],
        Ge = ['splice', 'sort', 'unshift', 'shift'],
        We = [
          'concat',
          'copyWithin',
          'entries',
          'every',
          'fill',
          'filter',
          'find',
          'findIndex',
          'flat',
          'flatMap',
          'forEach',
          'includes',
          'indexOf',
          'join',
          'keys',
          'lastIndexOf',
          'map',
          'pop',
          'push',
          'reduce',
          'reduceRight',
          'reverse',
          'shift',
          'unshift',
          'slice',
          'some',
          'sort',
          'splice',
          'values',
          'valueOf',
        ],
        ke = ['clear', 'delete', 'entries', 'forEach', 'get', 'has', 'keys', 'set', 'values'],
        Je = ['add', 'clear', 'delete', 'entries', 'forEach', 'has', 'keys', 'values'],
        ae = { [A]: ke, [x]: Je, [V]: We },
        Xe = {
          [A]: ['clear', 'set', 'delete'],
          [x]: ['clear', 'add', 'delete'],
          [V]: ['pop', 'push', 'shift', 'unshift', 'splice', 'sort', 'copyWithin'],
        },
        $e = { [A]: ['forEach', 'get'], [x]: ['forEach'], [V]: ['forEach', 'map'] },
        B = { value: 0, usablePrefix: 1 },
        ce = { autoFreeze: !1, fastModeRange: 'array' },
        qe = Object.prototype.toString,
        Qe = !!Reflect,
        Ze = Object.prototype.hasOwnProperty;
      function le(e, t) {
        return Qe ? Reflect.has(e, t) : Ze.call(e, t);
      }
      function je(e, t, n, r) {
        const o = (s, l, a) => {
          R(s)
            || (r(s, l, a),
            Array.isArray(s)
              && s.forEach((i, f) => {
                o(i, s, f);
              }),
            G(s)
              && s.forEach((i, f) => {
                o(i, s, f);
              }),
            K(s)
              && Object.keys(s).forEach((i) => {
                o(s[i], s, i);
              }));
        };
        o(e, t, n);
      }
      function w(e) {
        return qe.call(e);
      }
      function N(...e) {
        return e;
      }
      function K(e) {
        return w(e) === k;
      }
      function G(e) {
        return w(e) === H;
      }
      function $(e) {
        return w(e) === Y;
      }
      function F(e) {
        return w(e) === X;
      }
      function ue(e) {
        var t = w(e);
        return Le[t];
      }
      function R(e) {
        const t = w(e);
        return ![k, J, H, Y, X].includes(t);
      }
      function fe(e) {
        return e.constructor.name === 'AsyncFunction' || typeof e.then == 'function';
      }
      function pe(e) {
        return typeof Promise != 'undefined' && e instanceof Promise;
      }
      function q(e) {
        var t = typeof e;
        return t === 'number' ? !0 : t === 'string' ? /^[0-9]*$/.test(e) : !1;
      }
      function et(e) {
        return typeof e == 'symbol';
      }
      const tt = { [J]: Array.prototype, [H]: Map.prototype, [Y]: Set.prototype, [X]: Function.prototype };
      function nt(e) {
        const t = w(e),
          n = tt[t] || Object.prototype,
          r = Object.create(null);
        return Object.setPrototypeOf(r, n), Object.setPrototypeOf(e, r), e;
      }
      const Q = new Map();
      function z(e) {
        e.rootMeta.modified = !0;
        const t = (n) => {
          n && !n.modified && ((n.modified = !0), t(n.parentMeta));
        };
        t(e);
      }
      function Z(e, t, n) {
        if (n.apiCtx.debug) {
          const { fast: r } = n;
          r ? (e[U] = t) : (nt(e), (e.__proto__[U] = t));
        }
        return e;
      }
      function rt(e, t, n) {
        const r = [t],
          o = T(e, n);
        if (o && o.level > 0) {
          const { keyPath: s } = o;
          return [...s, t];
        }
        return r;
      }
      function ot(e, t, n) {
        const { ver: r, parentMeta: o = null, immutBase: s, compareVer: l, apiCtx: a, hasOnOperate: i } = n,
          f = ue(t);
        let d = [],
          c = 0,
          _ = null;
        o && ((_ = o.copy), (c = it(_, a)), (d = rt(_, e, a)));
        const y = {
          rootMeta: null,
          parentMeta: o,
          parent: _,
          selfType: f,
          self: t,
          copy: null,
          key: e,
          keyPath: d,
          level: c,
          proxyVal: null,
          proxyItems: null,
          modified: !1,
          scopes: [],
          isImmutBase: s,
          isDel: !1,
          isFast: !1,
          isArrOrderChanged: !1,
          newNodeStats: {},
          newNodeMap: new Map(),
          newNodes: [],
          ver: r,
          compareVer: l,
          revoke: N,
          hasOnOperate: i,
          execOnOperate: N,
        };
        return c === 0 ? (y.rootMeta = y) : (y.rootMeta = o.rootMeta), y;
      }
      function de(e) {
        const t = j(e);
        return t ? !t.isImmutBase : !1;
      }
      function st() {
        B.value >= Number.MAX_SAFE_INTEGER ? ((B.value = 1), (B.usablePrefix += 1)) : (B.value += 1);
        const { value: e, usablePrefix: t } = B;
        return `${t}_${e}`;
      }
      function it(e, t) {
        const n = b(e, t);
        return n ? n.level + 1 : 1;
      }
      function T(e, t) {
        return t.metaMap.get(e);
      }
      function b(e, t) {
        let n = t || me(e);
        return (n == null ? void 0 : n.metaMap.get(e)) || null;
      }
      function ye(e) {
        return (e && e[se]) || '';
      }
      function me(e) {
        const t = ye(e);
        return Q.get(t) || null;
      }
      function j(e) {
        const t = me(e);
        return (t && t.metaMap.get(e)) || null;
      }
      function Me(e, t) {
        const n = j(e),
          r = j(t);
        if (!n && !r) return !Object.is(e, t);
        const {
            self: o,
            modified: s,
            compareVer: l,
            ver: a,
            level: i,
          } = n || { self: e, modified: !1, compareVer: !1, ver: '0', level: 0 },
          { self: f, modified: d, compareVer: c, ver: _, level: y } = r || { self: t, modified: !1, compareVer: !1, ver: '0', level: 0 };
        return o !== f || ((l || c) && (i === 0 || y === 0) && a !== _) ? !0 : s || d;
      }
      function at(e, t, n = !0) {
        const r = n ? Me : Object.is;
        return !((l, a) => {
          for (let i in l) if (!(i in a)) return !0;
          for (let i in a) if (r(l[i], a[i])) return !0;
          return !1;
        })(e, t);
      }
      function wt(e) {
        const t = (n) => {
          if (isPrimitive(n)) return n;
          let r = n;
          if (
            (Array.isArray(n)
              && ((r = n.slice()),
              r.forEach((o, s) => {
                r[s] = t(o);
              })),
            isSet(n))
          ) {
            const o = Array.from(n);
            o.forEach((s, l) => {
              o[l] = t(s);
            }),
              (r = new Set(o));
          }
          return (
            isMap(n)
              && ((r = new Map(n)),
              r.forEach((o, s) => {
                r.set(s, t(o));
              })),
            isObject(n)
              && ((r = {}),
              Object.keys(n).forEach((o) => {
                r[o] = t(n[o]);
              })),
            r
          );
        };
        return t(e);
      }
      function ct(e, t) {
        const { parentType: n, fastModeRange: r } = t;
        if (Array.isArray(e)) return { copy: e.slice(), fast: !1 };
        const o = (r === 'array' && n === V) || r === 'all';
        let s = e;
        return e && K(e) && (s = Object.assign({}, e)), G(e) && (s = new Map(e)), $(e) && (s = new Set(e)), { copy: s, fast: o };
      }
      function lt(e, t, n) {
        const { apiCtx: r, immutBase: o } = n;
        if (o) return { copy: e, fast: !1 };
        const { copy: s, fast: l } = ct(e, n);
        return Z(s, t, { apiCtx: r, fast: l }), { copy: s, fast: l };
      }
      function ut(e, t, n) {
        const { copy: r, isArrOrderChanged: o } = e,
          { targetNode: s, key: l } = n;
        if (o) {
          const a = r.findIndex((i) => i === t.copy);
          a >= 0 && (r[a] = s);
          return;
        }
        r[l] = s;
      }
      function ft(e, t) {
        return K(e) ? ye(e) === t : !0;
      }
      function pt(e, t) {
        const { debug: n } = t,
          r = new Map();
        t.newNodeMap.forEach((o) => {
          const { node: s, parent: l, key: a } = o,
            i = r.get(s);
          if (i) {
            l[a] = i;
            return;
          }
          const f = o;
          je(s, l, a, (d, c, _) => {
            const y = b(d, t);
            if (y) {
              const { modified: O, copy: g, self: M } = y,
                P = O ? g : M;
              c[_] = P;
            }
          }),
            (f.target = l[a]),
            r.set(s, f.target);
        }),
          e.scopes.forEach((o) => {
            const { modified: s, copy: l, parentMeta: a, key: i, self: f, revoke: d, proxyVal: c, isDel: _, isFast: y } = o;
            if (!l || (n && (y ? delete l[U] : delete l.__proto__[U]), !a)) return d();
            const O = s ? l : f,
              g = a.copy,
              M = a.selfType;
            if (M === A) return g.set(i, O), d();
            if (M === x) return g.delete(c), g.add(O), d();
            if (M === V) return ut(a, o, { targetNode: O, key: i }), d();
            if (_ !== !0) return (g[i] = O), d();
          }),
          (e.scopes.length = 0);
      }
      function dt(e, t) {
        const { self: n, copy: r, modified: o } = e;
        let s = n;
        return r && o && (s = e.copy), pt(e, t), s;
      }
      function he(e) {
        e.rootMeta.scopes.push(e);
      }
      function _e(e, t, n) {
        const { traps: r, parentType: o, fastModeRange: s, immutBase: l, apiCtx: a } = n,
          i = ot(e, t, n),
          { copy: f, fast: d } = lt(t, i, { immutBase: l, parentType: o, fastModeRange: s, apiCtx: a });
        if (((i.copy = f), (i.isFast = d), l)) {
          const c = new Proxy(f, r);
          (i.proxyVal = c), (i.revoke = N);
        } else {
          const c = Proxy.revocable(f, r);
          (i.proxyVal = c.proxy), (i.revoke = c.revoke);
        }
        return a.metaMap.set(f, i), a.metaMap.set(i.proxyVal, i), i;
      }
      function yt(e, t) {
        return e === V ? !0 : ($e[e] || []).includes(t);
      }
      function mt(e, t) {
        const { key: n, parentMeta: r, parent: o, parentType: s, fastModeRange: l, readOnly: a, apiCtx: i } = t;
        let f = e;
        if (a && r && !F(e)) {
          const { copy: c, self: _ } = r,
            y = _[n];
          if (f !== y) {
            const O = i.metaMap.get(f);
            O && (i.metaMap.delete(f), i.metaMap.delete(O.proxyVal)), (c[n] = y), (f = y);
          }
        }
        const d = (c, _) => {
          const y = _ || '';
          if (R(c) || !c) return c;
          if (!r) throw new Error('[[ createMeta ]]: meta should not be null');
          if (!F(c)) {
            if (r.newNodeStats[y]) return c;
            let g = T(c, i);
            return g || ((g = _e(y, c, t)), he(g), r.selfType === A ? o.set(y, g.copy) : (o[y] = g.copy)), g.proxyVal;
          }
          if (!yt(s, y) || r.proxyItems) return c;
          let O = [];
          if (s === x) {
            const g = new Set();
            o.forEach((M) => g.add(d(M))), Ee(g, r, { dataType: x, apiCtx: i }), (O = Z(g, r, { fast: l, apiCtx: i })), (r.copy = O);
          } else if (s === A) {
            const g = new Map();
            o.forEach((M, P) => g.set(P, d(M, P))),
              Ee(g, r, { dataType: A, apiCtx: i }),
              (O = Z(g, r, { fast: l, apiCtx: i })),
              (r.copy = O);
          } else s === V && y !== 'sort' && ((r.copy = r.copy || o.slice()), (O = r.proxyVal));
          return (r.proxyItems = O), c;
        };
        return d(f, n);
      }
      function ge(e, t) {
        if (!K(e)) return e;
        const n = T(e, t);
        return n ? n.copy : e;
      }
      function Ee(e, t, n) {
        const { dataType: r, apiCtx: o } = n,
          s = e.delete.bind(e),
          l = e.clear.bind(e);
        if (
          ((e.delete = function (...i) {
            return z(t), s(...i);
          }),
          (e.clear = function (...i) {
            return z(t), l(...i);
          }),
          r === x)
        ) {
          const a = e.add.bind(e);
          e.add = function (...f) {
            return z(t), a(...f);
          };
        }
        if (r === A) {
          const a = e.set.bind(e),
            i = e.get.bind(e);
          (e.set = function (...d) {
            if ((z(t), t.hasOnOperate)) {
              const c = d[1];
              t.rootMeta.execOnOperate('set', d[0], { mayProxyVal: c, value: c, parentMeta: t });
            }
            return a(...d);
          }),
            (e.get = function (...d) {
              const c = i(...d);
              if (t.hasOnOperate) {
                const _ = b(c, o),
                  y = _ ? _.copy || _.self : c;
                t.rootMeta.execOnOperate('get', d[0], { mayProxyVal: c, value: y, parentMeta: t, isChanged: !1 });
              }
              return c;
            });
        }
      }
      function Mt(e) {
        const { calledBy: t, parentMeta: n, op: r, parentType: o } = e;
        (['deleteProperty', 'set'].includes(t)
          || (t === 'get' && ((o === x && Ye.includes(r)) || (o === V && Ue.includes(r)) || (o === A && He.includes(r)))))
          && z(n);
      }
      function Oe(e, t) {
        const n = e.keyPath.slice();
        return n.push(t), n.join('|');
      }
      function ee(e, t) {
        const { op: n, key: r, value: o, calledBy: s, parentType: l, parentMeta: a, apiCtx: i } = t,
          f = ge(o, i);
        if (!a) {
          e[r] = f;
          return;
        }
        const { self: d, copy: c } = a;
        Mt({ calledBy: s, parentMeta: a, op: n, key: r, parentType: l });
        const _ = ae[l] || [];
        if (F(o) && _.includes(n))
          return n === 'slice'
            ? d.slice
            : (Ge.includes(n) && (a.isArrOrderChanged = !0), c ? (l === x || l === A ? c[n].bind(c) : c[n]) : d[n].bind(d));
        if (!c) return f;
        const y = c[r],
          O = () => {
            const M = b(y, i);
            M && (M.isDel = !0);
          },
          g = () => {
            const M = b(o, i);
            M
              && M.isDel
              && ((M.isDel = !1),
              (M.key = r),
              (M.keyPath = a.keyPath.concat([r])),
              (M.level = a.level + 1),
              (M.parent = a.copy),
              (M.parentMeta = a));
          };
        if (s === 'deleteProperty') {
          const M = b(o, i);
          M ? (M.isDel = !0) : O();
          const P = c[r];
          R(P) || i.newNodeMap.delete(Oe(a, r)), delete c[r];
          return;
        }
        R(f) || ((a.newNodeStats[r] = !0), i.newNodeMap.set(Oe(a, r), { parent: c, node: f, key: r, target: null })), (c[r] = f), O(), g();
      }
      function te(e) {
        if (R(e)) return e;
        if (Array.isArray(e) && e.length > 0) return e.forEach(te), Object.freeze(e);
        if ($(e)) {
          const n = e;
          (n.add = () => n), (n.delete = () => !1), (n.clear = N);
          for (const r of n.values()) Object.freeze(r);
          return Object.freeze(e);
        }
        if (G(e)) {
          const n = e;
          (n.set = () => n), (n.delete = () => !1), (n.clear = N);
          for (const r of n.values()) Object.freeze(r);
          return Object.freeze(e);
        }
        return (
          Object.getOwnPropertyNames(e).forEach((n) => {
            const r = e[n];
            te(r);
          }),
          Object.freeze(e)
        );
      }
      const ht = ['length', 'constructor', 'asymmetricMatch', 'nodeType', 'size'],
        Pe = {};
      ht.forEach((e) => (Pe[e] = 1));
      const _t = { [V]: 1, [x]: 1, [A]: 1 },
        ne = new Map();
      function Ce(e) {
        var t, n, r, o, s;
        const l = e || {},
          a = l.onOperate,
          i = !!a,
          f = l.customKeys || [],
          d = l.fastModeRange || ce.fastModeRange,
          c = (t = l[ie]) !== null && t !== void 0 ? t : !1,
          _ = (n = l.readOnly) !== null && n !== void 0 ? n : !1,
          y = l.disableWarn,
          O = (r = l.compareVer) !== null && r !== void 0 ? r : !1,
          g = (o = l.debug) !== null && o !== void 0 ? o : !1,
          M = (s = l.autoFreeze) !== null && s !== void 0 ? s : ce.autoFreeze,
          P = st(),
          v = { metaMap: new Map(), newNodeMap: new Map(), debug: g, metaVer: P };
        Q.set(P, v);
        const Se = () => (y || console.warn('can not mutate state at readOnly mode!'), !0),
          S = (L, D, m) => {
            const { mayProxyVal: u, parentMeta: p, value: E, isCustom: h = !1 } = m;
            let C = !1;
            if (!a) return { isChanged: C, mayProxyVal: u };
            const W = p || {},
              { selfType: I = '', keyPath: De = [], copy: Vt, self: we, modified: vt, proxyVal: xt } = W || {};
            let Fe = !1;
            m.isChanged !== void 0
              ? (C = m.isChanged)
              : (ae[I] || []).includes(D)
              ? ((Fe = !0), (C = (Xe[I] || []).includes(D)))
              : L !== 'get' && (C = p ? (vt ? Vt : we)[D] !== E : !0);
            let re = null,
              oe = !1;
            return (
              a({
                immutBase: c,
                parent: we,
                parentType: I,
                parentProxy: xt,
                op: L,
                replaceValue: (Re) => {
                  (oe = !0), (re = Re);
                },
                getReplaced: () => ({ isReplaced: oe, replacedValue: re }),
                isBuiltInFnKey: Fe,
                isChanged: C,
                isCustom: h,
                key: D,
                keyPath: De,
                fullKeyPath: De.concat(D),
                value: E,
                proxyValue: u,
              }),
              { mayProxyVal: oe ? re : u, isChanged: C }
            );
          },
          Te = (() => {
            let L = !0;
            const D = {
              get: (m, u) => {
                if (se === u) return P;
                const p = m[u];
                if (Ke.includes(u)) return F(p) ? p.bind(m) : p;
                if (u === '__proto__' || (u === 'toJSON' && !le(m, u))) return p;
                let E = p;
                const h = T(m, v);
                if (f.includes(u)) return S('get', u, { parentMeta: h, mayProxyVal: E, value: p, isChanged: !1, isCustom: !0 }).mayProxyVal;
                const C = h == null ? void 0 : h.selfType;
                return _t[C] && Pe[u]
                  ? h.copy[u]
                  : ((E = mt(p, {
                      key: u,
                      compareVer: O,
                      parentMeta: h,
                      parentType: C,
                      ver: P,
                      traps: D,
                      parent: m,
                      fastModeRange: d,
                      immutBase: c,
                      readOnly: _,
                      apiCtx: v,
                      hasOnOperate: i,
                    })),
                    C === V && q(u)
                      ? S('get', u, { parentMeta: h, mayProxyVal: E, value: p }).mayProxyVal
                      : ze[C]
                      ? ((E = ee(m, { op: u, key: u, value: p, metaVer: P, calledBy: 'get', parentType: C, parentMeta: h, apiCtx: v })),
                        S('get', u, { parentMeta: h, mayProxyVal: E, value: p }).mayProxyVal)
                      : S('get', u, { parentMeta: h, mayProxyVal: E, value: p }).mayProxyVal);
              },
              set: (m, u, p) => {
                let E = p;
                const h = T(m, v);
                if (de(p))
                  if (ft(p, P)) {
                    if (((E = ge(p, v)), E === m[u])) return !0;
                  } else L = !1;
                if (_) return S('set', u, { parentMeta: h, isChanged: !1, value: E }), Se();
                if (h && h.selfType === V) {
                  if (h.copy && h.__callSet && q(u)) return S('set', u, { parentMeta: h, value: E }), (h.copy[u] = E), !0;
                  h.__callSet = !0;
                }
                let C = !1;
                return (
                  a ? (C = S('set', u, { parentMeta: h, value: E }).isChanged) : (C = (h.modified ? h.copy : h.self)[u] !== p),
                  C && ee(m, { parentMeta: h, key: u, value: E, metaVer: P, calledBy: 'set', apiCtx: v }),
                  !0
                );
              },
              deleteProperty: (m, u) => {
                const p = T(m, v),
                  E = m[u];
                return _
                  ? (S('del', u, { parentMeta: p, isChanged: !1, value: E }), Se())
                  : (S('del', u, { parentMeta: p, isChanged: !0, value: E }),
                    ee(m, { parentMeta: p, op: 'del', key: u, value: '', metaVer: P, calledBy: 'deleteProperty', apiCtx: v }),
                    !0);
              },
              apply: function (m, u, p) {
                return m.apply(u, p);
              },
            };
            return {
              createDraft: (m) => {
                if (R(m)) throw new Error('base state can not be primitive');
                let u = m;
                const p = T(m, v);
                if (p) {
                  if (c && p.isImmutBase) return p.proxyVal;
                  u = p.self;
                }
                const E = _e('', u, { ver: P, traps: D, immutBase: c, readOnly: _, compareVer: O, apiCtx: v, hasOnOperate: i });
                return he(E), (E.execOnOperate = S), ne.set(E.proxyVal, Te.finishDraft), E.proxyVal;
              },
              finishDraft: (m) => {
                const u = T(m, v);
                if (!u) throw new Error('rootMeta should not be null!');
                if (u.level !== 0) throw new Error('can not finish sub draft node!');
                if (u.isImmutBase) return m;
                let p = dt(u, v);
                return M && L && (p = te(p)), Q.delete(P), p;
              },
            };
          })();
        return Te;
      }
      function Ft(e) {
        const t = getDraftMeta(e);
        return t ? t.self : e;
      }
      function Rt(e) {
        const t = getDraftMeta(e);
        return t ? deepCopy(t.copy || t.self) : e;
      }
      const gt = {
          has: le,
          noop: N,
          isObject: K,
          isMap: G,
          isSet: $,
          isFn: F,
          isPrimitive: R,
          isPromiseFn: fe,
          isPromiseResult: pe,
          isSymbol: et,
          canBeNum: q,
          isDraft: de,
          isDiff: Me,
          shallowCompare: at,
          getDraftMeta: b,
          getDataType: ue,
        },
        Et = Ie;
      function Ae(e, t) {
        return Ce(t).createDraft(e);
      }
      function Ve(e) {
        const t = ne.get(e);
        if (!t) throw new Error('Not a Limu root draft or draft has been finished!');
        return ne.delete(e), t(e);
      }
      function ve(e) {
        if (!F(e)) throw new Error('produce callback is not a function');
      }
      function Ot(e, t) {
        if (fe(e) || pe(t)) throw new Error('produce callback can not be a promise function or result');
      }
      function xe(e, t, n) {
        ve(t);
        const r = Ae(e, n),
          o = t(r);
        return Ot(t, o), Ve(r);
      }
      function Pt(e, t, n) {
        if (!t || !F(t)) {
          const r = e,
            o = t;
          return ve(e), (s) => xe(s, r, o);
        }
        return xe(e, t, n);
      }
      const Ct = Pt,
        Bt = null;
      function Kt(e) {
        return deepCopyFn(e);
      }
      function At(e, t) {
        return Ce(Object.assign(Object.assign({}, t || {}), { readOnly: !0, [ie]: !0 })).createDraft(e);
      }
      function zt(e) {
        conf.autoFreeze = e;
      }
      function Lt() {
        return conf.autoFreeze;
      }
      const Ut = null,
        Ht = null;
    },
  },
]);
