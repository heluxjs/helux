import { Link, useRouteMeta } from 'dumi';
import React, { type FC } from 'react';
import './index.less';

const imgs = [
  'https://tnfe.gtimg.com/image/harzqyxcgz_1651755973579.png',
  'https://tnfe.gtimg.com/image/p40w0k40pt_1651755965504.png',
  'https://tnfe.gtimg.com/image/fxy2nbeh43_1651755969439.png',
  'https://tnfe.gtimg.com/image/bxzj46o32k_1651755962175.png',
  'https://tnfe.gtimg.com/image/ngex07gcez_1651755956158.png',
  'https://tnfe.gtimg.com/image/harzqyxcgz_1651755973579.png',
];
const stWrap: React.CSSProperties = {
  boxShadow: '1px 2px 2px 1px rgba(0, 0, 255, .2)',
  backgroundColor: '#fff',
  borderRadius: '6px',
  padding: '24px 24px',
  boxSizing: 'border-box',
  height: '270px',
};

function getImg(idx: number) {
  return imgs[idx] || imgs[0];
}

const Features: FC = () => {
  const { frontmatter } = useRouteMeta();

  return Boolean(frontmatter.features?.length) ? (
    <div
      className="dumi-default-features"
      // auto render 2 or 3 cols by feature count
      data-cols={
        [3, 2].find((n) => frontmatter.features!.length % n === 0) || 3
      }
    >
      {frontmatter.features!.map(({ title, description, emoji, link }, idx) => {
        let titleWithLink: React.ReactNode;
        if (link) {
          titleWithLink = /^(\w+:)\/\/|^(mailto|tel):/.test(link) ? (
            <a href={link} target="_blank" rel="noreferrer">
              {title}
            </a>
          ) : (
            <Link to={link}>{title}</Link>
          );
        }

        return (
          <div
            key={title}
            className="dumi-default-features-item"
            style={stWrap}
          >
            <div style={{ textAlign: 'center' }}>
              <img
                src={getImg(idx)}
                style={{ width: '88px', height: '88px' }}
              ></img>
            </div>
            <span style={{ color: '#645ab7' }}>
              {title && <h2>{titleWithLink || title}</h2>}
            </span>
            <span style={{ color: 'gray' }}>
              {' '}
              {description && (
                <p dangerouslySetInnerHTML={{ __html: description }} />
              )}
            </span>
          </div>
        );
      })}
    </div>
  ) : null;
};

export default Features;
