'use strict';
(self.webpackChunkhelux_docs = self.webpackChunkhelux_docs || []).push([
  [923],
  {
    99547: function (v, n, e) {
      e.r(n),
        e.d(n, {
          default: function () {
            return h;
          },
        });
      var a = e(70125),
        u = e.n(a),
        t = e(70079),
        _ = e(80904),
        i = e(15243),
        o = e(76095),
        d = e(33865),
        m = e(35250),
        c = {};
      function h() {
        var p = (0, _.pC)(),
          f = (0, t.useState)(!1),
          s = u()(f, 2),
          E = s[0],
          g = s[1],
          l = (0, t.useRef)(_.m8.location.pathname);
        return (
          (0, t.useEffect)(function () {
            return _.m8.listen(function (r) {
              r.location.pathname !== l.current && ((l.current = r.location.pathname), document.documentElement.scrollTo(0, 0));
            });
          }, []),
          (0, m.jsx)(i.D.Provider, {
            value: {
              pkg: {
                name: 'helux-docs',
                description: 'A state library that integrates atom, signal, derive, watch and collection dep',
                version: '0.0.1',
                license: 'MIT',
                authors: [],
              },
              historyType: 'browser',
              entryExports: c,
              demos: o.DE,
              components: o.wx,
              locales: d.k,
              loading: E,
              setLoading: g,
              hostname: void 0,
              themeConfig: {
                logo: 'https://tnfe.gtimg.com/image/dlykfuw8ai_1703851692543.png',
                footer: 'Copyright \xA9 2023 | Powered by <a href="https://d.umijs.org" target="_blank" rel="noreferrer">dumi</a>',
                prefersColor: { default: 'light', switch: !0 },
                nprogress: !0,
                lastUpdated: !0,
                name: 'Helux',
                nav: [
                  { title: '\u6307\u5357', link: '/guide' },
                  { title: '\u53C2\u8003', link: '/reference' },
                  { title: '\u6559\u7A0B', link: '/examples' },
                  { title: '\u751F\u6001', link: '/ecosystem' },
                  { title: 'GitHub', link: 'https://github.com/heluxjs/helux' },
                ],
              },
              _2_level_nav_available: !0,
            },
            children: p,
          })
        );
      }
    },
  },
]);
