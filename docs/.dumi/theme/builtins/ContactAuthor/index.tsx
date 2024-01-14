import React, { type FC } from 'react';

const ContactAuthor: FC = () => (
  <div style={{ width: '100%' }}>
    <div style={{ width: '48%', display: 'inline-block' }}>
      <h4>📦 了解更多</h4>
      <p>
        欢迎入群了解更多，由于微信讨论群号 200 人已满，需加作者微信号或 qq 群号，再邀请你如helux & hel讨论群（加号时记得备注 helux 或 hel）
      </p>
      <img src="https://tnfe.gtimg.com/image/7fz74bhk84_1705216873301.png" style={{ width: '100%' }} />
    </div>
    <div style={{ width: '4%', display: 'inline-block' }}></div>
    <div style={{ width: '48%', display: 'inline-block' }}>
      <h4>❤️‍🔥 赞赏</h4>
      <p>
        小小鼓励，给予我们更多力量坚持做出更好的开源项目
      </p>
      <img src="https://tnfe.gtimg.com/image/5a2u6arzpo_1705217036205.png" style={{ width: '100%' }} />
    </div>
  </div>
);

export default React.memo(ContactAuthor);
