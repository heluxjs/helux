import { render } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, test } from 'vitest';
import { atom, deriveAtom, useAtom, watch } from '../helux';
import { noop } from '../util';

describe('atom draft sub node ref changed', () => {
  async function testLogic(matchResult: any, pure?: boolean) {
    const [shared, setShared] = atom({ info: { name: 'helux', age: 1 }, desc: 'awesome lib' });

    const changeShared = () => {
      setShared((draft) => {
        draft.info = { ...draft.info };
      });
    };

    const countStat = {
      watch: 0,
      nameResult: 0,
      infoComp: 0,
      nameComp: 0,
      ageComp: 0,
    };
    // ✅ 不被执行
    watch(
      () => {
        countStat.watch += 1;
        console.log('name changed');
      },
      () => [shared.val.info.name],
    );
    // ✅ 不被执行
    const nameResult = deriveAtom(() => {
      countStat.nameResult += 1;
      return `prefix:${shared.val.info.name}`;
    });
    // 💢 触发执行，因为 info 引用已变化
    function Info() {
      countStat.infoComp += 1;
      const [state] = useAtom(shared, { pure });
      noop(state.info);
      return <h1>just read info </h1>;
    }
    // ✅ pure模式不被执行
    function Name() {
      countStat.nameComp += 1;
      const [state] = useAtom(shared, { pure });
      return <h1>{state.info.name}</h1>;
    }
    // ✅ pure模式不被执行
    function Age() {
      countStat.ageComp += 1;
      const [state] = useAtom(shared, { pure });
      return <h1>{state.info.age}</h1>;
    }

    render(<Info />);
    render(<Name />);
    render(<Age />);

    expect(countStat).toMatchObject({
      watch: 0,
      nameResult: 1,
      infoComp: 1,
      nameComp: 1,
      ageComp: 1,
    });

    changeShared();
    // only infoComp been triggered to rerun when pure=true
    expect(countStat).toMatchObject(matchResult);
  }

  test('pure=true, reassign info obj', async () => {
    await testLogic(
      {
        watch: 0,
        nameResult: 1,
        infoComp: 2,
        nameComp: 1,
        ageComp: 1,
      },
      true,
    );
  });

  test('pure=false, reassign info obj', async () => {
    await testLogic(
      {
        watch: 0,
        nameResult: 1,
        infoComp: 2,
        nameComp: 2,
        ageComp: 2,
      },
      false,
    );
  });

  // pure=true by default
  test('pure=undefined, reassign info obj', async () => {
    await testLogic({
      watch: 0,
      nameResult: 1,
      infoComp: 2,
      nameComp: 1,
      ageComp: 1,
    });
  });
});
