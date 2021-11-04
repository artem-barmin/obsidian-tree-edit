import { h, FunctionComponent } from 'preact';
import { VirtualDom } from '../scripts/scriptInterfaces';

export const HeaderHTML: FunctionComponent<{ headerHTML: VirtualDom }> = ({ headerHTML }) => {
  return <div style={{ fontSize: '17px', fontStyle: 'italic', textAlign: 'start' }}>{headerHTML}</div>;
};
