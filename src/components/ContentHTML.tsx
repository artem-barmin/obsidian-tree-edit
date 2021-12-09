import { FunctionComponent } from 'preact';
import { VirtualDom } from '../redux/interfaces';

export const ContentHTML: FunctionComponent<{ contentHTML: VirtualDom }> = ({ contentHTML }) => {
  return <div style={{ textAlign: 'start' }}>{contentHTML}</div>;
};
