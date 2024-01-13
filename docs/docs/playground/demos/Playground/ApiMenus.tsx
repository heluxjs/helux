// @ts-nocheck
import React from 'react';
import './index.less';

const c = '#e8ae56';

export default React.memo(({ onClick, name }: any) => {
  const st = (toMatch: string) => ({ color: name === toMatch ? c : '' });
  return (
    <div style={{ width: '120px' }} onClick={e => {
      const name = e.target.dataset.name;
      if (name) {
        onClick?.(name);
      }
    }}>
      <div className="menuWrap" data-name="atom" style={st('atom')}>atom</div>
      <div className="menuWrap" data-name="derive" style={st('derive')}>derive</div>
      <div className="menuWrap" data-name="watch" style={st('watch')}>watch</div>
      <div className="menuWrap" data-name="useAtom" style={st('useAtom')}>useAtom</div>
      <div className="menuWrap" data-name="useDerived" style={st('useDerived')}>useDerived</div>
    </div>
  );
});
