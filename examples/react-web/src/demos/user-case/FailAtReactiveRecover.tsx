import { useState } from "react";
import { atom, useAtom } from "helux";
import { dictFactory } from "../logic/util";

// 此问题已解决，新增了 markExpired
const [dict, setState, { reactive, sync }] = atom(dictFactory)

function App() {
  const [count, setCount] = useState(0);
  const [state] = useAtom(dict);
  const change = () => {
    setState((draft) => { draft.a.b.c += 100 });
  };
  const recover = () => {
    setState((draft) => { draft.a.b.c = 9999 });
  };
  const changeReactive = ()=>{
    reactive.a.b.c += 100;
    reactive.a.b.c += 100;
    reactive.a.b.c += 100;
    reactive.a.b.c += 100;
  };

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={change}>
          count is {count}
        </button>
      </div>
      <div className="read-the-docs">
        <button onClick={() => (reactive.a.b.c = 9999)}>
          reactive 恢复 firstName默认值
        </button>
        <button onClick={recover}>setState 恢复 firstName默认值</button>
        <button onClick={changeReactive}>changeReactive</button>
        <div>
          firstName=
          <input
            value={state.a.b.c}
            onChange={sync(to => to.a.b.c)}
          />
        </div>
      </div>
    </>
  );
}

export default App;
