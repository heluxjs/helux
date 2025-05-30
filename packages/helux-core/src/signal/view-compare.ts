import { limuUtils } from 'limu';

const { shallowCompare } = limuUtils;

function getBlockViewProps(props: any) {
  const { data, comp, enableStatus, useStatusList, ...viewProps } = props;
  return viewProps;
}

function getSignalViewProps(props: any) {
  const { input, format, enableStatus, useStatusList, ...viewProps } = props;
  return viewProps;
}

export function compareBlockViewProps(prevProps: any, props: any) {
  const prevViewProps = getBlockViewProps(prevProps);
  const viewProps = getBlockViewProps(props);
  return shallowCompare(prevViewProps, viewProps);
}

export function compareSignalViewProps(prevProps: any, props: any) {
  const prevViewProps = getSignalViewProps(prevProps);
  const viewProps = getSignalViewProps(props);
  return shallowCompare(prevViewProps, viewProps);
}

export function compareV2Props(prevProps: any, props: any) {
  return shallowCompare(prevProps.viewProps, props.viewProps);
}
