import './index.less';

function Feature(props: any) {
  const { title, description, imgSrc } = props.item;
  return (
    <div className="dumi-default-features-item hx-feature-item">
      <div style={{ textAlign: 'center' }}>
        <img src={imgSrc} style={{ width: '88px', height: '88px' }} />
      </div>
      <span style={{ color: 'rgb(100, 90, 183)' }} >
        <h2>{title}</h2>
      </span>
      <span style={{ color: 'gray' }}>
        <p>{description}</p>
      </span>
    </div>
  )
}

export function Features(props: any) {
  return (
    <div className="dumi-default-features" data-cols="3" style={{ padding: 0 }}>
      {props.featureList.map((v: any) => <Feature key={v.title} item={v} />)}
    </div>
  );
}
