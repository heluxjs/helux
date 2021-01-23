/** @typedef {import('enzyme').ReactWrapper<any, Readonly<{}>} Wrap */
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { useConcent, register } from '../src/index';
import { okeys } from '../src/support/util';

export function getTestModels() {
  return {
    test: {
      state: {
        name: 'name',
        age: 18,
        grade: 19,
        grade2: 190,
        asValue: '',
        isBig: false,
        isBig2: false,
        isBig3: 'not bool',
        nest: {
          isBig: false,
        },
        nestArr: [false, 'xxx'],
        nestObjArr: [{ isBig: false }, { isBig: false }],
        arr: [1, 2, 3],
        objArr: [{ num: 1 }, { num: 2 }],
        books: [
          { id: 1, name: 'concent', author: 'zzk', publishTime: '2019' },
          { id: 2, name: 'concent-lite', author: 'fancy', publishTime: '2020' },
        ],
      },
      computed: {
        nameAndAge: ({ name, age }) => `${name}${age}`,
        bookMap: ({ books }) => books.reduce((map, item) => { map[item.id] = item; return map }, {}),
      },
      reducer: {
        setState: state => state,
      },
    },
    test2: {
      state: () => ({ desc: 'module test2' }),
    },
    test3: {
      state: () => ({ desc: 'module test3' }),
    },
  };
}

export function makeStoreConfig(moduleName, genNormalModule = true) {
  const conf = {
    [moduleName]: {
      state: () => ({
        name: moduleName,
        age: 22,
        info: {
          addr: 'bj',
          email: 'x@concent.com',
        },
        tag: 'hi',
      }),
      reducer: {
        changeName(name, moduleState, ctx) {
          return { name };
        },
        changeAge(p, moduleState) {
          const { age } = moduleState;
          return { age: age + 1 };
        },
        async combine2Fn(p, m, ac) {
          await ac.dispatch('changeName');
          await ac.dispatch('changeAge');
        },
        async combine2FnLazy(tag, m, ac) {
          await ac.dispatch('combine2Fn', { lazy: true });
          return { tag };
        },
      },
      computed: {
        name({ name }) {
          return `name_${name}`;
        },
        info({ info }) {
          return `cu_${info.addr}`;
        },
      }
    },
  };

  if (genNormalModule) {
    conf.withNormalStateDeclaration = {
      state: { name: 'for testing cloneModule' },
    };
  }

  return conf;
}

export function toError(err) {
  if (typeof err === 'string') return new Error(err);
  else return err;
}

export function extractMessage(err) {
  if (typeof err === 'string') return err;
  else return err.message;
}

export function delay(ms = 1000) {
  return new Promise(r => setTimeout(r, ms));
}

export function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function makeComp(module, setup) {
  const CompFn = () => {
    const { refComputed: rcu, state, settings } = useConcent({ module, setup });
    return (
      <div>
        {okeys(state).map(key => {
          const val = state[key];
          if (typeof val === 'object') return '';
          return <h1 key={key} className={key}>{state[key]}</h1>;
        })}
        {okeys(rcu).map(key => <h2 key={key} className={key}>{rcu[key]}</h2>)}
        <button onClick={settings.onBtnClick}>onBtnClick</button>
      </div>
    );
  };
  const CompCls = register({ module, setup })(
    class extends React.Component {
      render() {
        const { refComputed: rcu, state, settings } = this.ctx;
        return (
          <div>
            {okeys(state).map(key => {
              const val = state[key];
              if (typeof val === 'object') return '';
              return <h1 key={key} className={key}>{state[key]}</h1>;
            })}
            {okeys(rcu).map(key => <h2 key={key} className={key}>{rcu[key]}</h2>)}
            <button onClick={settings.onBtnClick}>onBtnClick</button>
          </div>
        );
      }
    }
  );

  return { CompFn, CompCls };
}

/**
 * 
 * @param {*} Comp 
 * @param {{key:string, compareValue:any, eq:boolean}} compareItems 
 * @param {{nodeName:string, clickAction: (warp:Wrap)=>void}} options 
 */
export function mountCompThenAssertValue(Comp, compareItems = [], options = {}) {
  let { nodeName = 'h1', clickAction } = options;
  const compWrap = mount(<Comp />);

  clickAction && clickAction(compWrap);

  // console.log(compWrap.debug());
  compareItems.forEach(item => {
    const { key, compareValue, eq, valueType } = item;
    if (item.nodeName) nodeName = item.nodeName;

    const h1NameWrap = compWrap.find(`${nodeName}.${key}`);
    let uiValue = h1NameWrap.text();
    if (valueType === 'number') uiValue = parseFloat(uiValue);

    // console.log(`uiValue ${uiValue} compareValue ${compareValue}`);
    if (eq) {
      expect(uiValue === compareValue).toBeTruthy();
    } else {
      expect(uiValue !== compareValue).toBeTruthy();
    }
  });
};

export function mountCompThenAssertH2Value(Comp, compareItems) {
  mountCompThenAssertValue(Comp, compareItems, { nodeName: 'h2' })
}

export function toNum(str) {
  return parseInt(str, 10);
}

export function getWrapNum(/** @type Wrap */wrap, selector) {
  return toNum(wrap.find(selector).text());
};

export function getWrapText(/** @type Wrap */wrap, selector) {
  return wrap.find(selector).text();
};
