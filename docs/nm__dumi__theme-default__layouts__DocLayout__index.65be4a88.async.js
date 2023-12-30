'use strict';
(self.webpackChunkhelux_docs = self.webpackChunkhelux_docs || []).push([
  [255],
  {
    15346: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return g;
        },
      });
      var n = e(80904),
        s = e(70079),
        r = e(35250),
        d = [
          'https://tnfe.gtimg.com/image/harzqyxcgz_1651755973579.png',
          'https://tnfe.gtimg.com/image/p40w0k40pt_1651755965504.png',
          'https://tnfe.gtimg.com/image/fxy2nbeh43_1651755969439.png',
          'https://tnfe.gtimg.com/image/bxzj46o32k_1651755962175.png',
          'https://tnfe.gtimg.com/image/ngex07gcez_1651755956158.png',
          'https://tnfe.gtimg.com/image/harzqyxcgz_1651755973579.png',
        ],
        k = d[0];
      function i(o) {
        return d[o] || d[0];
      }
      var p = function () {
          var y,
            Z = (0, n.eL)(),
            c = Z.frontmatter;
          return !((y = c.features) === null || y === void 0) && y.length
            ? (0, r.jsx)('div', {
                className: 'dumi-default-features',
                'data-cols':
                  [3, 2].find(function (m) {
                    return c.features.length % m === 0;
                  }) || 3,
                children: c.features.map(function (m, _) {
                  var E = m.title,
                    b = m.description,
                    f = m.emoji,
                    h = m.link,
                    a;
                  h
                    && (a = /^(\w+:)\/\/|^(mailto|tel):/.test(h)
                      ? (0, r.jsx)('a', { href: h, target: '_blank', rel: 'noreferrer', children: E })
                      : (0, r.jsx)(n.rU, { to: h, children: E }));
                  var l = {
                    boxShadow: '1px 2px 2px 1px rgba(0, 0, 255, .2)',
                    backgroundColor: '#fff',
                    borderRadius: '6px',
                    padding: '24px 24px',
                    boxSizing: 'border-box',
                    height: '270px',
                  };
                  return (0,
                  r.jsxs)('div', { className: 'dumi-default-features-item', style: l, children: [(0, r.jsx)('div', { style: { textAlign: 'center' }, children: (0, r.jsx)('img', { src: i(_), style: { width: '88px', height: '88px' } }) }), (0, r.jsx)('span', { style: { color: '#443082' }, children: E && (0, r.jsx)('h2', { children: a || E }) }), (0, r.jsxs)('span', { style: { color: '#ad4e00' }, children: [' ', b && (0, r.jsx)('p', { dangerouslySetInnerHTML: { __html: b } })] })] }, E);
                }),
              })
            : null;
        },
        g = p;
    },
    72686: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return d;
        },
      });
      var n = e(70079),
        s = e(35250),
        r = function () {
          return (0, s.jsx)(s.Fragment, {
            children: (0, s.jsxs)('div', {
              className: 'dumi-default-footer',
              children: [
                'Copyright \xA9 ',
                new Date().getFullYear(),
                ' Tencent PCG TNTWeb.',
                (0, s.jsxs)('div', {
                  children: [
                    'Author:',
                    (0, s.jsx)('a', {
                      style: { paddingLeft: '6px' },
                      href: 'https://github.com/fantasticsoul',
                      target: '__blink',
                      children: 'fantasticsoul',
                    }),
                    ', Welcome to follow my open source project:',
                    (0, s.jsx)('a', {
                      style: { paddingLeft: '6px' },
                      href: 'https://github.com/heluxjs/helux',
                      target: '__blink',
                      children: 'helux',
                    }),
                    (0, s.jsx)('a', {
                      style: { paddingLeft: '6px' },
                      href: 'https://github.com/Tencent/hel',
                      target: '__blink',
                      children: 'hel-micro',
                    }),
                    (0, s.jsx)('a', {
                      style: { paddingLeft: '6px' },
                      href: 'https://github.com/tnfe/limu',
                      target: '__blink',
                      children: 'limu',
                    }),
                  ],
                }),
              ],
            }),
          });
        },
        d = r;
    },
    24417: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return d;
        },
      });
      var n = e(70079),
        s = e(35250),
        r = function (i) {
          return (0, s.jsxs)('div', {
            children: [
              (0, s.jsxs)('div', {
                className: 'blinkTitle',
                children: ['React developing. ', (0, s.jsx)('span', { style: { fontWeight: 800 }, children: 'Redefined.' })],
              }),
              (0, s.jsxs)('h1', {
                className: 'dumi-default-hero-title',
                children: [
                  (0, s.jsx)('img', { src: 'https://tnfe.gtimg.com/image/dlykfuw8ai_1703851692543.png', style: { paddingRight: '30px' } }),
                  (0, s.jsx)('span', { children: i.children }),
                ],
              }),
            ],
          });
        },
        d = r;
    },
    10473: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return b;
        },
      });
      var n = e(39114),
        s = e.n(n),
        r = e(70125),
        d = e.n(r),
        k = e(30011),
        i = e(19444),
        p = e(80904),
        g = e(70079),
        o = e(35250),
        y = function () {
          return (0, o.jsx)(o.Fragment, {});
        },
        Z = y,
        c = function (h) {
          var a = h.data,
            l = (0, p.TH)(),
            L = l.pathname,
            M = (0, g.useState)(function () {
              var j;
              return (j = a.children) === null || j === void 0
                ? void 0
                : j.some(function (P) {
                    var T = P.activePath || P.link;
                    return T && L.startsWith(T);
                  });
            }),
            I = d()(M, 2),
            S = I[0],
            U = I[1],
            D =
              a.children
              && (0, o.jsx)('button', {
                className: 'dumi-default-navbar-collapse-btn',
                type: 'button',
                onClick: function (P) {
                  P.stopPropagation(),
                    U(function (T) {
                      return !T;
                    });
                },
                'data-collapsed': S || void 0,
                children: (0, o.jsx)(k.r, {}),
              }),
            C =
              a.children
              && (0, o.jsx)('ul', {
                className: 'dumi-default-navbar-dropdown',
                'data-collapsed': S || void 0,
                children: (0, o.jsx)(_, { data: a.children }),
              }),
            v = a.activePath || a.link,
            x = v && L.startsWith(v) ? { className: 'active' } : {};
          return (
            console.log('--->', a),
            a.link
              ? (0, o.jsxs)(o.Fragment, { children: [(0, o.jsx)(p.rU, s()(s()({ to: a.link }, x), {}, { children: a.title })), D, C] })
              : (0, o.jsxs)(o.Fragment, {
                  children: [
                    (0, o.jsx)(
                      'span',
                      s()(
                        s()(
                          {
                            onClick: function (P) {
                              P.stopPropagation(),
                                U(function (T) {
                                  return !T;
                                });
                            },
                          },
                          x,
                        ),
                        {},
                        { children: a.title },
                      ),
                    ),
                    D,
                    C,
                  ],
                })
          );
        };
      function m(f) {
        return f.title === 'GitHub'
          ? (0, o.jsxs)('span', { children: [f.title, ' ', (0, o.jsx)(i.r, { style: { width: '18px', verticalAlign: 'top' } })] })
          : f.title;
      }
      var _ = function (h) {
          var a = h.data;
          return (0, o.jsx)(o.Fragment, {
            children: a.map(function (l) {
              return (0,
              o.jsx)('li', { children: l.link && /^(\w+:)\/\/|^(mailto|tel):/.test(l.link) ? (0, o.jsx)('a', { href: l.link, target: '_blank', rel: 'noreferrer', children: m(l) }) : (0, o.jsx)(c, { data: l }) }, l.activePath || l.link || l.title);
            }),
          });
        },
        E = function () {
          var h = (0, p.OK)();
          return (0, o.jsxs)('ul', { className: 'dumi-default-navbar', children: [(0, o.jsx)(_, { data: h }), (0, o.jsx)(Z, {})] });
        },
        b = E;
    },
    33731: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return i;
        },
      });
      var n = e(80904),
        s = e(87482),
        r = e(70079),
        d = e(35250),
        k = function () {
          var g = (0, n.TH)(),
            o = g.pathname,
            y = (0, n.eL)(),
            Z = (0, n.tx)();
          return Z
            ? (0, d.jsx)('div', {
                className: 'dumi-default-sidebar smallScBar',
                children: Z.map(function (c, m) {
                  return (0, d.jsxs)(
                    'dl',
                    {
                      className: 'dumi-default-sidebar-group',
                      children: [
                        c.title && (0, d.jsx)('dt', { children: c.title }),
                        c.children.map(function (_) {
                          return (0,
                          d.jsxs)('dd', { children: [(0, d.jsx)(n.OL, { to: _.link, title: _.title, end: !0, children: _.title }), _.link === o && y.frontmatter.toc === 'menu' && (0, d.jsx)(s.Z, {})] }, _.link);
                        }),
                      ],
                    },
                    String(m),
                  );
                }),
              })
            : null;
        },
        i = k;
    },
    87482: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return y;
        },
      });
      var n = e(39114),
        s = e.n(n),
        r = e(70125),
        d = e.n(r),
        k = e(41226),
        i = e(80904),
        p = e(70079),
        g = e(35250),
        o = function () {
          var c = (0, i.TH)(),
            m = c.pathname,
            _ = c.search,
            E = c.hash,
            b = (0, i.eL)(),
            f = (0, i.zh)(),
            h = (0, i.WF)(),
            a = h.loading,
            l = (0, p.useRef)(0),
            L = (0, p.useState)([]),
            M = d()(L, 2),
            I = M[0],
            S = M[1],
            U = p.useMemo(
              function () {
                var D = b.toc;
                return (
                  f && (D = f.toc),
                  D.filter(function (C) {
                    var v = C.depth;
                    return v > 1 && v < 4;
                  })
                );
              },
              [b, f],
            );
          return (
            (0, p.useEffect)(
              function () {
                if (!a) {
                  var D = U.map(function (C) {
                    var v = C.id;
                    return { current: document.getElementById(v) };
                  });
                  S(D);
                }
              },
              [m, _, a, U],
            ),
            I.length
              ? (0, g.jsx)(k.i, {
                  sectionRefs: I,
                  children: function (C) {
                    var v = C.currentElementIndexInViewport;
                    return (
                      v > -1 && (l.current = v),
                      (0, g.jsx)('ul', {
                        className: 'dumi-default-toc',
                        children: U.filter(function (x) {
                          var j = x.depth;
                          return j > 1 && j < 4;
                        }).map(function (x, j) {
                          var P = ''.concat(_, '#').concat(encodeURIComponent(x.id)),
                            T = v > -1 ? v : l.current;
                          return (0, g.jsx)(
                            'li',
                            {
                              'data-depth': x.depth,
                              children: (0, g.jsx)(
                                i.rU,
                                s()(
                                  s()(
                                    {
                                      to: P,
                                      onClickCapture: function () {
                                        decodeURIComponent(E).slice(1) === x.id && i.m8.replace(''.concat(m).concat(_));
                                      },
                                      title: x.title,
                                    },
                                    T === j ? { className: 'active' } : {},
                                  ),
                                  {},
                                  { children: x.title },
                                ),
                              ),
                            },
                            x.id,
                          );
                        }),
                      })
                    );
                  },
                })
              : null
          );
        },
        y = o;
    },
    70736: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return n.Z;
        },
      });
      var n = e(32800);
    },
    44044: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return n.Z;
        },
      });
      var n = e(29684);
    },
    66803: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return n.Z;
        },
      });
      var n = e(35750);
    },
    34395: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return n.Z;
        },
      });
      var n = e(71314);
    },
    26415: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return n.Z;
        },
      });
      var n = e(6391);
    },
    88500: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return n.Z;
        },
      });
      var n = e(70196);
    },
    17353: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return n.Z;
        },
      });
      var n = e(27883);
    },
    32776: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return n.Z;
        },
      });
      var n = e(66265);
    },
    65989: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return n.Z;
        },
      });
      var n = e(51669);
    },
    22224: function (u, t, e) {
      e.d(t, {
        ZP: function () {
          return n.ZP;
        },
      });
      var n = e(25995);
    },
    89471: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return n.Z;
        },
      });
      var n = e(20406);
    },
    27618: function (u, t, e) {
      e.d(t, {
        Z: function () {
          return n.Z;
        },
      });
      var n = e(99419);
    },
  },
]);
