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
      }
    }
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
        }
      }),
      reducer: {
        changeName(name, moduleState, ctx) {
          return { name };
        }
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
    const { refComputed: rcu, state } = useConcent({ module, setup });
    return (
      <div>
        {okeys(state).map(key => <h1 key={key} className={key}>{state[key]}</h1>)}
        {okeys(rcu).map(key => <h2 key={key} className={key}>{rcu[key]}</h2>)}
      </div>
    );
  };
  const CompCls = register({ module, setup })(
    class extends React.Component {
      render() {
        const { refComputed: rcu, state } = this.ctx;
        return (
          <div>
            {okeys(state).map(key => <h1 key={key} className={key}>{state[key]}</h1>)}
            {okeys(rcu).map(key => <h2 key={key} className={key}>{rcu[key]}</h2>)}
          </div>
        );
      }
    }
  );

  return { CompFn, CompCls };
}


export function mountCompThenTestValue(Comp, compareItems, options = {}) {
  let { nodeName = 'h1', clickAction } = options;
  const compWrap = mount(<Comp />);

  if (clickAction) {
    // https://reactjs.org/docs/test-utils.html#act
    act(() => {
      clickAction(compWrap);
    });
  }

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

export function mountCompThenTestH2Value(Comp, compareItems) {
  mountCompThenTestValue(Comp, compareItems, { nodeName: 'h2' })
}
