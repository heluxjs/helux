import React, { type FC, type ReactNode } from 'react';
import './index.less';

const HeroTitle: FC<{ children: ReactNode }> = (props) => (
  <div>
    <div className="blinkTitle">React developing. <span style={{ fontWeight: 800 }}>Redefined.</span></div>
    <h1 className="dumi-default-hero-title">
      <img src="https://tnfe.gtimg.com/image/dlykfuw8ai_1703851692543.png" style={{ paddingRight: '30px' }} />
      <span>{props.children}</span>
    </h1>
  </div>
);

export default HeroTitle;
