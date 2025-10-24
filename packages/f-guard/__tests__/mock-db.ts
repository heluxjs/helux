import { ConcurrencyGuard, createFlatPromise } from '../src';

type CallInitType = 'callInitWithBindThis' | 'callInitWithArrowFn' | 'callInitWithAnonymousArrowFn' | 'callInitDirectly';

/** 模拟一个 DB 原始连接类，提供的接口无任何高并发保护机制 */
class DB {
  private evMap: any = {};
  constructor() {
    setTimeout(() => {
      this.evMap.connect?.(this);
    }, 200);
  }
  public on(evName: string, cb) {
    this.evMap[evName] = cb;
  }
  public get(key: string) {
    return `${key}:result`;
  }
}

/** 模拟一个 DB 连接封装类（ 基于原始连接类二次封装 ），使用 guard 提供高并发保护 */
export class DBWrap {
  private guard = new ConcurrencyGuard();
  private ins: DB | null = null;
  private callInitType: CallInitType = 'callInitWithBindThis';

  constructor(callInitType?: CallInitType) {
    this.callInitType = callInitType || 'callInitWithBindThis';
  }

  public async get(key: string) {
    const ins = await this.getOrCreateIns();
    const result = ins.get(key);
    return result;
  }

  private async initIns() {
    const prom = createFlatPromise();
    const db = new DB();
    db.on('connect', (ins) => prom.resolve(ins));
    const ins = await prom;
    return ins;
  }

  private async getOrCreateIns() {
    if (this.ins) {
      return this.ins;
    }
    const key = 'initAndCache';

    if (this.callInitType === 'callInitWithArrowFn') {
      const ins = await this.guard.call(key, this.initAndCacheWithArrowFn);
      return ins;
    }

    if (this.callInitType === 'callInitWithBindThis') {
      const ins = await this.guard.call(key, this.initAndCache.bind(this));
      return ins;
    }

    if (this.callInitType === 'callInitWithAnonymousArrowFn') {
      const ins = await this.guard.call(key, async () => {
        const ins = await this.initIns(); // 此处 this 并不会丢失
        this.ins = ins;
        return ins as DB;
      });
      return ins;
    }

    const ins = await this.guard.call(key, this.initAndCache);
    return ins;
  }

  //  成员函数写为非箭头函数形式时， guard.call 调用的函数需要有 bind(this) 行为，否则内部 this 指向 null
  private async initAndCache() {
    const ins = await this.initIns();
    this.ins = ins;
    return ins as DB;
  }

  // 成员函数写为箭头函数形式时，guard.call 可直接调用，内部的 this 指向正确
  private initAndCacheWithArrowFn = async () => {
    const ins = await this.initIns(); // 此处 this 并不会丢失
    this.ins = ins;
    return ins as DB;
  };
}
