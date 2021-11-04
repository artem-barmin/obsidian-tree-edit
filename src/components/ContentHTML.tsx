import { h, FunctionComponent } from 'preact';
import { VirtualDom } from '../scripts/scriptInterfaces';

export const ContentHTML: FunctionComponent<{ contentHTML: VirtualDom; index: number }> = ({ contentHTML, index }) => {
  return (
    <div key={index} style={{ textAlign: 'start' }}>
      {contentHTML}
    </div>
  );
};
