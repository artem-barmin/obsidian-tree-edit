import { h, FunctionComponent } from 'preact';
import { VirtualDom } from '../scripts/scriptInterfaces';

export const ContentHTML: FunctionComponent<{ contentHTML: VirtualDom }> = ({ contentHTML }) => {
  return <div style={{ textAlign: 'start' }}>{contentHTML}</div>;
};
