import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { atom, useAtom } from '../helux';
import { dictFictory, DictState, getDepKey, noop } from '../util';

interface IOptions {
  deps?: (state: DictState) => any[];
  getMatchObj: (rootValKey: string) => any;
  /**
   * 是否采用解构数组的方式读取数组子元素
   * true: const [item0, item1] = state.extra.list;
   * false: const { list } = state.extra.list; noop(list[0], list[1])
   */
  readArr?: (state: DictState) => void;
}

const getRootValDep = (rootValKey) => [rootValKey];

const getArrAndIndexDep = (rootValKey) => [
  getDepKey(rootValKey, 'extra.list'),
  getDepKey(rootValKey, 'extra.list.0'),
  getDepKey(rootValKey, 'extra.list.1'),
];

const getArrDep = (rootValKey) => [getDepKey(rootValKey, 'extra.list')];

const getAgeNameDep = (rootValKey) => [getDepKey(rootValKey, 'info.age'), getDepKey(rootValKey, 'info.name')];

const getDescDep = (rootValKey) => [getDepKey(rootValKey, 'desc')];

export function makeTest(options: { label: string; atom: typeof atom; useAtom: typeof useAtom }) {
  const { label, atom, useAtom } = options;

  async function testNotRead(options: IOptions) {
    const { getMatchObj, deps } = options;
    const [dictAtom, setDictAtom, { rootValKey }] = atom(dictFictory);
    const { result } = renderHook(() => {
      const [state, , info] = useAtom(dictAtom, { deps });
      return info.getDeps();
    });

    expect(result.current).toMatchObject(getMatchObj(rootValKey));
  }

  async function testReadList(options: IOptions) {
    const { getMatchObj, deps } = options;
    const [dictAtom, setDictAtom, { rootValKey }] = atom(dictFictory);
    const { result } = renderHook(() => {
      const [state, , info] = useAtom(dictAtom, { deps });
      noop(state.extra.list);
      return info.getDeps();
    });

    expect(result.current).toMatchObject(options.getMatchObj(rootValKey));
  }

  async function testReadListItem(options: IOptions) {
    const { getMatchObj, deps, readArr = noop } = options;
    const [dictAtom, setDictAtom, { rootValKey }] = atom(dictFictory);
    const { result } = renderHook(() => {
      const [state, , info] = useAtom(dictAtom, { deps });
      readArr(state);
      return info.getDeps();
    });

    expect(result.current).toMatchObject(options.getMatchObj(rootValKey));
  }

  async function testReadDict(options: IOptions) {
    const { getMatchObj, deps } = options;
    const [dictAtom, setDictAtom, { rootValKey }] = atom(dictFictory);
    const { result } = renderHook(() => {
      const [state, , info] = useAtom(dictAtom, { deps });
      const { age, name } = state.info;
      noop([age, name]);
      return info.getDeps();
    });
  }

  async function testReadDesc(options: IOptions) {
    const { getMatchObj, deps } = options;
    const [dictAtom, setDictAtom, { rootValKey }] = atom(dictFictory);
    const { result } = renderHook(() => {
      const [state, , info] = useAtom(dictAtom, { deps });
      noop(state.desc);
      return info.getDeps();
    });

    expect(result.current).toMatchObject(getMatchObj(rootValKey));
  }

  describe(`${label} deps=undefined`, () => {
    test('not read', async () => {
      await testNotRead({
        getMatchObj: getRootValDep,
      });
    });

    test('read list', async () => {
      await testReadList({
        getMatchObj: getArrDep,
      });
    });

    // ATTENTION: 解构方式不会触发下标依赖收集，故此处的比较使用的是 getArrDep
    test('read list item by deconstruct', async () => {
      await testReadListItem({
        getMatchObj: getArrDep,
        readArr: (state) => {
          const [item0, item1] = state.extra.list;
          noop(item0, item1);
        },
      });
    });

    test('read list item by index', async () => {
      await testReadListItem({
        getMatchObj: getArrAndIndexDep,
        readArr: (state) => {
          const { list } = state.extra;
          noop(list[0], list[1]);
        },
      });
    });

    test('read list item by forEach', async () => {
      await testReadListItem({
        getMatchObj: getArrAndIndexDep,
        readArr: (state) => {
          state.extra.list.forEach(noop);
        },
      });
    });

    test('read dict', async () => {
      await testReadDict({
        getMatchObj: getAgeNameDep,
      });
    });
  });

  describe(`${label} deps: (state)=>[state.desc]`, () => {
    // just put state.desc to deps, final deps is ['desc', '{rootValKey}']
    test('not read', async () => {
      await testNotRead({
        getMatchObj: (rootValKey) => getRootValDep(rootValKey).concat(getDescDep(rootValKey)),
        deps: (state) => [state.desc],
      });
    });

    // read state.desc and put state.desc to deps, final deps is ['desc']
    test('read desc', async () => {
      await testReadDesc({
        getMatchObj: getDescDep,
        deps: (state) => [state.desc],
      });
    });

    test('read list', async () => {
      await testReadList({
        getMatchObj: (rootValKey) => getArrDep(rootValKey).concat(getDescDep(rootValKey)),
        deps: (state) => [state.desc],
      });
    });

    // ATTENTION: 解构方式不会触发下标依赖收集，故此处的比较使用的是 getArrDep
    test('read list item by deconstruct', async () => {
      await testReadListItem({
        getMatchObj: (rootValKey) => getArrDep(rootValKey).concat(getDescDep(rootValKey)),
        deps: (state) => [state.desc],
        readArr: (state) => {
          const [item0, item1] = state.extra.list;
          noop(item0, item1);
        },
      });
    });

    test('read list item by index', async () => {
      await testReadListItem({
        getMatchObj: (rootValKey) => getArrAndIndexDep(rootValKey).concat(getDescDep(rootValKey)),
        deps: (state) => [state.desc],
        readArr: (state) => {
          const { list } = state.extra;
          noop(list[0], list[1]);
        },
      });
    });

    test('read list item by forEach', async () => {
      await testReadListItem({
        getMatchObj: (rootValKey) => getArrAndIndexDep(rootValKey).concat(getDescDep(rootValKey)),
        deps: (state) => [state.desc],
        readArr: (state) => {
          state.extra.list.forEach(noop);
        },
      });
    });

    test('read dict', async () => {
      await testReadDict({
        getMatchObj: (rootValKey) => getAgeNameDep(rootValKey).concat(getDescDep(rootValKey)),
        deps: (state) => [state.desc],
      });
    });
  });
}
