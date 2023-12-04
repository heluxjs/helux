import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { atom, useAtom } from '../helux';
import { dictFictory, getDepKey, noop } from '../util';

interface IOptionsBase {
  arrIndexDep?: boolean;
  arrDep?: boolean;
}
interface IOptions extends IOptionsBase {
  getMatchObj: (rootValKey: string) => any;
}

export function makeTest(options: { label: string; atom: typeof atom; useAtom: typeof useAtom }) {
  const { label, atom, useAtom } = options;

  async function testNotReadList(options: IOptionsBase) {
    const { arrIndexDep, arrDep } = options;
    const [dictAtom, setDictAtom, { rootValKey }] = atom(dictFictory);
    const { result } = renderHook(() => {
      const [state, , info] = useAtom(dictAtom, { arrIndexDep, arrDep });
      return info.getDeps();
    });

    expect(result.current).toMatchObject([rootValKey]);
  }

  /** arrIndexDep=true by default */
  async function testReadList(options: IOptions) {
    const { arrIndexDep, arrDep, getMatchObj } = options;
    const [dictAtom, setDictAtom, { rootValKey }] = atom(dictFictory);
    const { result } = renderHook(() => {
      const [state, , info] = useAtom(dictAtom, { arrIndexDep, arrDep });
      noop(state.extra.list);
      noop(state.extra.list[0]);
      noop(state.extra.list[1]);
      return info.getDeps();
    });

    expect(result.current).toMatchObject(getMatchObj(rootValKey));
  }

  async function testReadMap(options: IOptions) {
    const { arrIndexDep, arrDep, getMatchObj } = options;
    const [dictAtom, setDictAtom, { rootValKey }] = atom(dictFictory);
    const { result } = renderHook(() => {
      const [state, , info] = useAtom(dictAtom, { arrIndexDep, arrDep });
      noop(state.extra.map);
      noop(state.extra.map.get(1)?.id);
      noop(state.extra.map.get(2)?.name);
      return info.getDeps();
    });

    expect(result.current).toMatchObject(getMapDep(rootValKey));
  }

  const getArrDepAndIndexDep = (rootValKey) => [
    getDepKey(rootValKey, 'extra.list'),
    getDepKey(rootValKey, 'extra.list.0'),
    getDepKey(rootValKey, 'extra.list.1'),
  ];

  const getArrDep = (rootValKey) => [getDepKey(rootValKey, 'extra.list')];

  const getIndexDep = (rootValKey) => [getDepKey(rootValKey, 'extra.list.0'), getDepKey(rootValKey, 'extra.list.1')];

  const getMapDep = (rootValKey) => [getDepKey(rootValKey, 'extra.map.1.id'), getDepKey(rootValKey, 'extra.map.2.name')];

  describe(`${label} arrDep=undefined`, () => {
    test('arrIndexDep=undefined, not read list', async () => {
      await testNotReadList({ arrDep: undefined, arrIndexDep: undefined });
    });

    test('arrIndexDep=true, not read list', async () => {
      await testNotReadList({ arrDep: undefined, arrIndexDep: true });
    });

    test('arrIndexDep=false, not read list', async () => {
      await testNotReadList({ arrDep: undefined, arrIndexDep: false });
    });

    test('arrIndexDep=undefined, read list', async () => {
      await testReadList({
        arrDep: undefined,
        arrIndexDep: undefined,
        getMatchObj: getArrDepAndIndexDep,
      });
    });

    test('arrIndexDep=true, read list', async () => {
      await testReadList({
        arrDep: undefined,
        arrIndexDep: true,
        getMatchObj: getArrDepAndIndexDep,
      });
    });

    test('arrIndexDep=false, read list', async () => {
      await testReadList({
        arrDep: undefined,
        arrIndexDep: false,
        getMatchObj: getArrDep,
      });
    });
  });

  describe(`${label} arrDep=true`, () => {
    test('arrIndexDep=undefined, not read list', async () => {
      await testNotReadList({ arrDep: true, arrIndexDep: undefined });
    });

    test('arrIndexDep=true, not read list', async () => {
      await testNotReadList({ arrDep: true, arrIndexDep: true });
    });

    test('arrIndexDep=false, not read list', async () => {
      await testNotReadList({ arrDep: true, arrIndexDep: false });
    });

    test('arrIndexDep=undefined, read list', async () => {
      await testReadList({
        arrDep: true,
        arrIndexDep: undefined,
        getMatchObj: getArrDepAndIndexDep,
      });
    });

    test('arrIndexDep=true, read list', async () => {
      await testReadList({
        arrDep: true,
        arrIndexDep: true,
        getMatchObj: getArrDepAndIndexDep,
      });
    });

    test('arrIndexDep=true, read list', async () => {
      await testReadList({
        arrDep: true,
        arrIndexDep: false,
        getMatchObj: getArrDep,
      });
    });
  });

  describe(`${label} arrDep=false`, () => {
    test('arrIndexDep=true, read list', async () => {
      await testReadList({
        arrDep: false,
        arrIndexDep: true,
        getMatchObj: getIndexDep,
      });
    });

    test('arrIndexDep=false, read list', async () => {
      await testReadList({
        arrDep: false,
        arrIndexDep: false,
        getMatchObj: getIndexDep,
      });
    });

    test('arrIndexDep=undefined, read list', async () => {
      await testReadList({
        arrDep: false,
        arrIndexDep: undefined,
        getMatchObj: getIndexDep,
      });
    });

    test('arrIndexDep=undefined, read map', async () => {
      await testReadMap({
        arrDep: true,
        arrIndexDep: true,
        getMatchObj: getMapDep,
      });
    });
  });
}
