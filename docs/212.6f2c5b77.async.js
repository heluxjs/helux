(self.webpackChunkhelux_docs = self.webpackChunkhelux_docs || []).push([
  [212],
  {
    72368: function (dt, yt, A) {
      'use strict';
      var de = A(80904),
        Z = A(70079),
        Pe = A(93512);
      function $(E, b) {
        return Ge(E) || ce(E, b) || me(E, b) || he();
      }
      function he() {
        throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function me(E, b) {
        if (E) {
          if (typeof E == 'string') return Se(E, b);
          var K = Object.prototype.toString.call(E).slice(8, -1);
          if ((K === 'Object' && E.constructor && (K = E.constructor.name), K === 'Map' || K === 'Set')) return Array.from(E);
          if (K === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(K)) return Se(E, b);
        }
      }
      function Se(E, b) {
        (b == null || b > E.length) && (b = E.length);
        for (var K = 0, I = new Array(b); K < b; K++) I[K] = E[K];
        return I;
      }
      function ce(E, b) {
        var K = E == null ? null : (typeof Symbol != 'undefined' && E[Symbol.iterator]) || E['@@iterator'];
        if (K != null) {
          var I,
            z,
            _,
            J,
            V = [],
            v = !0,
            R = !1;
          try {
            if (((_ = (K = K.call(E)).next), b === 0)) {
              if (Object(K) !== K) return;
              v = !1;
            } else for (; !(v = (I = _.call(K)).done) && (V.push(I.value), V.length !== b); v = !0);
          } catch (U) {
            (R = !0), (z = U);
          } finally {
            try {
              if (!v && K.return != null && ((J = K.return()), Object(J) !== J)) return;
            } finally {
              if (R) throw z;
            }
          }
          return V;
        }
      }
      function Ge(E) {
        if (Array.isArray(E)) return E;
      }
      var je = {
          toString: function (b) {
            return typeof b.type == 'string' && b.type in this
              ? 'enum' in b
                ? this.enum(b)
                : this[b.type](b)
              : b.type
              ? this.getValidClassName(b) || b.type
              : 'const' in b
              ? ''.concat(b.const)
              : 'oneOf' in b
              ? this.oneOf(b)
              : 'unknown';
          },
          string: function (b) {
            return b.type;
          },
          number: function (b) {
            return b.type;
          },
          boolean: function (b) {
            return b.type;
          },
          any: function (b) {
            return b.type;
          },
          object: function (b) {
            var K = this,
              I = [];
            return (
              Object.entries(b.properties || {}).forEach(function (z) {
                var _,
                  J = $(z, 2),
                  V = J[0],
                  v = J[1];
                I.push(
                  ''
                    .concat(V)
                    .concat((_ = b.required) !== null && _ !== void 0 && _.includes(V) ? '' : '?', ': ')
                    .concat(v.type === 'object' ? 'object' : K.toString(v)),
                );
              }),
              I.length ? '{ '.concat(I.join('; '), ' }') : '{}'
            );
          },
          array: function (b) {
            if (b.items) {
              var K = this.getValidClassName(b.items);
              return K ? ''.concat(K, '[]') : ''.concat(this.toString(b.items), '[]');
            }
            return 'any[]';
          },
          element: function (b) {
            return '<'.concat(b.componentName, ' />');
          },
          function: function (b) {
            var K = this,
              I = b.signature;
            if (!I) return 'Function';
            var z = 'oneOf' in I ? I.oneOf : [I];
            return z
              .map(function (_) {
                return ''
                  .concat(_.isAsync ? 'async ' : '', '(')
                  .concat(
                    _.arguments
                      .map(function (J) {
                        return ''.concat(J.key, ': ').concat(K.toString(J));
                      })
                      .join(', '),
                    ') => ',
                  )
                  .concat(K.toString(_.returnType));
              })
              .join(' | ');
          },
          dom: function (b) {
            return b.className || 'DOM';
          },
          enum: function (b) {
            return b.enum
              .map(function (K) {
                return JSON.stringify(K);
              })
              .join(' | ');
          },
          oneOf: function (b) {
            var K = this;
            return b.oneOf
              .map(function (I) {
                return K.getValidClassName(I) || K.toString(I);
              })
              .join(' | ');
          },
          getValidClassName: function (b) {
            return 'className' in b && typeof b.className == 'string' && b.className !== '__type' ? b.className : null;
          },
        },
        qe = function (b) {
          var K = useState(function () {
              return je.toString(b);
            }),
            I = $(K, 2),
            z = I[0],
            _ = I[1];
          return (
            useEffect(
              function () {
                _(je.toString(b));
              },
              [b],
            ),
            React.createElement('code', null, z)
          );
        },
        ue = function (b) {
          var K,
            I = useRouteMeta(),
            z = I.frontmatter,
            _ = useAtomAssets(),
            J = _.components,
            V = b.id || z.atomId,
            v = useIntl();
          if (!V) throw new Error('`id` properties if required for API component!');
          var R = J == null ? void 0 : J[V];
          return React.createElement(
            'div',
            { className: 'markdown' },
            React.createElement(
              Table,
              null,
              React.createElement(
                'thead',
                null,
                React.createElement(
                  'tr',
                  null,
                  React.createElement('th', null, v.formatMessage({ id: 'api.component.name' })),
                  React.createElement('th', null, v.formatMessage({ id: 'api.component.description' })),
                  React.createElement('th', null, v.formatMessage({ id: 'api.component.type' })),
                  React.createElement('th', null, v.formatMessage({ id: 'api.component.default' })),
                ),
              ),
              React.createElement(
                'tbody',
                null,
                R && (K = R.propsConfig) !== null && K !== void 0 && K.properties
                  ? Object.entries(R.propsConfig.properties).map(function (U) {
                      var Q,
                        H = $(U, 2),
                        Y = H[0],
                        q = H[1];
                      return React.createElement(
                        'tr',
                        { key: Y },
                        React.createElement('td', null, Y),
                        React.createElement('td', null, q.description || '--'),
                        React.createElement('td', null, React.createElement(qe, q)),
                        React.createElement(
                          'td',
                          null,
                          React.createElement(
                            'code',
                            null,
                            (Q = R.propsConfig.required) !== null && Q !== void 0 && Q.includes(Y)
                              ? v.formatMessage({ id: 'api.component.required' })
                              : JSON.stringify(q.default) || '--',
                          ),
                        ),
                      );
                    })
                  : React.createElement(
                      'tr',
                      null,
                      React.createElement(
                        'td',
                        { colSpan: 4 },
                        v.formatMessage({ id: 'api.component.'.concat(J ? 'not.found' : 'unavailable') }, { id: V }),
                      ),
                    ),
              ),
            ),
          );
        },
        Ze = null;
    },
    43675: function (dt, yt, A) {
      'use strict';
      var de = A(70079);
      function Z() {
        return (
          (Z = Object.assign
            ? Object.assign.bind()
            : function (he) {
                for (var me = 1; me < arguments.length; me++) {
                  var Se = arguments[me];
                  for (var ce in Se) Object.prototype.hasOwnProperty.call(Se, ce) && (he[ce] = Se[ce]);
                }
                return he;
              }),
          Z.apply(this, arguments)
        );
      }
      var Pe = function (me) {
          return React.createElement('span', Z({ className: 'dumi-default-badge' }, me));
        },
        $ = null;
    },
    93512: function (dt, yt, A) {
      'use strict';
      var de = A(14315),
        Z = A(70079),
        Pe = null;
      function $(E, b) {
        return Ge(E) || ce(E, b) || me(E, b) || he();
      }
      function he() {
        throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function me(E, b) {
        if (E) {
          if (typeof E == 'string') return Se(E, b);
          var K = Object.prototype.toString.call(E).slice(8, -1);
          if ((K === 'Object' && E.constructor && (K = E.constructor.name), K === 'Map' || K === 'Set')) return Array.from(E);
          if (K === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(K)) return Se(E, b);
        }
      }
      function Se(E, b) {
        (b == null || b > E.length) && (b = E.length);
        for (var K = 0, I = new Array(b); K < b; K++) I[K] = E[K];
        return I;
      }
      function ce(E, b) {
        var K = E == null ? null : (typeof Symbol != 'undefined' && E[Symbol.iterator]) || E['@@iterator'];
        if (K != null) {
          var I,
            z,
            _,
            J,
            V = [],
            v = !0,
            R = !1;
          try {
            if (((_ = (K = K.call(E)).next), b === 0)) {
              if (Object(K) !== K) return;
              v = !1;
            } else for (; !(v = (I = _.call(K)).done) && (V.push(I.value), V.length !== b); v = !0);
          } catch (U) {
            (R = !0), (z = U);
          } finally {
            try {
              if (!v && K.return != null && ((J = K.return()), Object(J) !== J)) return;
            } finally {
              if (R) throw z;
            }
          }
          return V;
        }
      }
      function Ge(E) {
        if (Array.isArray(E)) return E;
      }
      function je(E, b) {
        if (E == null) return {};
        var K = qe(E, b),
          I,
          z;
        if (Object.getOwnPropertySymbols) {
          var _ = Object.getOwnPropertySymbols(E);
          for (z = 0; z < _.length; z++)
            (I = _[z]), !(b.indexOf(I) >= 0) && Object.prototype.propertyIsEnumerable.call(E, I) && (K[I] = E[I]);
        }
        return K;
      }
      function qe(E, b) {
        if (E == null) return {};
        var K = {},
          I = Object.keys(E),
          z,
          _;
        for (_ = 0; _ < I.length; _++) (z = I[_]), !(b.indexOf(z) >= 0) && (K[z] = E[z]);
        return K;
      }
      var ue = function (b) {
          var K = b.children,
            I = je(b, Pe),
            z = useRef(null),
            _ = useState(!1),
            J = $(_, 2),
            V = J[0],
            v = J[1],
            R = useState(!1),
            U = $(R, 2),
            Q = U[0],
            H = U[1];
          return (
            useEffect(function () {
              var Y = z.current;
              if (Y) {
                var q = throttle(function () {
                  v(Y.scrollLeft > 0), H(Y.scrollLeft < Y.scrollWidth - Y.offsetWidth);
                }, 100);
                return (
                  q(),
                  Y.addEventListener('scroll', q),
                  window.addEventListener('resize', q),
                  function () {
                    Y.removeEventListener('scroll', q), window.removeEventListener('resize', q);
                  }
                );
              }
            }, []),
            React.createElement(
              'div',
              { className: 'dumi-default-table' },
              React.createElement(
                'div',
                { className: 'dumi-default-table-content', ref: z, 'data-left-folded': V || void 0, 'data-right-folded': Q || void 0 },
                React.createElement('table', I, K),
              ),
            )
          );
        },
        Ze = null;
    },
    81558: function (dt, yt, A) {
      'use strict';
      var de = A(5527),
        Z = A(54744),
        Pe = A(51062),
        $ = A(56673),
        he = A(70051),
        me = A(77048),
        Se = A(15060),
        ce = A(43323),
        Ge = A(37829),
        je = A(41663),
        qe = A(5602),
        ue = A.n(qe),
        Ze = A(35235),
        E = `accept acceptCharset accessKey action allowFullScreen allowTransparency
    alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing challenge
    charSet checked classID className colSpan cols content contentEditable contextMenu
    controls coords crossOrigin data dateTime default defer dir disabled download draggable
    encType form formAction formEncType formMethod formNoValidate formTarget frameBorder
    headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity
    is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media
    mediaGroup method min minLength multiple muted name noValidate nonce open
    optimum pattern placeholder poster preload radioGroup readOnly rel required
    reversed role rowSpan rows sandbox scope scoped scrolling seamless selected
    shape size sizes span spellCheck src srcDoc srcLang srcSet start step style
    summary tabIndex target title type useMap value width wmode wrap`,
        b = `onCopy onCut onPaste onCompositionEnd onCompositionStart onCompositionUpdate onKeyDown
    onKeyPress onKeyUp onFocus onBlur onChange onInput onSubmit onClick onContextMenu onDoubleClick
    onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown
    onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onSelect onTouchCancel
    onTouchEnd onTouchMove onTouchStart onScroll onWheel onAbort onCanPlay onCanPlayThrough
    onDurationChange onEmptied onEncrypted onEnded onError onLoadedData onLoadedMetadata
    onLoadStart onPause onPlay onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend onTimeUpdate onVolumeChange onWaiting onLoad onError`,
        K = ''
          .concat(E, ' ')
          .concat(b)
          .split(/[\s\n]+/),
        I = 'aria-',
        z = 'data-';
      function _(t, a) {
        return t.indexOf(a) === 0;
      }
      function J(t) {
        var a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1,
          o;
        a === !1 ? (o = { aria: !0, data: !0, attr: !0 }) : a === !0 ? (o = { aria: !0 }) : (o = (0, $.Z)({}, a));
        var e = {};
        return (
          Object.keys(t).forEach(function (l) {
            ((o.aria && (l === 'role' || _(l, I))) || (o.data && _(l, z)) || (o.attr && K.includes(l))) && (e[l] = t[l]);
          }),
          e
        );
      }
      var V = A(30336),
        v = A(70079),
        R = v.createContext(null);
      function U(t) {
        var a = t.dropPosition,
          o = t.dropLevelOffset,
          e = t.indent,
          l = { pointerEvents: 'none', position: 'absolute', right: 0, backgroundColor: 'red', height: 2 };
        switch (a) {
          case -1:
            (l.top = 0), (l.left = -o * e);
            break;
          case 1:
            (l.bottom = 0), (l.left = -o * e);
            break;
          case 0:
            (l.bottom = 0), (l.left = e);
            break;
        }
        return v.createElement('div', { style: l });
      }
      function Q(t) {
        if (t == null) throw new TypeError('Cannot destructure ' + t);
      }
      var H = A(32630),
        Y = A(85801),
        q = A(81703),
        He = A(99581),
        xe = A(13054),
        Ie = v.forwardRef(function (t, a) {
          var o = t.height,
            e = t.offsetY,
            l = t.offsetX,
            s = t.children,
            u = t.prefixCls,
            n = t.onInnerResize,
            r = t.innerProps,
            i = t.rtl,
            d = t.extra,
            c = {},
            f = { display: 'flex', flexDirection: 'column' };
          if (e !== void 0) {
            var p;
            (c = { height: o, position: 'relative', overflow: 'hidden' }),
              (f = (0, $.Z)(
                (0, $.Z)({}, f),
                {},
                ((p = { transform: 'translateY('.concat(e, 'px)') }),
                (0, Z.Z)(p, i ? 'marginRight' : 'marginLeft', -l),
                (0, Z.Z)(p, 'position', 'absolute'),
                (0, Z.Z)(p, 'left', 0),
                (0, Z.Z)(p, 'right', 0),
                (0, Z.Z)(p, 'top', 0),
                p),
              ));
          }
          return v.createElement(
            'div',
            { style: c },
            v.createElement(
              xe.Z,
              {
                onResize: function (y) {
                  var m = y.offsetHeight;
                  m && n && n();
                },
              },
              v.createElement(
                'div',
                (0, de.Z)({ style: f, className: ue()((0, Z.Z)({}, ''.concat(u, '-holder-inner'), u)), ref: a }, r),
                s,
                d,
              ),
            ),
          );
        });
      Ie.displayName = 'Filler';
      var et = Ie,
        ke = A(54272);
      function Ve(t, a) {
        var o = 'touches' in t ? t.touches[0] : t;
        return o[a ? 'pageX' : 'pageY'];
      }
      var ct = v.forwardRef(function (t, a) {
          var o,
            e = t.prefixCls,
            l = t.rtl,
            s = t.scrollOffset,
            u = t.scrollRange,
            n = t.onStartMove,
            r = t.onStopMove,
            i = t.onScroll,
            d = t.horizontal,
            c = t.spinSize,
            f = t.containerSize,
            p = t.style,
            g = t.thumbStyle,
            y = v.useState(!1),
            m = (0, H.Z)(y, 2),
            h = m[0],
            S = m[1],
            x = v.useState(null),
            N = (0, H.Z)(x, 2),
            k = N[0],
            T = N[1],
            C = v.useState(null),
            P = (0, H.Z)(C, 2),
            D = P[0],
            F = P[1],
            O = !l,
            j = v.useRef(),
            M = v.useRef(),
            B = v.useState(!1),
            te = (0, H.Z)(B, 2),
            ie = te[0],
            X = te[1],
            ee = v.useRef(),
            Ke = function () {
              clearTimeout(ee.current),
                X(!0),
                (ee.current = setTimeout(function () {
                  X(!1);
                }, 3e3));
            },
            De = u - f || 0,
            Me = f - c || 0,
            le = De > 0,
            fe = v.useMemo(
              function () {
                if (s === 0 || De === 0) return 0;
                var pe = s / De;
                return pe * Me;
              },
              [s, De, Me],
            ),
            Ne = function (re) {
              re.stopPropagation(), re.preventDefault();
            },
            Re = v.useRef({ top: fe, dragging: h, pageY: k, startTop: D });
          Re.current = { top: fe, dragging: h, pageY: k, startTop: D };
          var We = function (re) {
            S(!0), T(Ve(re, d)), F(Re.current.top), n(), re.stopPropagation(), re.preventDefault();
          };
          v.useEffect(function () {
            var pe = function (rt) {
                rt.preventDefault();
              },
              re = j.current,
              Le = M.current;
            return (
              re.addEventListener('touchstart', pe),
              Le.addEventListener('touchstart', We),
              function () {
                re.removeEventListener('touchstart', pe), Le.removeEventListener('touchstart', We);
              }
            );
          }, []);
          var Ae = v.useRef();
          Ae.current = De;
          var ze = v.useRef();
          (ze.current = Me),
            v.useEffect(
              function () {
                if (h) {
                  var pe,
                    re = function (rt) {
                      var Be = Re.current,
                        st = Be.dragging,
                        $e = Be.pageY,
                        pt = Be.startTop;
                      if ((ke.Z.cancel(pe), st)) {
                        var Xe = Ve(rt, d) - $e,
                          G = pt;
                        !O && d ? (G -= Xe) : (G += Xe);
                        var Te = Ae.current,
                          be = ze.current,
                          Ee = be ? G / be : 0,
                          se = Math.ceil(Ee * Te);
                        (se = Math.max(se, 0)),
                          (se = Math.min(se, Te)),
                          (pe = (0, ke.Z)(function () {
                            i(se, d);
                          }));
                      }
                    },
                    Le = function () {
                      S(!1), r();
                    };
                  return (
                    window.addEventListener('mousemove', re),
                    window.addEventListener('touchmove', re),
                    window.addEventListener('mouseup', Le),
                    window.addEventListener('touchend', Le),
                    function () {
                      window.removeEventListener('mousemove', re),
                        window.removeEventListener('touchmove', re),
                        window.removeEventListener('mouseup', Le),
                        window.removeEventListener('touchend', Le),
                        ke.Z.cancel(pe);
                    }
                  );
                }
              },
              [h],
            ),
            v.useEffect(
              function () {
                Ke();
              },
              [s],
            ),
            v.useImperativeHandle(a, function () {
              return { delayHidden: Ke };
            });
          var ye = ''.concat(e, '-scrollbar'),
            ne = { position: 'absolute', visibility: ie && le ? null : 'hidden' },
            ve = { position: 'absolute', background: 'rgba(0, 0, 0, 0.5)', borderRadius: 99, cursor: 'pointer', userSelect: 'none' };
          return (
            d
              ? ((ne.height = 8),
                (ne.left = 0),
                (ne.right = 0),
                (ne.bottom = 0),
                (ve.height = '100%'),
                (ve.width = c),
                O ? (ve.left = fe) : (ve.right = fe))
              : ((ne.width = 8),
                (ne.top = 0),
                (ne.bottom = 0),
                O ? (ne.right = 0) : (ne.left = 0),
                (ve.width = '100%'),
                (ve.height = c),
                (ve.top = fe)),
            v.createElement(
              'div',
              {
                ref: j,
                className: ue()(
                  ye,
                  ((o = {}),
                  (0, Z.Z)(o, ''.concat(ye, '-horizontal'), d),
                  (0, Z.Z)(o, ''.concat(ye, '-vertical'), !d),
                  (0, Z.Z)(o, ''.concat(ye, '-visible'), ie),
                  o),
                ),
                style: (0, $.Z)((0, $.Z)({}, ne), p),
                onMouseDown: Ne,
                onMouseMove: Ke,
              },
              v.createElement('div', {
                ref: M,
                className: ue()(''.concat(ye, '-thumb'), (0, Z.Z)({}, ''.concat(ye, '-thumb-moving'), h)),
                style: (0, $.Z)((0, $.Z)({}, ve), g),
                onMouseDown: We,
              }),
            )
          );
        }),
        it = ct;
      function kt(t) {
        var a = t.children,
          o = t.setRef,
          e = v.useCallback(function (l) {
            o(l);
          }, []);
        return v.cloneElement(a, { ref: e });
      }
      function Ct(t, a, o, e, l, s, u) {
        var n = u.getKey;
        return t.slice(a, o + 1).map(function (r, i) {
          var d = a + i,
            c = s(r, d, { style: { width: e } }),
            f = n(r);
          return v.createElement(
            kt,
            {
              key: f,
              setRef: function (g) {
                return l(r, g);
              },
            },
            c,
          );
        });
      }
      var mt = A(26726),
        lt = (function () {
          function t() {
            (0, me.Z)(this, t), (this.maps = void 0), (this.id = 0), (this.maps = Object.create(null));
          }
          return (
            (0, Se.Z)(t, [
              {
                key: 'set',
                value: function (o, e) {
                  (this.maps[o] = e), (this.id += 1);
                },
              },
              {
                key: 'get',
                value: function (o) {
                  return this.maps[o];
                },
              },
            ]),
            t
          );
        })(),
        St = lt;
      function Dt(t, a, o) {
        var e = v.useState(0),
          l = (0, H.Z)(e, 2),
          s = l[0],
          u = l[1],
          n = (0, v.useRef)(new Map()),
          r = (0, v.useRef)(new St()),
          i = (0, v.useRef)();
        function d() {
          ke.Z.cancel(i.current);
        }
        function c() {
          var p = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1;
          d();
          var g = function () {
            n.current.forEach(function (m, h) {
              if (m && m.offsetParent) {
                var S = (0, mt.Z)(m),
                  x = S.offsetHeight;
                r.current.get(h) !== x && r.current.set(h, S.offsetHeight);
              }
            }),
              u(function (m) {
                return m + 1;
              });
          };
          p ? g() : (i.current = (0, ke.Z)(g));
        }
        function f(p, g) {
          var y = t(p),
            m = n.current.get(y);
          g ? (n.current.set(y, g), c()) : n.current.delete(y), !m != !g && (g ? a == null || a(p) : o == null || o(p));
        }
        return (
          (0, v.useEffect)(function () {
            return d;
          }, []),
          [f, c, r.current, s]
        );
      }
      var bt = A(71409),
        Et = A(87107),
        ae = A(44116);
      function we(t, a, o, e) {
        if (!a.length) return o;
        var l = _toArray(a),
          s = l[0],
          u = l.slice(1),
          n;
        return (
          !t && typeof s == 'number' ? (n = []) : Array.isArray(t) ? (n = _toConsumableArray(t)) : (n = _objectSpread({}, t)),
          e && o === void 0 && u.length === 1 ? delete n[s][u[0]] : (n[s] = we(n[s], u, o, e)),
          n
        );
      }
      function Fe(t, a, o) {
        var e = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
        return a.length && e && o === void 0 && !get(t, a.slice(0, -1)) ? t : we(t, a, o, e);
      }
      function xt(t) {
        return _typeof(t) === 'object' && t !== null && Object.getPrototypeOf(t) === Object.prototype;
      }
      function Ut(t) {
        return Array.isArray(t) ? [] : {};
      }
      var Tn = typeof Reflect == 'undefined' ? Object.keys : Reflect.ownKeys;
      function ta() {
        for (var t = arguments.length, a = new Array(t), o = 0; o < t; o++) a[o] = arguments[o];
        var e = Ut(a[0]);
        return (
          a.forEach(function (l) {
            function s(u, n) {
              var r = new Set(n),
                i = get(l, u),
                d = Array.isArray(i);
              if (d || xt(i)) {
                if (!r.has(i)) {
                  r.add(i);
                  var c = get(e, u);
                  d ? (e = Fe(e, u, [])) : (!c || _typeof(c) !== 'object') && (e = Fe(e, u, Ut(i))),
                    Tn(i).forEach(function (f) {
                      s([].concat(_toConsumableArray(u), [f]), r);
                    });
                }
              } else e = Fe(e, u, i);
            }
            s([]);
          }),
          e
        );
      }
      var On = 10;
      function Pn(t, a, o, e, l, s, u, n) {
        var r = v.useRef(),
          i = v.useState(null),
          d = (0, H.Z)(i, 2),
          c = d[0],
          f = d[1];
        return (
          (0, q.Z)(
            function () {
              if (c && c.times < On) {
                if (!t.current) {
                  f(function (Ke) {
                    return (0, $.Z)({}, Ke);
                  });
                  return;
                }
                s();
                var p = c.targetAlign,
                  g = c.originAlign,
                  y = c.index,
                  m = c.offset,
                  h = t.current.clientHeight,
                  S = !1,
                  x = p,
                  N = null;
                if (h) {
                  for (var k = p || g, T = 0, C = 0, P = 0, D = Math.min(a.length - 1, y), F = 0; F <= D; F += 1) {
                    var O = l(a[F]);
                    C = T;
                    var j = o.get(O);
                    (P = C + (j === void 0 ? e : j)), (T = P);
                  }
                  for (var M = k === 'top' ? m : h - m, B = D; B >= 0; B -= 1) {
                    var te = l(a[B]),
                      ie = o.get(te);
                    if (ie === void 0) {
                      S = !0;
                      break;
                    }
                    if (((M -= ie), M <= 0)) break;
                  }
                  switch (k) {
                    case 'top':
                      N = C - m;
                      break;
                    case 'bottom':
                      N = P - h + m;
                      break;
                    default: {
                      var X = t.current.scrollTop,
                        ee = X + h;
                      C < X ? (x = 'top') : P > ee && (x = 'bottom');
                    }
                  }
                  N !== null && u(N), N !== c.lastTop && (S = !0);
                }
                S && f((0, $.Z)((0, $.Z)({}, c), {}, { times: c.times + 1, targetAlign: x, lastTop: N }));
              }
            },
            [c, t.current],
          ),
          function (p) {
            if (p == null) {
              n();
              return;
            }
            if ((ke.Z.cancel(r.current), typeof p == 'number')) u(p);
            else if (p && (0, Pe.Z)(p) === 'object') {
              var g,
                y = p.align;
              'index' in p
                ? (g = p.index)
                : (g = a.findIndex(function (S) {
                    return l(S) === p.key;
                  }));
              var m = p.offset,
                h = m === void 0 ? 0 : m;
              f({ times: 0, index: g, offset: h, originAlign: y });
            }
          }
        );
      }
      function na(t, a, o, e) {
        var l = o - t,
          s = a - o,
          u = Math.min(l, s) * 2;
        if (e <= u) {
          var n = Math.floor(e / 2);
          return e % 2 ? o + n + 1 : o - n;
        }
        return l > s ? o - (e - s) : o + (e - l);
      }
      function Mn(t, a, o) {
        var e = t.length,
          l = a.length,
          s,
          u;
        if (e === 0 && l === 0) return null;
        e < l ? ((s = t), (u = a)) : ((s = a), (u = t));
        var n = { __EMPTY_ITEM__: !0 };
        function r(g) {
          return g !== void 0 ? o(g) : n;
        }
        for (var i = null, d = Math.abs(e - l) !== 1, c = 0; c < u.length; c += 1) {
          var f = r(s[c]),
            p = r(u[c]);
          if (f !== p) {
            (i = c), (d = d || f !== r(u[c + 1]));
            break;
          }
        }
        return i === null ? null : { index: i, multiple: d };
      }
      function wn(t, a, o) {
        var e = v.useState(t),
          l = (0, H.Z)(e, 2),
          s = l[0],
          u = l[1],
          n = v.useState(null),
          r = (0, H.Z)(n, 2),
          i = r[0],
          d = r[1];
        return (
          v.useEffect(
            function () {
              var c = Mn(s || [], t || [], a);
              (c == null ? void 0 : c.index) !== void 0 && (o == null || o(c.index), d(t[c.index])), u(t);
            },
            [t],
          ),
          [i]
        );
      }
      var Ln = (typeof navigator == 'undefined' ? 'undefined' : (0, Pe.Z)(navigator)) === 'object' && /Firefox/i.test(navigator.userAgent),
        Gt = Ln,
        Vt = function (t, a) {
          var o = (0, v.useRef)(!1),
            e = (0, v.useRef)(null);
          function l() {
            clearTimeout(e.current),
              (o.current = !0),
              (e.current = setTimeout(function () {
                o.current = !1;
              }, 50));
          }
          var s = (0, v.useRef)({ top: t, bottom: a });
          return (
            (s.current.top = t),
            (s.current.bottom = a),
            function (u) {
              var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1,
                r = (u < 0 && s.current.top) || (u > 0 && s.current.bottom);
              return n && r ? (clearTimeout(e.current), (o.current = !1)) : (!r || o.current) && l(), !o.current && r;
            }
          );
        };
      function Zn(t, a, o, e, l) {
        var s = (0, v.useRef)(0),
          u = (0, v.useRef)(null),
          n = (0, v.useRef)(null),
          r = (0, v.useRef)(!1),
          i = Vt(a, o);
        function d(m, h) {
          ke.Z.cancel(u.current),
            (s.current += h),
            (n.current = h),
            !i(h)
              && (Gt || m.preventDefault(),
              (u.current = (0, ke.Z)(function () {
                var S = r.current ? 10 : 1;
                l(s.current * S), (s.current = 0);
              })));
        }
        function c(m, h) {
          l(h, !0), Gt || m.preventDefault();
        }
        var f = (0, v.useRef)(null),
          p = (0, v.useRef)(null);
        function g(m) {
          if (t) {
            ke.Z.cancel(p.current),
              (p.current = (0, ke.Z)(function () {
                f.current = null;
              }, 2));
            var h = m.deltaX,
              S = m.deltaY,
              x = m.shiftKey,
              N = h,
              k = S;
            (f.current === 'sx' || (!f.current && x && S && !h)) && ((N = S), (k = 0), (f.current = 'sx'));
            var T = Math.abs(N),
              C = Math.abs(k);
            f.current === null && (f.current = e && T > C ? 'x' : 'y'), f.current === 'y' ? d(m, k) : c(m, N);
          }
        }
        function y(m) {
          t && (r.current = m.detail === n.current);
        }
        return [g, y];
      }
      var In = 14 / 15;
      function An(t, a, o) {
        var e = (0, v.useRef)(!1),
          l = (0, v.useRef)(0),
          s = (0, v.useRef)(null),
          u = (0, v.useRef)(null),
          n,
          r = function (f) {
            if (e.current) {
              var p = Math.ceil(f.touches[0].pageY),
                g = l.current - p;
              (l.current = p),
                o(g) && f.preventDefault(),
                clearInterval(u.current),
                (u.current = setInterval(function () {
                  (g *= In), (!o(g, !0) || Math.abs(g) <= 0.1) && clearInterval(u.current);
                }, 16));
            }
          },
          i = function () {
            (e.current = !1), n();
          },
          d = function (f) {
            n(),
              f.touches.length === 1
                && !e.current
                && ((e.current = !0),
                (l.current = Math.ceil(f.touches[0].pageY)),
                (s.current = f.target),
                s.current.addEventListener('touchmove', r),
                s.current.addEventListener('touchend', i));
          };
        (n = function () {
          s.current && (s.current.removeEventListener('touchmove', r), s.current.removeEventListener('touchend', i));
        }),
          (0, q.Z)(
            function () {
              return (
                t && a.current.addEventListener('touchstart', d),
                function () {
                  var c;
                  (c = a.current) === null || c === void 0 || c.removeEventListener('touchstart', d), n(), clearInterval(u.current);
                }
              );
            },
            [t],
          );
      }
      var $n = 20;
      function Yt() {
        var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0,
          a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0,
          o = (t / a) * 100;
        return isNaN(o) && (o = 0), (o = Math.max(o, $n)), (o = Math.min(o, t / 2)), Math.floor(o);
      }
      function jn(t, a, o, e) {
        var l = v.useMemo(
            function () {
              return [new Map(), []];
            },
            [t, o.id, e],
          ),
          s = (0, H.Z)(l, 2),
          u = s[0],
          n = s[1],
          r = function (d) {
            var c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : d,
              f = u.get(d),
              p = u.get(c);
            if (f === void 0 || p === void 0)
              for (var g = t.length, y = n.length; y < g; y += 1) {
                var m,
                  h = t[y],
                  S = a(h);
                u.set(S, y);
                var x = (m = o.get(S)) !== null && m !== void 0 ? m : e;
                if (((n[y] = (n[y - 1] || 0) + x), S === d && (f = y), S === c && (p = y), f !== void 0 && p !== void 0)) break;
              }
            return { top: n[f - 1] || 0, bottom: n[p] };
          };
        return r;
      }
      var Hn = [
          'prefixCls',
          'className',
          'height',
          'itemHeight',
          'fullHeight',
          'style',
          'data',
          'children',
          'itemKey',
          'virtual',
          'direction',
          'scrollWidth',
          'component',
          'onScroll',
          'onVirtualScroll',
          'onVisibleChange',
          'innerProps',
          'extraRender',
          'styles',
        ],
        Fn = [],
        _n = { overflowY: 'auto', overflowAnchor: 'none' };
      function Wn(t, a) {
        var o = t.prefixCls,
          e = o === void 0 ? 'rc-virtual-list' : o,
          l = t.className,
          s = t.height,
          u = t.itemHeight,
          n = t.fullHeight,
          r = n === void 0 ? !0 : n,
          i = t.style,
          d = t.data,
          c = t.children,
          f = t.itemKey,
          p = t.virtual,
          g = t.direction,
          y = t.scrollWidth,
          m = t.component,
          h = m === void 0 ? 'div' : m,
          S = t.onScroll,
          x = t.onVirtualScroll,
          N = t.onVisibleChange,
          k = t.innerProps,
          T = t.extraRender,
          C = t.styles,
          P = (0, Y.Z)(t, Hn),
          D = !!(p !== !1 && s && u),
          F = D && d && (u * d.length > s || !!y),
          O = g === 'rtl',
          j = ue()(e, (0, Z.Z)({}, ''.concat(e, '-rtl'), O), l),
          M = d || Fn,
          B = (0, v.useRef)(),
          te = (0, v.useRef)(),
          ie = (0, v.useState)(0),
          X = (0, H.Z)(ie, 2),
          ee = X[0],
          Ke = X[1],
          De = (0, v.useState)(0),
          Me = (0, H.Z)(De, 2),
          le = Me[0],
          fe = Me[1],
          Ne = (0, v.useState)(!1),
          Re = (0, H.Z)(Ne, 2),
          We = Re[0],
          Ae = Re[1],
          ze = function () {
            Ae(!0);
          },
          ye = function () {
            Ae(!1);
          },
          ne = v.useCallback(
            function (w) {
              return typeof f == 'function' ? f(w) : w == null ? void 0 : w[f];
            },
            [f],
          ),
          ve = { getKey: ne };
        function pe(w) {
          Ke(function (L) {
            var W;
            typeof w == 'function' ? (W = w(L)) : (W = w);
            var ge = zr(W);
            return (B.current.scrollTop = ge), ge;
          });
        }
        var re = (0, v.useRef)({ start: 0, end: M.length }),
          Le = (0, v.useRef)(),
          nt = wn(M, ne),
          rt = (0, H.Z)(nt, 1),
          Be = rt[0];
        Le.current = Be;
        var st = Dt(ne, null, null),
          $e = (0, H.Z)(st, 4),
          pt = $e[0],
          Xe = $e[1],
          G = $e[2],
          Te = $e[3],
          be = v.useMemo(
            function () {
              if (!D) return { scrollHeight: void 0, start: 0, end: M.length - 1, offset: void 0 };
              if (!F) {
                var w;
                return {
                  scrollHeight: ((w = te.current) === null || w === void 0 ? void 0 : w.offsetHeight) || 0,
                  start: 0,
                  end: M.length - 1,
                  offset: void 0,
                };
              }
              for (var L = 0, W, ge, Qe, Qr = M.length, gt = 0; gt < Qr; gt += 1) {
                var qr = M[gt],
                  ea = ne(qr),
                  Rn = G.get(ea),
                  Bt = L + (Rn === void 0 ? u : Rn);
                Bt >= ee && W === void 0 && ((W = gt), (ge = L)), Bt > ee + s && Qe === void 0 && (Qe = gt), (L = Bt);
              }
              return (
                W === void 0 && ((W = 0), (ge = 0), (Qe = Math.ceil(s / u))),
                Qe === void 0 && (Qe = M.length - 1),
                (Qe = Math.min(Qe + 1, M.length - 1)),
                { scrollHeight: L, start: W, end: Qe, offset: ge }
              );
            },
            [F, D, ee, M, Te, s],
          ),
          Ee = be.scrollHeight,
          se = be.start,
          Oe = be.end,
          at = be.offset;
        (re.current.start = se), (re.current.end = Oe);
        var ot = v.useState({ width: 0, height: s }),
          Je = (0, H.Z)(ot, 2),
          Ue = Je[0],
          Hr = Je[1],
          Fr = function (L) {
            Hr({ width: L.width || L.offsetWidth, height: L.height || L.offsetHeight });
          },
          mn = (0, v.useRef)(),
          Sn = (0, v.useRef)(),
          _r = v.useMemo(
            function () {
              return Yt(Ue.width, y);
            },
            [Ue.width, y],
          ),
          Wr = v.useMemo(
            function () {
              return Yt(Ue.height, Ee);
            },
            [Ue.height, Ee],
          ),
          $t = Ee - s,
          jt = (0, v.useRef)($t);
        jt.current = $t;
        function zr(w) {
          var L = w;
          return Number.isNaN(jt.current) || (L = Math.min(L, jt.current)), (L = Math.max(L, 0)), L;
        }
        var bn = ee <= 0,
          En = ee >= $t,
          Br = Vt(bn, En),
          Ht = function () {
            return { x: O ? -le : le, y: ee };
          },
          Ft = (0, v.useRef)(Ht()),
          _t = (0, bt.Z)(function () {
            if (x) {
              var w = Ht();
              (Ft.current.x !== w.x || Ft.current.y !== w.y) && (x(w), (Ft.current = w));
            }
          });
        function xn(w, L) {
          var W = w;
          L
            ? ((0, He.flushSync)(function () {
                fe(W);
              }),
              _t())
            : pe(W);
        }
        function Ur(w) {
          var L = w.currentTarget.scrollTop;
          L !== ee && pe(L), S == null || S(w), _t();
        }
        var Wt = function (L) {
            var W = L,
              ge = y - Ue.width;
            return (W = Math.max(W, 0)), (W = Math.min(W, ge)), W;
          },
          Gr = (0, bt.Z)(function (w, L) {
            L
              ? ((0, He.flushSync)(function () {
                  fe(function (W) {
                    var ge = W + (O ? -w : w);
                    return Wt(ge);
                  });
                }),
                _t())
              : pe(function (W) {
                  var ge = W + w;
                  return ge;
                });
          }),
          Vr = Zn(D, bn, En, !!y, Gr),
          Kn = (0, H.Z)(Vr, 2),
          zt = Kn[0],
          Nn = Kn[1];
        An(D, B, function (w, L) {
          return Br(w, L) ? !1 : (zt({ preventDefault: function () {}, deltaY: w }), !0);
        }),
          (0, q.Z)(
            function () {
              function w(W) {
                D && W.preventDefault();
              }
              var L = B.current;
              return (
                L.addEventListener('wheel', zt),
                L.addEventListener('DOMMouseScroll', Nn),
                L.addEventListener('MozMousePixelScroll', w),
                function () {
                  L.removeEventListener('wheel', zt),
                    L.removeEventListener('DOMMouseScroll', Nn),
                    L.removeEventListener('MozMousePixelScroll', w);
                }
              );
            },
            [D],
          ),
          (0, q.Z)(
            function () {
              y
                && fe(function (w) {
                  return Wt(w);
                });
            },
            [Ue.width, y],
          );
        var kn = function () {
            var L, W;
            (L = mn.current) === null || L === void 0 || L.delayHidden(), (W = Sn.current) === null || W === void 0 || W.delayHidden();
          },
          Cn = Pn(
            B,
            M,
            G,
            u,
            ne,
            function () {
              return Xe(!0);
            },
            pe,
            kn,
          );
        v.useImperativeHandle(a, function () {
          return {
            getScrollInfo: Ht,
            scrollTo: function (L) {
              function W(ge) {
                return ge && (0, Pe.Z)(ge) === 'object' && ('left' in ge || 'top' in ge);
              }
              W(L) ? (L.left !== void 0 && fe(Wt(L.left)), Cn(L.top)) : Cn(L);
            },
          };
        }),
          (0, q.Z)(
            function () {
              if (N) {
                var w = M.slice(se, Oe + 1);
                N(w, M);
              }
            },
            [se, Oe, M],
          );
        var Yr = jn(M, ne, G, u),
          Xr = T == null ? void 0 : T({ start: se, end: Oe, virtual: F, offsetX: le, offsetY: at, rtl: O, getSize: Yr }),
          Jr = Ct(M, se, Oe, y, pt, c, ve),
          ht = null;
        s
          && ((ht = (0, $.Z)((0, Z.Z)({}, r ? 'height' : 'maxHeight', s), _n)),
          D && ((ht.overflowY = 'hidden'), y && (ht.overflowX = 'hidden'), We && (ht.pointerEvents = 'none')));
        var Dn = {};
        return (
          O && (Dn.dir = 'rtl'),
          v.createElement(
            'div',
            (0, de.Z)({ style: (0, $.Z)((0, $.Z)({}, i), {}, { position: 'relative' }), className: j }, Dn, P),
            v.createElement(
              xe.Z,
              { onResize: Fr },
              v.createElement(
                h,
                { className: ''.concat(e, '-holder'), style: ht, ref: B, onScroll: Ur, onMouseEnter: kn },
                v.createElement(
                  et,
                  {
                    prefixCls: e,
                    height: Ee,
                    offsetX: le,
                    offsetY: at,
                    scrollWidth: y,
                    onInnerResize: Xe,
                    ref: te,
                    innerProps: k,
                    rtl: O,
                    extra: Xr,
                  },
                  Jr,
                ),
              ),
            ),
            F
              && Ee > s
              && v.createElement(it, {
                ref: mn,
                prefixCls: e,
                scrollOffset: ee,
                scrollRange: Ee,
                rtl: O,
                onScroll: xn,
                onStartMove: ze,
                onStopMove: ye,
                spinSize: Wr,
                containerSize: Ue.height,
                style: C == null ? void 0 : C.verticalScrollBar,
                thumbStyle: C == null ? void 0 : C.verticalScrollBarThumb,
              }),
            F
              && y
              && v.createElement(it, {
                ref: Sn,
                prefixCls: e,
                scrollOffset: le,
                scrollRange: y,
                rtl: O,
                onScroll: xn,
                onStartMove: ze,
                onStopMove: ye,
                spinSize: _r,
                containerSize: Ue.width,
                horizontal: !0,
                style: C == null ? void 0 : C.horizontalScrollBar,
                thumbStyle: C == null ? void 0 : C.horizontalScrollBarThumb,
              }),
          )
        );
      }
      var Xt = v.forwardRef(Wn);
      Xt.displayName = 'List';
      var zn = Xt,
        Bn = zn,
        Un = A(71755),
        Gn = function (a) {
          for (
            var o = a.prefixCls, e = a.level, l = a.isStart, s = a.isEnd, u = ''.concat(o, '-indent-unit'), n = [], r = 0;
            r < e;
            r += 1
          ) {
            var i;
            n.push(
              v.createElement('span', {
                key: r,
                className: ue()(u, ((i = {}), (0, Z.Z)(i, ''.concat(u, '-start'), l[r]), (0, Z.Z)(i, ''.concat(u, '-end'), s[r]), i)),
              }),
            );
          }
          return v.createElement('span', { 'aria-hidden': 'true', className: ''.concat(o, '-indent') }, n);
        },
        Vn = v.memo(Gn);
      function Ce(t, a) {
        return t[a];
      }
      var Yn = A(1720),
        Xn = A(56491),
        Jn = ['children'];
      function Jt(t, a) {
        return ''.concat(t, '-').concat(a);
      }
      function Qn(t) {
        return t && t.type && t.type.isTreeNode;
      }
      function ut(t, a) {
        return t != null ? t : a;
      }
      function Kt(t) {
        var a = t || {},
          o = a.title,
          e = a._title,
          l = a.key,
          s = a.children,
          u = o || 'title';
        return { title: u, _title: e || [u], key: l || 'key', children: s || 'children' };
      }
      function ra(t, a) {
        var o = new Map();
        function e(l) {
          var s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : '';
          (l || []).forEach(function (u) {
            var n = u[a.key],
              r = u[a.children];
            warning(n != null, 'Tree node must have a certain key: ['.concat(s).concat(n, ']'));
            var i = String(n);
            warning(!o.has(i) || n === null || n === void 0, "Same 'key' exist in the Tree: ".concat(i)),
              o.set(i, !0),
              e(r, ''.concat(s).concat(i, ' > '));
          });
        }
        e(t);
      }
      function qn(t) {
        function a(o) {
          var e = (0, Yn.Z)(o);
          return e
            .map(function (l) {
              if (!Qn(l)) return (0, V.ZP)(!l, 'Tree/TreeNode can only accept TreeNode as children.'), null;
              var s = l.key,
                u = l.props,
                n = u.children,
                r = (0, Y.Z)(u, Jn),
                i = (0, $.Z)({ key: s }, r),
                d = a(n);
              return d.length && (i.children = d), i;
            })
            .filter(function (l) {
              return l;
            });
        }
        return a(t);
      }
      function Rt(t, a, o) {
        var e = Kt(o),
          l = e._title,
          s = e.key,
          u = e.children,
          n = new Set(a === !0 ? [] : a),
          r = [];
        function i(d) {
          var c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
          return d.map(function (f, p) {
            for (var g = Jt(c ? c.pos : '0', p), y = ut(f[s], g), m, h = 0; h < l.length; h += 1) {
              var S = l[h];
              if (f[S] !== void 0) {
                m = f[S];
                break;
              }
            }
            var x = (0, $.Z)(
              (0, $.Z)({}, (0, Xn.Z)(f, [].concat((0, he.Z)(l), [s, u]))),
              {},
              {
                title: m,
                key: y,
                parent: c,
                pos: g,
                children: null,
                data: f,
                isStart: [].concat((0, he.Z)(c ? c.isStart : []), [p === 0]),
                isEnd: [].concat((0, he.Z)(c ? c.isEnd : []), [p === d.length - 1]),
              },
            );
            return r.push(x), a === !0 || n.has(y) ? (x.children = i(f[u] || [], x)) : (x.children = []), x;
          });
        }
        return i(t), r;
      }
      function er(t, a, o) {
        var e = {};
        (0, Pe.Z)(o) === 'object' ? (e = o) : (e = { externalGetKey: o }), (e = e || {});
        var l = e,
          s = l.childrenPropName,
          u = l.externalGetKey,
          n = l.fieldNames,
          r = Kt(n),
          i = r.key,
          d = r.children,
          c = s || d,
          f;
        u
          ? typeof u == 'string'
            ? (f = function (y) {
                return y[u];
              })
            : typeof u == 'function'
              && (f = function (y) {
                return u(y);
              })
          : (f = function (y, m) {
              return ut(y[i], m);
            });
        function p(g, y, m, h) {
          var S = g ? g[c] : t,
            x = g ? Jt(m.pos, y) : '0',
            N = g ? [].concat((0, he.Z)(h), [g]) : [];
          if (g) {
            var k = f(g, x),
              T = { node: g, index: y, pos: x, key: k, parentPos: m.node ? m.pos : null, level: m.level + 1, nodes: N };
            a(T);
          }
          S
            && S.forEach(function (C, P) {
              p(C, P, { node: g, pos: x, level: m ? m.level + 1 : -1 }, N);
            });
        }
        p(null);
      }
      function tr(t) {
        var a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
          o = a.initWrapper,
          e = a.processEntity,
          l = a.onProcessFinished,
          s = a.externalGetKey,
          u = a.childrenPropName,
          n = a.fieldNames,
          r = arguments.length > 2 ? arguments[2] : void 0,
          i = s || r,
          d = {},
          c = {},
          f = { posEntities: d, keyEntities: c };
        return (
          o && (f = o(f) || f),
          er(
            t,
            function (p) {
              var g = p.node,
                y = p.index,
                m = p.pos,
                h = p.key,
                S = p.parentPos,
                x = p.level,
                N = p.nodes,
                k = { node: g, nodes: N, index: y, key: h, pos: m, level: x },
                T = ut(h, m);
              (d[m] = k),
                (c[T] = k),
                (k.parent = d[S]),
                k.parent && ((k.parent.children = k.parent.children || []), k.parent.children.push(k)),
                e && e(k, f);
            },
            { externalGetKey: i, childrenPropName: u, fieldNames: n },
          ),
          l && l(f),
          f
        );
      }
      function ft(t, a) {
        var o = a.expandedKeys,
          e = a.selectedKeys,
          l = a.loadedKeys,
          s = a.loadingKeys,
          u = a.checkedKeys,
          n = a.halfCheckedKeys,
          r = a.dragOverNodeKey,
          i = a.dropPosition,
          d = a.keyEntities,
          c = Ce(d, t),
          f = {
            eventKey: t,
            expanded: o.indexOf(t) !== -1,
            selected: e.indexOf(t) !== -1,
            loaded: l.indexOf(t) !== -1,
            loading: s.indexOf(t) !== -1,
            checked: u.indexOf(t) !== -1,
            halfChecked: n.indexOf(t) !== -1,
            pos: String(c ? c.pos : ''),
            dragOver: r === t && i === 0,
            dragOverGapTop: r === t && i === -1,
            dragOverGapBottom: r === t && i === 1,
          };
        return f;
      }
      function oe(t) {
        var a = t.data,
          o = t.expanded,
          e = t.selected,
          l = t.checked,
          s = t.loaded,
          u = t.loading,
          n = t.halfChecked,
          r = t.dragOver,
          i = t.dragOverGapTop,
          d = t.dragOverGapBottom,
          c = t.pos,
          f = t.active,
          p = t.eventKey,
          g = (0, $.Z)(
            (0, $.Z)({}, a),
            {},
            {
              expanded: o,
              selected: e,
              checked: l,
              loaded: s,
              loading: u,
              halfChecked: n,
              dragOver: r,
              dragOverGapTop: i,
              dragOverGapBottom: d,
              pos: c,
              active: f,
              key: p,
            },
          );
        return (
          'props' in g
            || Object.defineProperty(g, 'props', {
              get: function () {
                return (
                  (0, V.ZP)(
                    !1,
                    'Second param return from event is node data instead of TreeNode instance. Please read value directly instead of reading from `props`.',
                  ),
                  t
                );
              },
            }),
          g
        );
      }
      var nr = [
          'eventKey',
          'className',
          'style',
          'dragOver',
          'dragOverGapTop',
          'dragOverGapBottom',
          'isLeaf',
          'isStart',
          'isEnd',
          'expanded',
          'selected',
          'checked',
          'halfChecked',
          'loading',
          'domRef',
          'active',
          'data',
          'onMouseMove',
          'selectable',
        ],
        Qt = 'open',
        qt = 'close',
        rr = '---',
        ar = (function (t) {
          (0, Ge.Z)(o, t);
          var a = (0, je.Z)(o);
          function o() {
            var e;
            (0, me.Z)(this, o);
            for (var l = arguments.length, s = new Array(l), u = 0; u < l; u++) s[u] = arguments[u];
            return (
              (e = a.call.apply(a, [this].concat(s))),
              (e.state = { dragNodeHighlight: !1 }),
              (e.selectHandle = void 0),
              (e.cacheIndent = void 0),
              (e.onSelectorClick = function (n) {
                var r = e.props.context.onNodeClick;
                r(n, oe(e.props)), e.isSelectable() ? e.onSelect(n) : e.onCheck(n);
              }),
              (e.onSelectorDoubleClick = function (n) {
                var r = e.props.context.onNodeDoubleClick;
                r(n, oe(e.props));
              }),
              (e.onSelect = function (n) {
                if (!e.isDisabled()) {
                  var r = e.props.context.onNodeSelect;
                  r(n, oe(e.props));
                }
              }),
              (e.onCheck = function (n) {
                if (!e.isDisabled()) {
                  var r = e.props,
                    i = r.disableCheckbox,
                    d = r.checked,
                    c = e.props.context.onNodeCheck;
                  if (!(!e.isCheckable() || i)) {
                    var f = !d;
                    c(n, oe(e.props), f);
                  }
                }
              }),
              (e.onMouseEnter = function (n) {
                var r = e.props.context.onNodeMouseEnter;
                r(n, oe(e.props));
              }),
              (e.onMouseLeave = function (n) {
                var r = e.props.context.onNodeMouseLeave;
                r(n, oe(e.props));
              }),
              (e.onContextMenu = function (n) {
                var r = e.props.context.onNodeContextMenu;
                r(n, oe(e.props));
              }),
              (e.onDragStart = function (n) {
                var r = e.props.context.onNodeDragStart;
                n.stopPropagation(), e.setState({ dragNodeHighlight: !0 }), r(n, (0, ce.Z)(e));
                try {
                  n.dataTransfer.setData('text/plain', '');
                } catch (i) {}
              }),
              (e.onDragEnter = function (n) {
                var r = e.props.context.onNodeDragEnter;
                n.preventDefault(), n.stopPropagation(), r(n, (0, ce.Z)(e));
              }),
              (e.onDragOver = function (n) {
                var r = e.props.context.onNodeDragOver;
                n.preventDefault(), n.stopPropagation(), r(n, (0, ce.Z)(e));
              }),
              (e.onDragLeave = function (n) {
                var r = e.props.context.onNodeDragLeave;
                n.stopPropagation(), r(n, (0, ce.Z)(e));
              }),
              (e.onDragEnd = function (n) {
                var r = e.props.context.onNodeDragEnd;
                n.stopPropagation(), e.setState({ dragNodeHighlight: !1 }), r(n, (0, ce.Z)(e));
              }),
              (e.onDrop = function (n) {
                var r = e.props.context.onNodeDrop;
                n.preventDefault(), n.stopPropagation(), e.setState({ dragNodeHighlight: !1 }), r(n, (0, ce.Z)(e));
              }),
              (e.onExpand = function (n) {
                var r = e.props,
                  i = r.loading,
                  d = r.context.onNodeExpand;
                i || d(n, oe(e.props));
              }),
              (e.setSelectHandle = function (n) {
                e.selectHandle = n;
              }),
              (e.getNodeState = function () {
                var n = e.props.expanded;
                return e.isLeaf() ? null : n ? Qt : qt;
              }),
              (e.hasChildren = function () {
                var n = e.props.eventKey,
                  r = e.props.context.keyEntities,
                  i = Ce(r, n) || {},
                  d = i.children;
                return !!(d || []).length;
              }),
              (e.isLeaf = function () {
                var n = e.props,
                  r = n.isLeaf,
                  i = n.loaded,
                  d = e.props.context.loadData,
                  c = e.hasChildren();
                return r === !1 ? !1 : r || (!d && !c) || (d && i && !c);
              }),
              (e.isDisabled = function () {
                var n = e.props.disabled,
                  r = e.props.context.disabled;
                return !!(r || n);
              }),
              (e.isCheckable = function () {
                var n = e.props.checkable,
                  r = e.props.context.checkable;
                return !r || n === !1 ? !1 : r;
              }),
              (e.syncLoadData = function (n) {
                var r = n.expanded,
                  i = n.loading,
                  d = n.loaded,
                  c = e.props.context,
                  f = c.loadData,
                  p = c.onNodeLoad;
                i || (f && r && !e.isLeaf() && !e.hasChildren() && !d && p(oe(e.props)));
              }),
              (e.isDraggable = function () {
                var n = e.props,
                  r = n.data,
                  i = n.context.draggable;
                return !!(i && (!i.nodeDraggable || i.nodeDraggable(r)));
              }),
              (e.renderDragHandler = function () {
                var n = e.props.context,
                  r = n.draggable,
                  i = n.prefixCls;
                return r != null && r.icon ? v.createElement('span', { className: ''.concat(i, '-draggable-icon') }, r.icon) : null;
              }),
              (e.renderSwitcherIconDom = function (n) {
                var r = e.props.switcherIcon,
                  i = e.props.context.switcherIcon,
                  d = r || i;
                return typeof d == 'function' ? d((0, $.Z)((0, $.Z)({}, e.props), {}, { isLeaf: n })) : d;
              }),
              (e.renderSwitcher = function () {
                var n = e.props.expanded,
                  r = e.props.context.prefixCls;
                if (e.isLeaf()) {
                  var i = e.renderSwitcherIconDom(!0);
                  return i !== !1
                    ? v.createElement('span', { className: ue()(''.concat(r, '-switcher'), ''.concat(r, '-switcher-noop')) }, i)
                    : null;
                }
                var d = ue()(''.concat(r, '-switcher'), ''.concat(r, '-switcher_').concat(n ? Qt : qt)),
                  c = e.renderSwitcherIconDom(!1);
                return c !== !1 ? v.createElement('span', { onClick: e.onExpand, className: d }, c) : null;
              }),
              (e.renderCheckbox = function () {
                var n = e.props,
                  r = n.checked,
                  i = n.halfChecked,
                  d = n.disableCheckbox,
                  c = e.props.context.prefixCls,
                  f = e.isDisabled(),
                  p = e.isCheckable();
                if (!p) return null;
                var g = typeof p != 'boolean' ? p : null;
                return v.createElement(
                  'span',
                  {
                    className: ue()(
                      ''.concat(c, '-checkbox'),
                      r && ''.concat(c, '-checkbox-checked'),
                      !r && i && ''.concat(c, '-checkbox-indeterminate'),
                      (f || d) && ''.concat(c, '-checkbox-disabled'),
                    ),
                    onClick: e.onCheck,
                  },
                  g,
                );
              }),
              (e.renderIcon = function () {
                var n = e.props.loading,
                  r = e.props.context.prefixCls;
                return v.createElement('span', {
                  className: ue()(
                    ''.concat(r, '-iconEle'),
                    ''.concat(r, '-icon__').concat(e.getNodeState() || 'docu'),
                    n && ''.concat(r, '-icon_loading'),
                  ),
                });
              }),
              (e.renderSelector = function () {
                var n = e.state.dragNodeHighlight,
                  r = e.props,
                  i = r.title,
                  d = i === void 0 ? rr : i,
                  c = r.selected,
                  f = r.icon,
                  p = r.loading,
                  g = r.data,
                  y = e.props.context,
                  m = y.prefixCls,
                  h = y.showIcon,
                  S = y.icon,
                  x = y.loadData,
                  N = y.titleRender,
                  k = e.isDisabled(),
                  T = ''.concat(m, '-node-content-wrapper'),
                  C;
                if (h) {
                  var P = f || S;
                  C = P
                    ? v.createElement(
                        'span',
                        { className: ue()(''.concat(m, '-iconEle'), ''.concat(m, '-icon__customize')) },
                        typeof P == 'function' ? P(e.props) : P,
                      )
                    : e.renderIcon();
                } else x && p && (C = e.renderIcon());
                var D;
                typeof d == 'function' ? (D = d(g)) : N ? (D = N(g)) : (D = d);
                var F = v.createElement('span', { className: ''.concat(m, '-title') }, D);
                return v.createElement(
                  'span',
                  {
                    ref: e.setSelectHandle,
                    title: typeof d == 'string' ? d : '',
                    className: ue()(
                      ''.concat(T),
                      ''.concat(T, '-').concat(e.getNodeState() || 'normal'),
                      !k && (c || n) && ''.concat(m, '-node-selected'),
                    ),
                    onMouseEnter: e.onMouseEnter,
                    onMouseLeave: e.onMouseLeave,
                    onContextMenu: e.onContextMenu,
                    onClick: e.onSelectorClick,
                    onDoubleClick: e.onSelectorDoubleClick,
                  },
                  C,
                  F,
                  e.renderDropIndicator(),
                );
              }),
              (e.renderDropIndicator = function () {
                var n = e.props,
                  r = n.disabled,
                  i = n.eventKey,
                  d = e.props.context,
                  c = d.draggable,
                  f = d.dropLevelOffset,
                  p = d.dropPosition,
                  g = d.prefixCls,
                  y = d.indent,
                  m = d.dropIndicatorRender,
                  h = d.dragOverNodeKey,
                  S = d.direction,
                  x = !!c,
                  N = !r && x && h === i,
                  k = y != null ? y : e.cacheIndent;
                return (e.cacheIndent = y), N ? m({ dropPosition: p, dropLevelOffset: f, indent: k, prefixCls: g, direction: S }) : null;
              }),
              e
            );
          }
          return (
            (0, Se.Z)(o, [
              {
                key: 'componentDidMount',
                value: function () {
                  this.syncLoadData(this.props);
                },
              },
              {
                key: 'componentDidUpdate',
                value: function () {
                  this.syncLoadData(this.props);
                },
              },
              {
                key: 'isSelectable',
                value: function () {
                  var l = this.props.selectable,
                    s = this.props.context.selectable;
                  return typeof l == 'boolean' ? l : s;
                },
              },
              {
                key: 'render',
                value: function () {
                  var l,
                    s = this.props,
                    u = s.eventKey,
                    n = s.className,
                    r = s.style,
                    i = s.dragOver,
                    d = s.dragOverGapTop,
                    c = s.dragOverGapBottom,
                    f = s.isLeaf,
                    p = s.isStart,
                    g = s.isEnd,
                    y = s.expanded,
                    m = s.selected,
                    h = s.checked,
                    S = s.halfChecked,
                    x = s.loading,
                    N = s.domRef,
                    k = s.active,
                    T = s.data,
                    C = s.onMouseMove,
                    P = s.selectable,
                    D = (0, Y.Z)(s, nr),
                    F = this.props.context,
                    O = F.prefixCls,
                    j = F.filterTreeNode,
                    M = F.keyEntities,
                    B = F.dropContainerKey,
                    te = F.dropTargetKey,
                    ie = F.draggingNodeKey,
                    X = this.isDisabled(),
                    ee = J(D, { aria: !0, data: !0 }),
                    Ke = Ce(M, u) || {},
                    De = Ke.level,
                    Me = g[g.length - 1],
                    le = this.isDraggable(),
                    fe = !X && le,
                    Ne = ie === u,
                    Re = P !== void 0 ? { 'aria-selected': !!P } : void 0;
                  return v.createElement(
                    'div',
                    (0, de.Z)(
                      {
                        ref: N,
                        className: ue()(
                          n,
                          ''.concat(O, '-treenode'),
                          ((l = {}),
                          (0, Z.Z)(l, ''.concat(O, '-treenode-disabled'), X),
                          (0, Z.Z)(l, ''.concat(O, '-treenode-switcher-').concat(y ? 'open' : 'close'), !f),
                          (0, Z.Z)(l, ''.concat(O, '-treenode-checkbox-checked'), h),
                          (0, Z.Z)(l, ''.concat(O, '-treenode-checkbox-indeterminate'), S),
                          (0, Z.Z)(l, ''.concat(O, '-treenode-selected'), m),
                          (0, Z.Z)(l, ''.concat(O, '-treenode-loading'), x),
                          (0, Z.Z)(l, ''.concat(O, '-treenode-active'), k),
                          (0, Z.Z)(l, ''.concat(O, '-treenode-leaf-last'), Me),
                          (0, Z.Z)(l, ''.concat(O, '-treenode-draggable'), le),
                          (0, Z.Z)(l, 'dragging', Ne),
                          (0, Z.Z)(l, 'drop-target', te === u),
                          (0, Z.Z)(l, 'drop-container', B === u),
                          (0, Z.Z)(l, 'drag-over', !X && i),
                          (0, Z.Z)(l, 'drag-over-gap-top', !X && d),
                          (0, Z.Z)(l, 'drag-over-gap-bottom', !X && c),
                          (0, Z.Z)(l, 'filter-node', j && j(oe(this.props))),
                          l),
                        ),
                        style: r,
                        draggable: fe,
                        'aria-grabbed': Ne,
                        onDragStart: fe ? this.onDragStart : void 0,
                        onDragEnter: le ? this.onDragEnter : void 0,
                        onDragOver: le ? this.onDragOver : void 0,
                        onDragLeave: le ? this.onDragLeave : void 0,
                        onDrop: le ? this.onDrop : void 0,
                        onDragEnd: le ? this.onDragEnd : void 0,
                        onMouseMove: C,
                      },
                      Re,
                      ee,
                    ),
                    v.createElement(Vn, { prefixCls: O, level: De, isStart: p, isEnd: g }),
                    this.renderDragHandler(),
                    this.renderSwitcher(),
                    this.renderCheckbox(),
                    this.renderSelector(),
                  );
                },
              },
            ]),
            o
          );
        })(v.Component),
        Tt = function (a) {
          return v.createElement(R.Consumer, null, function (o) {
            return v.createElement(ar, (0, de.Z)({}, a, { context: o }));
          });
        };
      (Tt.displayName = 'TreeNode'), (Tt.isTreeNode = 1);
      var Ot = Tt;
      function or(t, a) {
        var o = v.useState(!1),
          e = (0, H.Z)(o, 2),
          l = e[0],
          s = e[1];
        (0, q.Z)(
          function () {
            if (l)
              return (
                t(),
                function () {
                  a();
                }
              );
          },
          [l],
        ),
          (0, q.Z)(function () {
            return (
              s(!0),
              function () {
                s(!1);
              }
            );
          }, []);
      }
      var ir = [
          'className',
          'style',
          'motion',
          'motionNodes',
          'motionType',
          'onMotionStart',
          'onMotionEnd',
          'active',
          'treeNodeRequiredProps',
        ],
        en = function (a, o) {
          var e = a.className,
            l = a.style,
            s = a.motion,
            u = a.motionNodes,
            n = a.motionType,
            r = a.onMotionStart,
            i = a.onMotionEnd,
            d = a.active,
            c = a.treeNodeRequiredProps,
            f = (0, Y.Z)(a, ir),
            p = v.useState(!0),
            g = (0, H.Z)(p, 2),
            y = g[0],
            m = g[1],
            h = v.useContext(R),
            S = h.prefixCls,
            x = u && n !== 'hide';
          (0, q.Z)(
            function () {
              u && x !== y && m(x);
            },
            [u],
          );
          var N = function () {
              u && r();
            },
            k = v.useRef(!1),
            T = function () {
              u && !k.current && ((k.current = !0), i());
            };
          or(N, T);
          var C = function (D) {
            x === D && T();
          };
          return u
            ? v.createElement(
                Un.ZP,
                (0, de.Z)({ ref: o, visible: y }, s, { motionAppear: n === 'show', onVisibleChanged: C }),
                function (P, D) {
                  var F = P.className,
                    O = P.style;
                  return v.createElement(
                    'div',
                    { ref: D, className: ue()(''.concat(S, '-treenode-motion'), F), style: O },
                    u.map(function (j) {
                      var M = (0, de.Z)({}, (Q(j.data), j.data)),
                        B = j.title,
                        te = j.key,
                        ie = j.isStart,
                        X = j.isEnd;
                      delete M.children;
                      var ee = ft(te, c);
                      return v.createElement(
                        Ot,
                        (0, de.Z)({}, M, ee, { title: B, active: d, data: j.data, key: te, isStart: ie, isEnd: X }),
                      );
                    }),
                  );
                },
              )
            : v.createElement(Ot, (0, de.Z)({ domRef: o, className: e, style: l }, f, { active: d }));
        };
      en.displayName = 'MotionTreeNode';
      var lr = v.forwardRef(en),
        sr = lr;
      function dr() {
        var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [],
          a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [],
          o = t.length,
          e = a.length;
        if (Math.abs(o - e) !== 1) return { add: !1, key: null };
        function l(s, u) {
          var n = new Map();
          s.forEach(function (i) {
            n.set(i, !0);
          });
          var r = u.filter(function (i) {
            return !n.has(i);
          });
          return r.length === 1 ? r[0] : null;
        }
        return o < e ? { add: !0, key: l(t, a) } : { add: !1, key: l(a, t) };
      }
      function tn(t, a, o) {
        var e = t.findIndex(function (n) {
            return n.key === o;
          }),
          l = t[e + 1],
          s = a.findIndex(function (n) {
            return n.key === o;
          });
        if (l) {
          var u = a.findIndex(function (n) {
            return n.key === l.key;
          });
          return a.slice(s + 1, u);
        }
        return a.slice(s + 1);
      }
      var cr = [
          'prefixCls',
          'data',
          'selectable',
          'checkable',
          'expandedKeys',
          'selectedKeys',
          'checkedKeys',
          'loadedKeys',
          'loadingKeys',
          'halfCheckedKeys',
          'keyEntities',
          'disabled',
          'dragging',
          'dragOverNodeKey',
          'dropPosition',
          'motion',
          'height',
          'itemHeight',
          'virtual',
          'focusable',
          'activeItem',
          'focused',
          'tabIndex',
          'onKeyDown',
          'onFocus',
          'onBlur',
          'onActiveChange',
          'onListChangeStart',
          'onListChangeEnd',
        ],
        nn = { width: 0, height: 0, display: 'flex', overflow: 'hidden', opacity: 0, border: 0, padding: 0, margin: 0 },
        ur = function () {},
        tt = 'RC_TREE_MOTION_'.concat(Math.random()),
        Pt = { key: tt },
        rn = { key: tt, level: 0, index: 0, pos: '0', node: Pt, nodes: [Pt] },
        an = { parent: null, children: [], pos: rn.pos, data: Pt, title: null, key: tt, isStart: [], isEnd: [] };
      function on(t, a, o, e) {
        return a === !1 || !o ? t : t.slice(0, Math.ceil(o / e) + 1);
      }
      function ln(t) {
        var a = t.key,
          o = t.pos;
        return ut(a, o);
      }
      function fr(t) {
        for (var a = String(t.data.key), o = t; o.parent; ) (o = o.parent), (a = ''.concat(o.data.key, ' > ').concat(a));
        return a;
      }
      var sn = v.forwardRef(function (t, a) {
        var o = t.prefixCls,
          e = t.data,
          l = t.selectable,
          s = t.checkable,
          u = t.expandedKeys,
          n = t.selectedKeys,
          r = t.checkedKeys,
          i = t.loadedKeys,
          d = t.loadingKeys,
          c = t.halfCheckedKeys,
          f = t.keyEntities,
          p = t.disabled,
          g = t.dragging,
          y = t.dragOverNodeKey,
          m = t.dropPosition,
          h = t.motion,
          S = t.height,
          x = t.itemHeight,
          N = t.virtual,
          k = t.focusable,
          T = t.activeItem,
          C = t.focused,
          P = t.tabIndex,
          D = t.onKeyDown,
          F = t.onFocus,
          O = t.onBlur,
          j = t.onActiveChange,
          M = t.onListChangeStart,
          B = t.onListChangeEnd,
          te = (0, Y.Z)(t, cr),
          ie = v.useRef(null),
          X = v.useRef(null);
        v.useImperativeHandle(a, function () {
          return {
            scrollTo: function (Te) {
              ie.current.scrollTo(Te);
            },
            getIndentWidth: function () {
              return X.current.offsetWidth;
            },
          };
        });
        var ee = v.useState(u),
          Ke = (0, H.Z)(ee, 2),
          De = Ke[0],
          Me = Ke[1],
          le = v.useState(e),
          fe = (0, H.Z)(le, 2),
          Ne = fe[0],
          Re = fe[1],
          We = v.useState(e),
          Ae = (0, H.Z)(We, 2),
          ze = Ae[0],
          ye = Ae[1],
          ne = v.useState([]),
          ve = (0, H.Z)(ne, 2),
          pe = ve[0],
          re = ve[1],
          Le = v.useState(null),
          nt = (0, H.Z)(Le, 2),
          rt = nt[0],
          Be = nt[1],
          st = v.useRef(e);
        st.current = e;
        function $e() {
          var G = st.current;
          Re(G), ye(G), re([]), Be(null), B();
        }
        (0, q.Z)(
          function () {
            Me(u);
            var G = dr(De, u);
            if (G.key !== null)
              if (G.add) {
                var Te = Ne.findIndex(function (ot) {
                    var Je = ot.key;
                    return Je === G.key;
                  }),
                  be = on(tn(Ne, e, G.key), N, S, x),
                  Ee = Ne.slice();
                Ee.splice(Te + 1, 0, an), ye(Ee), re(be), Be('show');
              } else {
                var se = e.findIndex(function (ot) {
                    var Je = ot.key;
                    return Je === G.key;
                  }),
                  Oe = on(tn(e, Ne, G.key), N, S, x),
                  at = e.slice();
                at.splice(se + 1, 0, an), ye(at), re(Oe), Be('hide');
              }
            else Ne !== e && (Re(e), ye(e));
          },
          [u, e],
        ),
          v.useEffect(
            function () {
              g || $e();
            },
            [g],
          );
        var pt = h ? ze : e,
          Xe = {
            expandedKeys: u,
            selectedKeys: n,
            loadedKeys: i,
            loadingKeys: d,
            checkedKeys: r,
            halfCheckedKeys: c,
            dragOverNodeKey: y,
            dropPosition: m,
            keyEntities: f,
          };
        return v.createElement(
          v.Fragment,
          null,
          C && T && v.createElement('span', { style: nn, 'aria-live': 'assertive' }, fr(T)),
          v.createElement(
            'div',
            null,
            v.createElement('input', {
              style: nn,
              disabled: k === !1 || p,
              tabIndex: k !== !1 ? P : null,
              onKeyDown: D,
              onFocus: F,
              onBlur: O,
              value: '',
              onChange: ur,
              'aria-label': 'for screen reader',
            }),
          ),
          v.createElement(
            'div',
            {
              className: ''.concat(o, '-treenode'),
              'aria-hidden': !0,
              style: {
                position: 'absolute',
                pointerEvents: 'none',
                visibility: 'hidden',
                height: 0,
                overflow: 'hidden',
                border: 0,
                padding: 0,
              },
            },
            v.createElement(
              'div',
              { className: ''.concat(o, '-indent') },
              v.createElement('div', { ref: X, className: ''.concat(o, '-indent-unit') }),
            ),
          ),
          v.createElement(
            Bn,
            (0, de.Z)({}, te, {
              data: pt,
              itemKey: ln,
              height: S,
              fullHeight: !1,
              virtual: N,
              itemHeight: x,
              prefixCls: ''.concat(o, '-list'),
              ref: ie,
              onVisibleChange: function (Te, be) {
                var Ee = new Set(Te),
                  se = be.filter(function (Oe) {
                    return !Ee.has(Oe);
                  });
                se.some(function (Oe) {
                  return ln(Oe) === tt;
                }) && $e();
              },
            }),
            function (G) {
              var Te = G.pos,
                be = (0, de.Z)({}, (Q(G.data), G.data)),
                Ee = G.title,
                se = G.key,
                Oe = G.isStart,
                at = G.isEnd,
                ot = ut(se, Te);
              delete be.key, delete be.children;
              var Je = ft(ot, Xe);
              return v.createElement(
                sr,
                (0, de.Z)({}, be, Je, {
                  title: Ee,
                  active: !!T && se === T.key,
                  pos: Te,
                  data: G.data,
                  isStart: Oe,
                  isEnd: at,
                  motion: h,
                  motionNodes: se === tt ? pe : null,
                  motionType: rt,
                  onMotionStart: M,
                  onMotionEnd: $e,
                  treeNodeRequiredProps: Xe,
                  onMouseMove: function () {
                    j(null);
                  },
                }),
              );
            },
          ),
        );
      });
      sn.displayName = 'NodeList';
      var vr = sn,
        pr = null;
      function _e(t, a) {
        if (!t) return [];
        var o = t.slice(),
          e = o.indexOf(a);
        return e >= 0 && o.splice(e, 1), o;
      }
      function Ye(t, a) {
        var o = (t || []).slice();
        return o.indexOf(a) === -1 && o.push(a), o;
      }
      function Mt(t) {
        return t.split('-');
      }
      function hr(t, a) {
        var o = [],
          e = Ce(a, t);
        function l() {
          var s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
          s.forEach(function (u) {
            var n = u.key,
              r = u.children;
            o.push(n), l(r);
          });
        }
        return l(e.children), o;
      }
      function gr(t) {
        if (t.parent) {
          var a = Mt(t.pos);
          return Number(a[a.length - 1]) === t.parent.children.length - 1;
        }
        return !1;
      }
      function yr(t) {
        var a = Mt(t.pos);
        return Number(a[a.length - 1]) === 0;
      }
      function dn(t, a, o, e, l, s, u, n, r, i) {
        var d,
          c = t.clientX,
          f = t.clientY,
          p = t.target.getBoundingClientRect(),
          g = p.top,
          y = p.height,
          m = (i === 'rtl' ? -1 : 1) * (((l == null ? void 0 : l.x) || 0) - c),
          h = (m - 12) / e,
          S = Ce(n, o.props.eventKey);
        if (f < g + y / 2) {
          var x = u.findIndex(function (te) {
              return te.key === S.key;
            }),
            N = x <= 0 ? 0 : x - 1,
            k = u[N].key;
          S = Ce(n, k);
        }
        var T = S.key,
          C = S,
          P = S.key,
          D = 0,
          F = 0;
        if (!r.includes(T)) for (var O = 0; O < h && gr(S); O += 1) (S = S.parent), (F += 1);
        var j = a.props.data,
          M = S.node,
          B = !0;
        return (
          yr(S) && S.level === 0 && f < g + y / 2 && s({ dragNode: j, dropNode: M, dropPosition: -1 }) && S.key === o.props.eventKey
            ? (D = -1)
            : (C.children || []).length && r.includes(P)
            ? s({ dragNode: j, dropNode: M, dropPosition: 0 })
              ? (D = 0)
              : (B = !1)
            : F === 0
            ? h > -1.5
              ? s({ dragNode: j, dropNode: M, dropPosition: 1 })
                ? (D = 1)
                : (B = !1)
              : s({ dragNode: j, dropNode: M, dropPosition: 0 })
              ? (D = 0)
              : s({ dragNode: j, dropNode: M, dropPosition: 1 })
              ? (D = 1)
              : (B = !1)
            : s({ dragNode: j, dropNode: M, dropPosition: 1 })
            ? (D = 1)
            : (B = !1),
          {
            dropPosition: D,
            dropLevelOffset: F,
            dropTargetKey: S.key,
            dropTargetPos: S.pos,
            dragOverNodeKey: P,
            dropContainerKey: D === 0 ? null : ((d = S.parent) === null || d === void 0 ? void 0 : d.key) || null,
            dropAllowed: B,
          }
        );
      }
      function cn(t, a) {
        if (t) {
          var o = a.multiple;
          return o ? t.slice() : t.length ? [t[0]] : t;
        }
      }
      var mr = function (a) {
        return a;
      };
      function Sr(t, a) {
        if (!t) return [];
        var o = a || {},
          e = o.processProps,
          l = e === void 0 ? mr : e,
          s = Array.isArray(t) ? t : [t];
        return s.map(function (u) {
          var n = u.children,
            r = _objectWithoutProperties(u, pr),
            i = Sr(n, a);
          return React.createElement(TreeNode, _extends({ key: r.key }, l(r)), i);
        });
      }
      function wt(t) {
        if (!t) return null;
        var a;
        if (Array.isArray(t)) a = { checkedKeys: t, halfCheckedKeys: void 0 };
        else if ((0, Pe.Z)(t) === 'object') a = { checkedKeys: t.checked || void 0, halfCheckedKeys: t.halfChecked || void 0 };
        else return (0, V.ZP)(!1, '`checkedKeys` is not an array or an object'), null;
        return a;
      }
      function un(t, a) {
        var o = new Set();
        function e(l) {
          if (!o.has(l)) {
            var s = Ce(a, l);
            if (s) {
              o.add(l);
              var u = s.parent,
                n = s.node;
              n.disabled || (u && e(u.key));
            }
          }
        }
        return (
          (t || []).forEach(function (l) {
            e(l);
          }),
          (0, he.Z)(o)
        );
      }
      function fn(t, a) {
        var o = new Set();
        return (
          t.forEach(function (e) {
            a.has(e) || o.add(e);
          }),
          o
        );
      }
      function br(t) {
        var a = t || {},
          o = a.disabled,
          e = a.disableCheckbox,
          l = a.checkable;
        return !!(o || e) || l === !1;
      }
      function Er(t, a, o, e) {
        for (var l = new Set(t), s = new Set(), u = 0; u <= o; u += 1) {
          var n = a.get(u) || new Set();
          n.forEach(function (c) {
            var f = c.key,
              p = c.node,
              g = c.children,
              y = g === void 0 ? [] : g;
            l.has(f)
              && !e(p)
              && y
                .filter(function (m) {
                  return !e(m.node);
                })
                .forEach(function (m) {
                  l.add(m.key);
                });
          });
        }
        for (var r = new Set(), i = o; i >= 0; i -= 1) {
          var d = a.get(i) || new Set();
          d.forEach(function (c) {
            var f = c.parent,
              p = c.node;
            if (!(e(p) || !c.parent || r.has(c.parent.key))) {
              if (e(c.parent.node)) {
                r.add(f.key);
                return;
              }
              var g = !0,
                y = !1;
              (f.children || [])
                .filter(function (m) {
                  return !e(m.node);
                })
                .forEach(function (m) {
                  var h = m.key,
                    S = l.has(h);
                  g && !S && (g = !1), !y && (S || s.has(h)) && (y = !0);
                }),
                g && l.add(f.key),
                y && s.add(f.key),
                r.add(f.key);
            }
          });
        }
        return { checkedKeys: Array.from(l), halfCheckedKeys: Array.from(fn(s, l)) };
      }
      function xr(t, a, o, e, l) {
        for (var s = new Set(t), u = new Set(a), n = 0; n <= e; n += 1) {
          var r = o.get(n) || new Set();
          r.forEach(function (f) {
            var p = f.key,
              g = f.node,
              y = f.children,
              m = y === void 0 ? [] : y;
            !s.has(p)
              && !u.has(p)
              && !l(g)
              && m
                .filter(function (h) {
                  return !l(h.node);
                })
                .forEach(function (h) {
                  s.delete(h.key);
                });
          });
        }
        u = new Set();
        for (var i = new Set(), d = e; d >= 0; d -= 1) {
          var c = o.get(d) || new Set();
          c.forEach(function (f) {
            var p = f.parent,
              g = f.node;
            if (!(l(g) || !f.parent || i.has(f.parent.key))) {
              if (l(f.parent.node)) {
                i.add(p.key);
                return;
              }
              var y = !0,
                m = !1;
              (p.children || [])
                .filter(function (h) {
                  return !l(h.node);
                })
                .forEach(function (h) {
                  var S = h.key,
                    x = s.has(S);
                  y && !x && (y = !1), !m && (x || u.has(S)) && (m = !0);
                }),
                y || s.delete(p.key),
                m && u.add(p.key),
                i.add(p.key);
            }
          });
        }
        return { checkedKeys: Array.from(s), halfCheckedKeys: Array.from(fn(u, s)) };
      }
      function Lt(t, a, o, e) {
        var l = [],
          s;
        e ? (s = e) : (s = br);
        var u = new Set(
            t.filter(function (d) {
              var c = !!Ce(o, d);
              return c || l.push(d), c;
            }),
          ),
          n = new Map(),
          r = 0;
        Object.keys(o).forEach(function (d) {
          var c = o[d],
            f = c.level,
            p = n.get(f);
          p || ((p = new Set()), n.set(f, p)), p.add(c), (r = Math.max(r, f));
        }),
          (0, V.ZP)(
            !l.length,
            'Tree missing follow keys: '.concat(
              l
                .slice(0, 100)
                .map(function (d) {
                  return "'".concat(d, "'");
                })
                .join(', '),
            ),
          );
        var i;
        return a === !0 ? (i = Er(u, n, r, s)) : (i = xr(u, a.halfCheckedKeys, n, r, s)), i;
      }
      var Kr = 10,
        vn = (function (t) {
          (0, Ge.Z)(o, t);
          var a = (0, je.Z)(o);
          function o() {
            var e;
            (0, me.Z)(this, o);
            for (var l = arguments.length, s = new Array(l), u = 0; u < l; u++) s[u] = arguments[u];
            return (
              (e = a.call.apply(a, [this].concat(s))),
              (e.destroyed = !1),
              (e.delayedDragEnterLogic = void 0),
              (e.loadingRetryTimes = {}),
              (e.state = {
                keyEntities: {},
                indent: null,
                selectedKeys: [],
                checkedKeys: [],
                halfCheckedKeys: [],
                loadedKeys: [],
                loadingKeys: [],
                expandedKeys: [],
                draggingNodeKey: null,
                dragChildrenKeys: [],
                dropTargetKey: null,
                dropPosition: null,
                dropContainerKey: null,
                dropLevelOffset: null,
                dropTargetPos: null,
                dropAllowed: !0,
                dragOverNodeKey: null,
                treeData: [],
                flattenNodes: [],
                focused: !1,
                activeKey: null,
                listChanging: !1,
                prevProps: null,
                fieldNames: Kt(),
              }),
              (e.dragStartMousePosition = null),
              (e.dragNode = void 0),
              (e.currentMouseOverDroppableNodeKey = null),
              (e.listRef = v.createRef()),
              (e.onNodeDragStart = function (n, r) {
                var i = e.state,
                  d = i.expandedKeys,
                  c = i.keyEntities,
                  f = e.props.onDragStart,
                  p = r.props.eventKey;
                (e.dragNode = r), (e.dragStartMousePosition = { x: n.clientX, y: n.clientY });
                var g = _e(d, p);
                e.setState({ draggingNodeKey: p, dragChildrenKeys: hr(p, c), indent: e.listRef.current.getIndentWidth() }),
                  e.setExpandedKeys(g),
                  window.addEventListener('dragend', e.onWindowDragEnd),
                  f == null || f({ event: n, node: oe(r.props) });
              }),
              (e.onNodeDragEnter = function (n, r) {
                var i = e.state,
                  d = i.expandedKeys,
                  c = i.keyEntities,
                  f = i.dragChildrenKeys,
                  p = i.flattenNodes,
                  g = i.indent,
                  y = e.props,
                  m = y.onDragEnter,
                  h = y.onExpand,
                  S = y.allowDrop,
                  x = y.direction,
                  N = r.props,
                  k = N.pos,
                  T = N.eventKey,
                  C = (0, ce.Z)(e),
                  P = C.dragNode;
                if ((e.currentMouseOverDroppableNodeKey !== T && (e.currentMouseOverDroppableNodeKey = T), !P)) {
                  e.resetDragState();
                  return;
                }
                var D = dn(n, P, r, g, e.dragStartMousePosition, S, p, c, d, x),
                  F = D.dropPosition,
                  O = D.dropLevelOffset,
                  j = D.dropTargetKey,
                  M = D.dropContainerKey,
                  B = D.dropTargetPos,
                  te = D.dropAllowed,
                  ie = D.dragOverNodeKey;
                if (f.indexOf(j) !== -1 || !te) {
                  e.resetDragState();
                  return;
                }
                if (
                  (e.delayedDragEnterLogic || (e.delayedDragEnterLogic = {}),
                  Object.keys(e.delayedDragEnterLogic).forEach(function (X) {
                    clearTimeout(e.delayedDragEnterLogic[X]);
                  }),
                  P.props.eventKey !== r.props.eventKey
                    && (n.persist(),
                    (e.delayedDragEnterLogic[k] = window.setTimeout(function () {
                      if (e.state.draggingNodeKey !== null) {
                        var X = (0, he.Z)(d),
                          ee = Ce(c, r.props.eventKey);
                        ee && (ee.children || []).length && (X = Ye(d, r.props.eventKey)),
                          'expandedKeys' in e.props || e.setExpandedKeys(X),
                          h == null || h(X, { node: oe(r.props), expanded: !0, nativeEvent: n.nativeEvent });
                      }
                    }, 800))),
                  P.props.eventKey === j && O === 0)
                ) {
                  e.resetDragState();
                  return;
                }
                e.setState({
                  dragOverNodeKey: ie,
                  dropPosition: F,
                  dropLevelOffset: O,
                  dropTargetKey: j,
                  dropContainerKey: M,
                  dropTargetPos: B,
                  dropAllowed: te,
                }),
                  m == null || m({ event: n, node: oe(r.props), expandedKeys: d });
              }),
              (e.onNodeDragOver = function (n, r) {
                var i = e.state,
                  d = i.dragChildrenKeys,
                  c = i.flattenNodes,
                  f = i.keyEntities,
                  p = i.expandedKeys,
                  g = i.indent,
                  y = e.props,
                  m = y.onDragOver,
                  h = y.allowDrop,
                  S = y.direction,
                  x = (0, ce.Z)(e),
                  N = x.dragNode;
                if (N) {
                  var k = dn(n, N, r, g, e.dragStartMousePosition, h, c, f, p, S),
                    T = k.dropPosition,
                    C = k.dropLevelOffset,
                    P = k.dropTargetKey,
                    D = k.dropContainerKey,
                    F = k.dropAllowed,
                    O = k.dropTargetPos,
                    j = k.dragOverNodeKey;
                  d.indexOf(P) !== -1
                    || !F
                    || (N.props.eventKey === P && C === 0
                      ? (e.state.dropPosition === null
                          && e.state.dropLevelOffset === null
                          && e.state.dropTargetKey === null
                          && e.state.dropContainerKey === null
                          && e.state.dropTargetPos === null
                          && e.state.dropAllowed === !1
                          && e.state.dragOverNodeKey === null)
                        || e.resetDragState()
                      : (T === e.state.dropPosition
                          && C === e.state.dropLevelOffset
                          && P === e.state.dropTargetKey
                          && D === e.state.dropContainerKey
                          && O === e.state.dropTargetPos
                          && F === e.state.dropAllowed
                          && j === e.state.dragOverNodeKey)
                        || e.setState({
                          dropPosition: T,
                          dropLevelOffset: C,
                          dropTargetKey: P,
                          dropContainerKey: D,
                          dropTargetPos: O,
                          dropAllowed: F,
                          dragOverNodeKey: j,
                        }),
                    m == null || m({ event: n, node: oe(r.props) }));
                }
              }),
              (e.onNodeDragLeave = function (n, r) {
                e.currentMouseOverDroppableNodeKey === r.props.eventKey
                  && !n.currentTarget.contains(n.relatedTarget)
                  && (e.resetDragState(), (e.currentMouseOverDroppableNodeKey = null));
                var i = e.props.onDragLeave;
                i == null || i({ event: n, node: oe(r.props) });
              }),
              (e.onWindowDragEnd = function (n) {
                e.onNodeDragEnd(n, null, !0), window.removeEventListener('dragend', e.onWindowDragEnd);
              }),
              (e.onNodeDragEnd = function (n, r) {
                var i = e.props.onDragEnd;
                e.setState({ dragOverNodeKey: null }),
                  e.cleanDragState(),
                  i == null || i({ event: n, node: oe(r.props) }),
                  (e.dragNode = null),
                  window.removeEventListener('dragend', e.onWindowDragEnd);
              }),
              (e.onNodeDrop = function (n, r) {
                var i,
                  d = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1,
                  c = e.state,
                  f = c.dragChildrenKeys,
                  p = c.dropPosition,
                  g = c.dropTargetKey,
                  y = c.dropTargetPos,
                  m = c.dropAllowed;
                if (m) {
                  var h = e.props.onDrop;
                  if ((e.setState({ dragOverNodeKey: null }), e.cleanDragState(), g !== null)) {
                    var S = (0, $.Z)(
                        (0, $.Z)({}, ft(g, e.getTreeNodeRequiredProps())),
                        {},
                        {
                          active: ((i = e.getActiveItem()) === null || i === void 0 ? void 0 : i.key) === g,
                          data: Ce(e.state.keyEntities, g).node,
                        },
                      ),
                      x = f.indexOf(g) !== -1;
                    (0, V.ZP)(!x, "Can not drop to dragNode's children node. This is a bug of rc-tree. Please report an issue.");
                    var N = Mt(y),
                      k = {
                        event: n,
                        node: oe(S),
                        dragNode: e.dragNode ? oe(e.dragNode.props) : null,
                        dragNodesKeys: [e.dragNode.props.eventKey].concat(f),
                        dropToGap: p !== 0,
                        dropPosition: p + Number(N[N.length - 1]),
                      };
                    d || h == null || h(k), (e.dragNode = null);
                  }
                }
              }),
              (e.cleanDragState = function () {
                var n = e.state.draggingNodeKey;
                n !== null
                  && e.setState({
                    draggingNodeKey: null,
                    dropPosition: null,
                    dropContainerKey: null,
                    dropTargetKey: null,
                    dropLevelOffset: null,
                    dropAllowed: !0,
                    dragOverNodeKey: null,
                  }),
                  (e.dragStartMousePosition = null),
                  (e.currentMouseOverDroppableNodeKey = null);
              }),
              (e.triggerExpandActionExpand = function (n, r) {
                var i = e.state,
                  d = i.expandedKeys,
                  c = i.flattenNodes,
                  f = r.expanded,
                  p = r.key,
                  g = r.isLeaf;
                if (!(g || n.shiftKey || n.metaKey || n.ctrlKey)) {
                  var y = c.filter(function (h) {
                      return h.key === p;
                    })[0],
                    m = oe((0, $.Z)((0, $.Z)({}, ft(p, e.getTreeNodeRequiredProps())), {}, { data: y.data }));
                  e.setExpandedKeys(f ? _e(d, p) : Ye(d, p)), e.onNodeExpand(n, m);
                }
              }),
              (e.onNodeClick = function (n, r) {
                var i = e.props,
                  d = i.onClick,
                  c = i.expandAction;
                c === 'click' && e.triggerExpandActionExpand(n, r), d == null || d(n, r);
              }),
              (e.onNodeDoubleClick = function (n, r) {
                var i = e.props,
                  d = i.onDoubleClick,
                  c = i.expandAction;
                c === 'doubleClick' && e.triggerExpandActionExpand(n, r), d == null || d(n, r);
              }),
              (e.onNodeSelect = function (n, r) {
                var i = e.state.selectedKeys,
                  d = e.state,
                  c = d.keyEntities,
                  f = d.fieldNames,
                  p = e.props,
                  g = p.onSelect,
                  y = p.multiple,
                  m = r.selected,
                  h = r[f.key],
                  S = !m;
                S ? (y ? (i = Ye(i, h)) : (i = [h])) : (i = _e(i, h));
                var x = i
                  .map(function (N) {
                    var k = Ce(c, N);
                    return k ? k.node : null;
                  })
                  .filter(function (N) {
                    return N;
                  });
                e.setUncontrolledState({ selectedKeys: i }),
                  g == null || g(i, { event: 'select', selected: S, node: r, selectedNodes: x, nativeEvent: n.nativeEvent });
              }),
              (e.onNodeCheck = function (n, r, i) {
                var d = e.state,
                  c = d.keyEntities,
                  f = d.checkedKeys,
                  p = d.halfCheckedKeys,
                  g = e.props,
                  y = g.checkStrictly,
                  m = g.onCheck,
                  h = r.key,
                  S,
                  x = { event: 'check', node: r, checked: i, nativeEvent: n.nativeEvent };
                if (y) {
                  var N = i ? Ye(f, h) : _e(f, h),
                    k = _e(p, h);
                  (S = { checked: N, halfChecked: k }),
                    (x.checkedNodes = N.map(function (O) {
                      return Ce(c, O);
                    })
                      .filter(function (O) {
                        return O;
                      })
                      .map(function (O) {
                        return O.node;
                      })),
                    e.setUncontrolledState({ checkedKeys: N });
                } else {
                  var T = Lt([].concat((0, he.Z)(f), [h]), !0, c),
                    C = T.checkedKeys,
                    P = T.halfCheckedKeys;
                  if (!i) {
                    var D = new Set(C);
                    D.delete(h);
                    var F = Lt(Array.from(D), { checked: !1, halfCheckedKeys: P }, c);
                    (C = F.checkedKeys), (P = F.halfCheckedKeys);
                  }
                  (S = C),
                    (x.checkedNodes = []),
                    (x.checkedNodesPositions = []),
                    (x.halfCheckedKeys = P),
                    C.forEach(function (O) {
                      var j = Ce(c, O);
                      if (j) {
                        var M = j.node,
                          B = j.pos;
                        x.checkedNodes.push(M), x.checkedNodesPositions.push({ node: M, pos: B });
                      }
                    }),
                    e.setUncontrolledState({ checkedKeys: C }, !1, { halfCheckedKeys: P });
                }
                m == null || m(S, x);
              }),
              (e.onNodeLoad = function (n) {
                var r = n.key,
                  i = new Promise(function (d, c) {
                    e.setState(function (f) {
                      var p = f.loadedKeys,
                        g = p === void 0 ? [] : p,
                        y = f.loadingKeys,
                        m = y === void 0 ? [] : y,
                        h = e.props,
                        S = h.loadData,
                        x = h.onLoad;
                      if (!S || g.indexOf(r) !== -1 || m.indexOf(r) !== -1) return null;
                      var N = S(n);
                      return (
                        N.then(function () {
                          var k = e.state.loadedKeys,
                            T = Ye(k, r);
                          x == null || x(T, { event: 'load', node: n }),
                            e.setUncontrolledState({ loadedKeys: T }),
                            e.setState(function (C) {
                              return { loadingKeys: _e(C.loadingKeys, r) };
                            }),
                            d();
                        }).catch(function (k) {
                          if (
                            (e.setState(function (C) {
                              return { loadingKeys: _e(C.loadingKeys, r) };
                            }),
                            (e.loadingRetryTimes[r] = (e.loadingRetryTimes[r] || 0) + 1),
                            e.loadingRetryTimes[r] >= Kr)
                          ) {
                            var T = e.state.loadedKeys;
                            (0, V.ZP)(!1, 'Retry for `loadData` many times but still failed. No more retry.'),
                              e.setUncontrolledState({ loadedKeys: Ye(T, r) }),
                              d();
                          }
                          c(k);
                        }),
                        { loadingKeys: Ye(m, r) }
                      );
                    });
                  });
                return i.catch(function () {}), i;
              }),
              (e.onNodeMouseEnter = function (n, r) {
                var i = e.props.onMouseEnter;
                i == null || i({ event: n, node: r });
              }),
              (e.onNodeMouseLeave = function (n, r) {
                var i = e.props.onMouseLeave;
                i == null || i({ event: n, node: r });
              }),
              (e.onNodeContextMenu = function (n, r) {
                var i = e.props.onRightClick;
                i && (n.preventDefault(), i({ event: n, node: r }));
              }),
              (e.onFocus = function () {
                var n = e.props.onFocus;
                e.setState({ focused: !0 });
                for (var r = arguments.length, i = new Array(r), d = 0; d < r; d++) i[d] = arguments[d];
                n == null || n.apply(void 0, i);
              }),
              (e.onBlur = function () {
                var n = e.props.onBlur;
                e.setState({ focused: !1 }), e.onActiveChange(null);
                for (var r = arguments.length, i = new Array(r), d = 0; d < r; d++) i[d] = arguments[d];
                n == null || n.apply(void 0, i);
              }),
              (e.getTreeNodeRequiredProps = function () {
                var n = e.state,
                  r = n.expandedKeys,
                  i = n.selectedKeys,
                  d = n.loadedKeys,
                  c = n.loadingKeys,
                  f = n.checkedKeys,
                  p = n.halfCheckedKeys,
                  g = n.dragOverNodeKey,
                  y = n.dropPosition,
                  m = n.keyEntities;
                return {
                  expandedKeys: r || [],
                  selectedKeys: i || [],
                  loadedKeys: d || [],
                  loadingKeys: c || [],
                  checkedKeys: f || [],
                  halfCheckedKeys: p || [],
                  dragOverNodeKey: g,
                  dropPosition: y,
                  keyEntities: m,
                };
              }),
              (e.setExpandedKeys = function (n) {
                var r = e.state,
                  i = r.treeData,
                  d = r.fieldNames,
                  c = Rt(i, n, d);
                e.setUncontrolledState({ expandedKeys: n, flattenNodes: c }, !0);
              }),
              (e.onNodeExpand = function (n, r) {
                var i = e.state.expandedKeys,
                  d = e.state,
                  c = d.listChanging,
                  f = d.fieldNames,
                  p = e.props,
                  g = p.onExpand,
                  y = p.loadData,
                  m = r.expanded,
                  h = r[f.key];
                if (!c) {
                  var S = i.indexOf(h),
                    x = !m;
                  if (
                    ((0, V.ZP)((m && S !== -1) || (!m && S === -1), 'Expand state not sync with index check'),
                    x ? (i = Ye(i, h)) : (i = _e(i, h)),
                    e.setExpandedKeys(i),
                    g == null || g(i, { node: r, expanded: x, nativeEvent: n.nativeEvent }),
                    x && y)
                  ) {
                    var N = e.onNodeLoad(r);
                    N
                      && N.then(function () {
                        var k = Rt(e.state.treeData, i, f);
                        e.setUncontrolledState({ flattenNodes: k });
                      }).catch(function () {
                        var k = e.state.expandedKeys,
                          T = _e(k, h);
                        e.setExpandedKeys(T);
                      });
                  }
                }
              }),
              (e.onListChangeStart = function () {
                e.setUncontrolledState({ listChanging: !0 });
              }),
              (e.onListChangeEnd = function () {
                setTimeout(function () {
                  e.setUncontrolledState({ listChanging: !1 });
                });
              }),
              (e.onActiveChange = function (n) {
                var r = e.state.activeKey,
                  i = e.props,
                  d = i.onActiveChange,
                  c = i.itemScrollOffset,
                  f = c === void 0 ? 0 : c;
                r !== n && (e.setState({ activeKey: n }), n !== null && e.scrollTo({ key: n, offset: f }), d == null || d(n));
              }),
              (e.getActiveItem = function () {
                var n = e.state,
                  r = n.activeKey,
                  i = n.flattenNodes;
                return r === null
                  ? null
                  : i.find(function (d) {
                      var c = d.key;
                      return c === r;
                    }) || null;
              }),
              (e.offsetActiveKey = function (n) {
                var r = e.state,
                  i = r.flattenNodes,
                  d = r.activeKey,
                  c = i.findIndex(function (g) {
                    var y = g.key;
                    return y === d;
                  });
                c === -1 && n < 0 && (c = i.length), (c = (c + n + i.length) % i.length);
                var f = i[c];
                if (f) {
                  var p = f.key;
                  e.onActiveChange(p);
                } else e.onActiveChange(null);
              }),
              (e.onKeyDown = function (n) {
                var r = e.state,
                  i = r.activeKey,
                  d = r.expandedKeys,
                  c = r.checkedKeys,
                  f = r.fieldNames,
                  p = e.props,
                  g = p.onKeyDown,
                  y = p.checkable,
                  m = p.selectable;
                switch (n.which) {
                  case Ze.Z.UP: {
                    e.offsetActiveKey(-1), n.preventDefault();
                    break;
                  }
                  case Ze.Z.DOWN: {
                    e.offsetActiveKey(1), n.preventDefault();
                    break;
                  }
                }
                var h = e.getActiveItem();
                if (h && h.data) {
                  var S = e.getTreeNodeRequiredProps(),
                    x = h.data.isLeaf === !1 || !!(h.data[f.children] || []).length,
                    N = oe((0, $.Z)((0, $.Z)({}, ft(i, S)), {}, { data: h.data, active: !0 }));
                  switch (n.which) {
                    case Ze.Z.LEFT: {
                      x && d.includes(i) ? e.onNodeExpand({}, N) : h.parent && e.onActiveChange(h.parent.key), n.preventDefault();
                      break;
                    }
                    case Ze.Z.RIGHT: {
                      x && !d.includes(i) ? e.onNodeExpand({}, N) : h.children && h.children.length && e.onActiveChange(h.children[0].key),
                        n.preventDefault();
                      break;
                    }
                    case Ze.Z.ENTER:
                    case Ze.Z.SPACE: {
                      y && !N.disabled && N.checkable !== !1 && !N.disableCheckbox
                        ? e.onNodeCheck({}, N, !c.includes(i))
                        : !y && m && !N.disabled && N.selectable !== !1 && e.onNodeSelect({}, N);
                      break;
                    }
                  }
                }
                g == null || g(n);
              }),
              (e.setUncontrolledState = function (n) {
                var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1,
                  i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
                if (!e.destroyed) {
                  var d = !1,
                    c = !0,
                    f = {};
                  Object.keys(n).forEach(function (p) {
                    if (p in e.props) {
                      c = !1;
                      return;
                    }
                    (d = !0), (f[p] = n[p]);
                  }),
                    d && (!r || c) && e.setState((0, $.Z)((0, $.Z)({}, f), i));
                }
              }),
              (e.scrollTo = function (n) {
                e.listRef.current.scrollTo(n);
              }),
              e
            );
          }
          return (
            (0, Se.Z)(
              o,
              [
                {
                  key: 'componentDidMount',
                  value: function () {
                    (this.destroyed = !1), this.onUpdated();
                  },
                },
                {
                  key: 'componentDidUpdate',
                  value: function () {
                    this.onUpdated();
                  },
                },
                {
                  key: 'onUpdated',
                  value: function () {
                    var l = this.props,
                      s = l.activeKey,
                      u = l.itemScrollOffset,
                      n = u === void 0 ? 0 : u;
                    s !== void 0
                      && s !== this.state.activeKey
                      && (this.setState({ activeKey: s }), s !== null && this.scrollTo({ key: s, offset: n }));
                  },
                },
                {
                  key: 'componentWillUnmount',
                  value: function () {
                    window.removeEventListener('dragend', this.onWindowDragEnd), (this.destroyed = !0);
                  },
                },
                {
                  key: 'resetDragState',
                  value: function () {
                    this.setState({
                      dragOverNodeKey: null,
                      dropPosition: null,
                      dropLevelOffset: null,
                      dropTargetKey: null,
                      dropContainerKey: null,
                      dropTargetPos: null,
                      dropAllowed: !1,
                    });
                  },
                },
                {
                  key: 'render',
                  value: function () {
                    var l,
                      s = this.state,
                      u = s.focused,
                      n = s.flattenNodes,
                      r = s.keyEntities,
                      i = s.draggingNodeKey,
                      d = s.activeKey,
                      c = s.dropLevelOffset,
                      f = s.dropContainerKey,
                      p = s.dropTargetKey,
                      g = s.dropPosition,
                      y = s.dragOverNodeKey,
                      m = s.indent,
                      h = this.props,
                      S = h.prefixCls,
                      x = h.className,
                      N = h.style,
                      k = h.showLine,
                      T = h.focusable,
                      C = h.tabIndex,
                      P = C === void 0 ? 0 : C,
                      D = h.selectable,
                      F = h.showIcon,
                      O = h.icon,
                      j = h.switcherIcon,
                      M = h.draggable,
                      B = h.checkable,
                      te = h.checkStrictly,
                      ie = h.disabled,
                      X = h.motion,
                      ee = h.loadData,
                      Ke = h.filterTreeNode,
                      De = h.height,
                      Me = h.itemHeight,
                      le = h.virtual,
                      fe = h.titleRender,
                      Ne = h.dropIndicatorRender,
                      Re = h.onContextMenu,
                      We = h.onScroll,
                      Ae = h.direction,
                      ze = h.rootClassName,
                      ye = h.rootStyle,
                      ne = J(this.props, { aria: !0, data: !0 }),
                      ve;
                    return (
                      M && ((0, Pe.Z)(M) === 'object' ? (ve = M) : typeof M == 'function' ? (ve = { nodeDraggable: M }) : (ve = {})),
                      v.createElement(
                        R.Provider,
                        {
                          value: {
                            prefixCls: S,
                            selectable: D,
                            showIcon: F,
                            icon: O,
                            switcherIcon: j,
                            draggable: ve,
                            draggingNodeKey: i,
                            checkable: B,
                            checkStrictly: te,
                            disabled: ie,
                            keyEntities: r,
                            dropLevelOffset: c,
                            dropContainerKey: f,
                            dropTargetKey: p,
                            dropPosition: g,
                            dragOverNodeKey: y,
                            indent: m,
                            direction: Ae,
                            dropIndicatorRender: Ne,
                            loadData: ee,
                            filterTreeNode: Ke,
                            titleRender: fe,
                            onNodeClick: this.onNodeClick,
                            onNodeDoubleClick: this.onNodeDoubleClick,
                            onNodeExpand: this.onNodeExpand,
                            onNodeSelect: this.onNodeSelect,
                            onNodeCheck: this.onNodeCheck,
                            onNodeLoad: this.onNodeLoad,
                            onNodeMouseEnter: this.onNodeMouseEnter,
                            onNodeMouseLeave: this.onNodeMouseLeave,
                            onNodeContextMenu: this.onNodeContextMenu,
                            onNodeDragStart: this.onNodeDragStart,
                            onNodeDragEnter: this.onNodeDragEnter,
                            onNodeDragOver: this.onNodeDragOver,
                            onNodeDragLeave: this.onNodeDragLeave,
                            onNodeDragEnd: this.onNodeDragEnd,
                            onNodeDrop: this.onNodeDrop,
                          },
                        },
                        v.createElement(
                          'div',
                          {
                            role: 'tree',
                            className: ue()(
                              S,
                              x,
                              ze,
                              ((l = {}),
                              (0, Z.Z)(l, ''.concat(S, '-show-line'), k),
                              (0, Z.Z)(l, ''.concat(S, '-focused'), u),
                              (0, Z.Z)(l, ''.concat(S, '-active-focused'), d !== null),
                              l),
                            ),
                            style: ye,
                          },
                          v.createElement(
                            vr,
                            (0, de.Z)(
                              {
                                ref: this.listRef,
                                prefixCls: S,
                                style: N,
                                data: n,
                                disabled: ie,
                                selectable: D,
                                checkable: !!B,
                                motion: X,
                                dragging: i !== null,
                                height: De,
                                itemHeight: Me,
                                virtual: le,
                                focusable: T,
                                focused: u,
                                tabIndex: P,
                                activeItem: this.getActiveItem(),
                                onFocus: this.onFocus,
                                onBlur: this.onBlur,
                                onKeyDown: this.onKeyDown,
                                onActiveChange: this.onActiveChange,
                                onListChangeStart: this.onListChangeStart,
                                onListChangeEnd: this.onListChangeEnd,
                                onContextMenu: Re,
                                onScroll: We,
                              },
                              this.getTreeNodeRequiredProps(),
                              ne,
                            ),
                          ),
                        ),
                      )
                    );
                  },
                },
              ],
              [
                {
                  key: 'getDerivedStateFromProps',
                  value: function (l, s) {
                    var u = s.prevProps,
                      n = { prevProps: l };
                    function r(T) {
                      return (!u && T in l) || (u && u[T] !== l[T]);
                    }
                    var i,
                      d = s.fieldNames;
                    if (
                      (r('fieldNames') && ((d = Kt(l.fieldNames)), (n.fieldNames = d)),
                      r('treeData')
                        ? (i = l.treeData)
                        : r('children')
                          && ((0, V.ZP)(!1, '`children` of Tree is deprecated. Please use `treeData` instead.'), (i = qn(l.children))),
                      i)
                    ) {
                      n.treeData = i;
                      var c = tr(i, { fieldNames: d });
                      n.keyEntities = (0, $.Z)((0, Z.Z)({}, tt, rn), c.keyEntities);
                    }
                    var f = n.keyEntities || s.keyEntities;
                    if (r('expandedKeys') || (u && r('autoExpandParent')))
                      n.expandedKeys = l.autoExpandParent || (!u && l.defaultExpandParent) ? un(l.expandedKeys, f) : l.expandedKeys;
                    else if (!u && l.defaultExpandAll) {
                      var p = (0, $.Z)({}, f);
                      delete p[tt],
                        (n.expandedKeys = Object.keys(p).map(function (T) {
                          return p[T].key;
                        }));
                    } else
                      !u
                        && l.defaultExpandedKeys
                        && (n.expandedKeys =
                          l.autoExpandParent || l.defaultExpandParent ? un(l.defaultExpandedKeys, f) : l.defaultExpandedKeys);
                    if ((n.expandedKeys || delete n.expandedKeys, i || n.expandedKeys)) {
                      var g = Rt(i || s.treeData, n.expandedKeys || s.expandedKeys, d);
                      n.flattenNodes = g;
                    }
                    if (
                      (l.selectable
                        && (r('selectedKeys')
                          ? (n.selectedKeys = cn(l.selectedKeys, l))
                          : !u && l.defaultSelectedKeys && (n.selectedKeys = cn(l.defaultSelectedKeys, l))),
                      l.checkable)
                    ) {
                      var y;
                      if (
                        (r('checkedKeys')
                          ? (y = wt(l.checkedKeys) || {})
                          : !u && l.defaultCheckedKeys
                          ? (y = wt(l.defaultCheckedKeys) || {})
                          : i && (y = wt(l.checkedKeys) || { checkedKeys: s.checkedKeys, halfCheckedKeys: s.halfCheckedKeys }),
                        y)
                      ) {
                        var m = y,
                          h = m.checkedKeys,
                          S = h === void 0 ? [] : h,
                          x = m.halfCheckedKeys,
                          N = x === void 0 ? [] : x;
                        if (!l.checkStrictly) {
                          var k = Lt(S, !0, f);
                          (S = k.checkedKeys), (N = k.halfCheckedKeys);
                        }
                        (n.checkedKeys = S), (n.halfCheckedKeys = N);
                      }
                    }
                    return r('loadedKeys') && (n.loadedKeys = l.loadedKeys), n;
                  },
                },
              ],
            ),
            o
          );
        })(v.Component);
      (vn.defaultProps = {
        prefixCls: 'rc-tree',
        showLine: !1,
        showIcon: !0,
        selectable: !0,
        multiple: !1,
        checkable: !1,
        disabled: !1,
        checkStrictly: !1,
        draggable: !1,
        defaultExpandParent: !0,
        autoExpandParent: !1,
        defaultExpandAll: !1,
        defaultExpandedKeys: [],
        defaultCheckedKeys: [],
        defaultSelectedKeys: [],
        dropIndicatorRender: U,
        allowDrop: function () {
          return !0;
        },
        expandAction: !1,
      }),
        (vn.TreeNode = Ot);
      var aa = null,
        oa = null;
      function vt(t) {
        '@babel/helpers - typeof';
        return (
          (vt =
            typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
              ? function (a) {
                  return typeof a;
                }
              : function (a) {
                  return a && typeof Symbol == 'function' && a.constructor === Symbol && a !== Symbol.prototype ? 'symbol' : typeof a;
                }),
          vt(t)
        );
      }
      function pn(t, a) {
        var o = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var e = Object.getOwnPropertySymbols(t);
          a
            && (e = e.filter(function (l) {
              return Object.getOwnPropertyDescriptor(t, l).enumerable;
            })),
            o.push.apply(o, e);
        }
        return o;
      }
      function hn(t) {
        for (var a = 1; a < arguments.length; a++) {
          var o = arguments[a] != null ? arguments[a] : {};
          a % 2
            ? pn(Object(o), !0).forEach(function (e) {
                Nr(t, e, o[e]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(o))
            : pn(Object(o)).forEach(function (e) {
                Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(o, e));
              });
        }
        return t;
      }
      function Nr(t, a, o) {
        return (
          (a = kr(a)), a in t ? Object.defineProperty(t, a, { value: o, enumerable: !0, configurable: !0, writable: !0 }) : (t[a] = o), t
        );
      }
      function kr(t) {
        var a = Cr(t, 'string');
        return vt(a) === 'symbol' ? a : String(a);
      }
      function Cr(t, a) {
        if (vt(t) !== 'object' || t === null) return t;
        var o = t[Symbol.toPrimitive];
        if (o !== void 0) {
          var e = o.call(t, a || 'default');
          if (vt(e) !== 'object') return e;
          throw new TypeError('@@toPrimitive must return a primitive value.');
        }
        return (a === 'string' ? String : Number)(t);
      }
      function Dr(t, a) {
        return Or(t) || Tr(t, a) || gn(t, a) || Rr();
      }
      function Rr() {
        throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function Tr(t, a) {
        var o = t == null ? null : (typeof Symbol != 'undefined' && t[Symbol.iterator]) || t['@@iterator'];
        if (o != null) {
          var e,
            l,
            s,
            u,
            n = [],
            r = !0,
            i = !1;
          try {
            if (((s = (o = o.call(t)).next), a === 0)) {
              if (Object(o) !== o) return;
              r = !1;
            } else for (; !(r = (e = s.call(o)).done) && (n.push(e.value), n.length !== a); r = !0);
          } catch (d) {
            (i = !0), (l = d);
          } finally {
            try {
              if (!r && o.return != null && ((u = o.return()), Object(u) !== u)) return;
            } finally {
              if (i) throw l;
            }
          }
          return n;
        }
      }
      function Or(t) {
        if (Array.isArray(t)) return t;
      }
      function Pr(t) {
        return Lr(t) || wr(t) || gn(t) || Mr();
      }
      function Mr() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }
      function gn(t, a) {
        if (t) {
          if (typeof t == 'string') return Zt(t, a);
          var o = Object.prototype.toString.call(t).slice(8, -1);
          if ((o === 'Object' && t.constructor && (o = t.constructor.name), o === 'Map' || o === 'Set')) return Array.from(t);
          if (o === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)) return Zt(t, a);
        }
      }
      function wr(t) {
        if ((typeof Symbol != 'undefined' && t[Symbol.iterator] != null) || t['@@iterator'] != null) return Array.from(t);
      }
      function Lr(t) {
        if (Array.isArray(t)) return Zt(t);
      }
      function Zt(t, a) {
        (a == null || a > t.length) && (a = t.length);
        for (var o = 0, e = new Array(a); o < a; o++) e[o] = t[o];
        return e;
      }
      function Nt(t) {
        var a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : '',
          o = [];
        return (
          [].concat(t).forEach(function (e, l) {
            var s = ''.concat(a ? ''.concat(a, '-') : '').concat(l);
            switch (e == null ? void 0 : e.type) {
              case 'ul': {
                var u,
                  n = ((u = o[o.length - 1]) === null || u === void 0 ? void 0 : u.children) || o,
                  r = Nt(e.props.children || [], s);
                n.push.apply(n, Pr(r));
                break;
              }
              case 'li': {
                var i = Nt(e.props.children, s);
                o.push({
                  title: [].concat(e.props.children).filter(function (d) {
                    return d.type !== 'ul';
                  }),
                  key: s,
                  children: i,
                  isLeaf: !i.length,
                });
                break;
              }
              default:
            }
          }),
          o
        );
      }
      var Zr = function (a) {
          var o = useState(Nt(a)),
            e = Dr(o, 2),
            l = e[0],
            s = e[1];
          return (
            useEffect(
              function () {
                s(Nt(a));
              },
              [a],
            ),
            l
          );
        },
        Ir = function (a) {
          var o = a.isLeaf,
            e = a.expanded;
          return o
            ? React.createElement(
                'span',
                { className: 'dumi-default-tree-icon' },
                React.createElement(FileOutlined, { fill: 'currentColor' }),
              )
            : e
            ? React.createElement(
                'span',
                { className: 'dumi-default-tree-icon' },
                React.createElement(FolderOpenOutlined, { fill: 'currentColor' }),
              )
            : React.createElement(
                'span',
                { className: 'dumi-default-tree-icon' },
                React.createElement(FolderOutlined, { fill: 'currentColor' }),
              );
        },
        Ar = function (a) {
          var o = a.isLeaf,
            e = a.expanded;
          return o
            ? React.createElement('span', { className: 'tree-switcher-leaf-line' })
            : e
            ? React.createElement(
                'span',
                { className: 'tree-switcher-line-icon' },
                React.createElement(
                  'span',
                  { className: 'dumi-default-tree-icon' },
                  React.createElement(MinusSquareOutlined, { fill: 'currentColor' }),
                ),
              )
            : React.createElement(
                'span',
                { className: 'tree-switcher-line-icon' },
                React.createElement(
                  'span',
                  { className: 'dumi-default-tree-icon' },
                  React.createElement(PlusSquareOutlined, { fill: 'currentColor' }),
                ),
              );
        },
        It = function () {
          return { height: 0, opacity: 0 };
        },
        yn = function (a) {
          var o = a.scrollHeight;
          return { height: o, opacity: 1 };
        },
        $r = function (a) {
          return { height: a ? a.offsetHeight : 0 };
        },
        At = function (a, o) {
          return (o == null ? void 0 : o.deadline) === !0 || o.propertyName === 'height';
        },
        jr = {
          motionName: 'ant-motion-collapse',
          onAppearStart: It,
          onEnterStart: It,
          onAppearActive: yn,
          onEnterActive: yn,
          onLeaveStart: $r,
          onLeaveActive: It,
          onAppearEnd: At,
          onEnterEnd: At,
          onLeaveEnd: At,
          motionDeadline: 500,
        },
        ia = function (t) {
          var a = Zr(t.children),
            o = createRef(),
            e = function (s, u) {
              var n = u.isLeaf;
              n || s.shiftKey || s.metaKey || s.ctrlKey || o.current.onNodeExpand(s, u);
            };
          return React.createElement(Tree, {
            className: 'dumi-default-tree',
            icon: Ir,
            ref: o,
            itemHeight: 20,
            showLine: !0,
            selectable: !1,
            virtual: !1,
            motion: hn(hn({}, jr), {}, { motionAppear: !1 }),
            onClick: e,
            treeData: [{ key: '0', title: t.title || '<root>', children: a }],
            defaultExpandAll: !0,
            switcherIcon: Ar,
          });
        };
    },
    14315: function (dt, yt, A) {
      var de = 'Expected a function',
        Z = NaN,
        Pe = '[object Symbol]',
        $ = /^\s+|\s+$/g,
        he = /^[-+]0x[0-9a-f]+$/i,
        me = /^0b[01]+$/i,
        Se = /^0o[0-7]+$/i,
        ce = parseInt,
        Ge = typeof A.g == 'object' && A.g && A.g.Object === Object && A.g,
        je = typeof self == 'object' && self && self.Object === Object && self,
        qe = Ge || je || Function('return this')(),
        ue = Object.prototype,
        Ze = ue.toString,
        E = Math.max,
        b = Math.min,
        K = function () {
          return qe.Date.now();
        };
      function I(R, U, Q) {
        var H,
          Y,
          q,
          He,
          xe,
          Ie,
          et = 0,
          ke = !1,
          Ve = !1,
          ct = !0;
        if (typeof R != 'function') throw new TypeError(de);
        (U = v(U) || 0),
          _(Q)
            && ((ke = !!Q.leading),
            (Ve = 'maxWait' in Q),
            (q = Ve ? E(v(Q.maxWait) || 0, U) : q),
            (ct = 'trailing' in Q ? !!Q.trailing : ct));
        function it(ae) {
          var we = H,
            Fe = Y;
          return (H = Y = void 0), (et = ae), (He = R.apply(Fe, we)), He;
        }
        function kt(ae) {
          return (et = ae), (xe = setTimeout(lt, U)), ke ? it(ae) : He;
        }
        function Ct(ae) {
          var we = ae - Ie,
            Fe = ae - et,
            xt = U - we;
          return Ve ? b(xt, q - Fe) : xt;
        }
        function mt(ae) {
          var we = ae - Ie,
            Fe = ae - et;
          return Ie === void 0 || we >= U || we < 0 || (Ve && Fe >= q);
        }
        function lt() {
          var ae = K();
          if (mt(ae)) return St(ae);
          xe = setTimeout(lt, Ct(ae));
        }
        function St(ae) {
          return (xe = void 0), ct && H ? it(ae) : ((H = Y = void 0), He);
        }
        function Dt() {
          xe !== void 0 && clearTimeout(xe), (et = 0), (H = Ie = Y = xe = void 0);
        }
        function bt() {
          return xe === void 0 ? He : St(K());
        }
        function Et() {
          var ae = K(),
            we = mt(ae);
          if (((H = arguments), (Y = this), (Ie = ae), we)) {
            if (xe === void 0) return kt(Ie);
            if (Ve) return (xe = setTimeout(lt, U)), it(Ie);
          }
          return xe === void 0 && (xe = setTimeout(lt, U)), He;
        }
        return (Et.cancel = Dt), (Et.flush = bt), Et;
      }
      function z(R, U, Q) {
        var H = !0,
          Y = !0;
        if (typeof R != 'function') throw new TypeError(de);
        return (
          _(Q) && ((H = 'leading' in Q ? !!Q.leading : H), (Y = 'trailing' in Q ? !!Q.trailing : Y)),
          I(R, U, { leading: H, maxWait: U, trailing: Y })
        );
      }
      function _(R) {
        var U = typeof R;
        return !!R && (U == 'object' || U == 'function');
      }
      function J(R) {
        return !!R && typeof R == 'object';
      }
      function V(R) {
        return typeof R == 'symbol' || (J(R) && Ze.call(R) == Pe);
      }
      function v(R) {
        if (typeof R == 'number') return R;
        if (V(R)) return Z;
        if (_(R)) {
          var U = typeof R.valueOf == 'function' ? R.valueOf() : R;
          R = _(U) ? U + '' : U;
        }
        if (typeof R != 'string') return R === 0 ? R : +R;
        R = R.replace($, '');
        var Q = me.test(R);
        return Q || Se.test(R) ? ce(R.slice(2), Q ? 2 : 8) : he.test(R) ? Z : +R;
      }
      dt.exports = z;
    },
  },
]);
