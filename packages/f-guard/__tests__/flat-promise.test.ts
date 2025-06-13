import { createFlatPromise } from '../src';

describe('createFlatPromise', () => {
  test('createFlatPromise should be function', () => {
    expect(createFlatPromise).toBeInstanceOf(Function);
  });

  test('2 fns wait flat promise result', async () => {
    const prom = createFlatPromise();
    let callCount = 0;
    let resultStr = '';

    const waitProm = async () => {
      const result = await prom;
      callCount += 1;
      resultStr += result;
    };

    waitProm();
    waitProm();
    prom.resolve('1'); // 让两个等待结果的 waitProm 函数继续执行

    await new Promise(r => setTimeout(r, 1000));
    // 开始检查结果
    expect(callCount).toBe(2);
    expect(resultStr).toBe('11');
  });

  test('2 fns catch flatPromise error', async () => {
    const prom = createFlatPromise();
    let callCount = 0;
    let errCount = 0;
    let resultStr = '';

    const waitProm = async () => {
      try {
        callCount += 1;
        await prom;
      } catch (err: any) {
        errCount += 1;
        resultStr += err.message;
      }
    };

    waitProm();
    waitProm();
    prom.reject(new Error('err_')); // 让两个等待结果的 waitProm 函数都捕捉错误

    await new Promise(r => setTimeout(r, 1000));
    // 开始检查结果
    expect(callCount).toBe(2);
    expect(errCount).toBe(2);
    expect(resultStr).toBe('err_err_');
  });
});
