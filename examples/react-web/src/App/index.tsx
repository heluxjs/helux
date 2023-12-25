import React from 'react';
import './App.css';
import * as demos from '../demos';

const stLabel: React.CSSProperties = { padding: '0 12px' };
const compKeys = Object.keys(demos).filter(key => key !== 'INITIAL_KEY');
let initialKey = demos.INITIAL_KEY;
if (!compKeys.includes(initialKey)) {
  initialKey = compKeys[0];
}

function renderView(key: string) {
  // @ts-ignore
  const Comp = demos[key];
  return <Comp />;
}

function App() {
  const [viewKey, setView] = React.useState(initialKey);
  const changeView: React.ChangeEventHandler<HTMLInputElement> = (e) => setView(e.target.value);
  const viewKeyRef = React.useRef(viewKey);
  viewKeyRef.current = viewKey;

  // React.useEffect(() => {
  //   setInterval(() => {
  //     const idx = compKeys.indexOf(viewKeyRef.current);
  //     const nextIdx = idx === compKeys.length - 1 ? 0 : idx + 1;
  //     setView(compKeys[nextIdx]);
  //     console.log(`change to ${compKeys[nextIdx]}`);
  //   }, 30);
  // }, [viewKeyRef]);

  return (
    <div style={{ padding: '12px' }}>
      <div style={{ padding: '12px' }}>
        {compKeys.map(key => (
          <label key={key} style={stLabel}>
            <input name="demo" type="radio" checked={key === viewKey} value={key} onChange={changeView} />
            {key}
          </label>
        ))}
      </div>
      {renderView(viewKey)}
    </div>
  );
}


export default App;
