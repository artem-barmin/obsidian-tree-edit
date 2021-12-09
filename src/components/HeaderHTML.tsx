import { FunctionComponent } from 'preact';
import { VirtualDom } from '../redux/interfaces';

export const HeaderHTML: FunctionComponent<{ headerHTML: VirtualDom }> = ({ headerHTML }) => {
  return <div style={{ fontSize: '17px', fontStyle: 'italic', textAlign: 'start' }}>{headerHTML}</div>;
};
