export function delay(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function makeStoreConfig(moduleName) {
  return {
    [moduleName]: {
      state: {
        name: moduleName,
        age: 22,
        info:{
          addr:'bj',
          email:'x@concent.com',
        }
      },
      reducer: {
        changeName(name, moduleState, ctx) {
          return { name };
        }
      },
      computed: {
        name(name) {
          return `name_${name}`
        }
      }
    }
  }
}

export function toError(err) {
  if (typeof err === 'string') return new Error(err);
  else return err;
}

export function extractMessage(err) {
  if (typeof err === 'string') return err;
  else return err.message;
}