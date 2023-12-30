import { type FC } from 'react';
import './index.less';

const Footer: FC = () => {
  return (
    <>
      <div className="dumi-default-footer">
        Copyright © {new Date().getFullYear()} Tencent PCG TNTWeb.
        <div>
          Author:
          <a
            style={{ paddingLeft: '6px' }}
            href="https://github.com/fantasticsoul"
            target="__blink"
          >
            fantasticsoul
          </a>
          , Welcome to follow my open source project:
          <a
            style={{ paddingLeft: '6px' }}
            href="https://github.com/heluxjs/helux"
            target="__blink"
          >
            helux
          </a>
          <a
            style={{ paddingLeft: '6px' }}
            href="https://github.com/Tencent/hel"
            target="__blink"
          >
            hel-micro
          </a>
          <a
            style={{ paddingLeft: '6px' }}
            href="https://github.com/tnfe/limu"
            target="__blink"
          >
            limu
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;
