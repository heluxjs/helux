
export function getTestModels() {
  return {
    test: {
      state: {
        name: 'name',
      }
    }
  };
}

export function makeStoreConfig(moduleName, genNormalModule=true) {
  const conf =  {
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
