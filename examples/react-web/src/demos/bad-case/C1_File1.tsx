import { atom } from 'helux';
import React from 'react';
import { MarkUpdate, Entry } from '../comps';
import { dictFactory } from "../logic/util";

// TODO FIXME 这里为 1 触发死循环误判（ 和 Api_mutate 文件冲突 ）
const [numAtom, setNum, numCtx] = atom(1);
// const [numAtom, setNum, numCtx] = atom(1);

function SharedAtom() {
  const [num] = numCtx.useState();
  return (
    <MarkUpdate>
      primitive syncer <input value={num} onChange={numCtx.syncer} />
    </MarkUpdate>
  );
}

const Demo = () => (
  <Entry fns={[]}>
    <SharedAtom />
  </Entry>
);

export default Demo;
