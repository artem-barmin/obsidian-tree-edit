import { h, FunctionComponent } from 'preact';
import { nanoid } from 'nanoid';

import { ICardView_Props } from '../interfaces';
import { ContentHTML } from './ContentHTML';
import { HeaderHTML } from './HeaderHTML';

export const CardView: FunctionComponent<ICardView_Props> = ({ header, contents }) => {
  return (
    <div className="view">
      <HeaderHTML headerHTML={header} />

      {contents.map((content) => {
        return <ContentHTML contentHTML={content} key={nanoid()} />;
      })}
    </div>
  );
};
