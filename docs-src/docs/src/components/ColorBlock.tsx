/**
 * 每次渲染时变化颜色
 */

import React from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import * as color from 'color';
import { ReactFC } from './types';

// const Colors:string[]=['#4bc703','#eb03c4','#1000eb',"#99170e991",'red','#778888999']
function getRandomColor() {
  const c = `${Math.floor(Math.random() * 16777215).toString(16)}`;
  return `#${c.padStart(6, '0')}`;
}
const ColorBlock: ReactFC<
  React.PropsWithChildren<{ value?: any; name?: string; inline?: boolean }>
> = ({ name, value, inline, ...props }) => {
  const backgroundColor = getRandomColor();
  let textColor = 'block';
  if (color.rgb(backgroundColor).isDark()) {
    textColor = 'white';
  } else {
    textColor = 'block';
  }

  return (
    <div
      {...props}
      style={{
        backgroundColor,
        padding: '4px',
        color: textColor,
        display: inline ? 'inline' : 'block',
        ...props.style,
      }}
    >
      {name ? <span style={{ padding: '2px' }}>{name}=</span> : ''}
      <span style={{ padding: '2px' }}>{String(value)}</span>
    </div>
  );
};

export default ColorBlock;
