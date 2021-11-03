import { h, FunctionComponent } from 'preact';

import { Card } from './Card';
import { IListColumnsDepths_Props } from '../interfaces';

export const ListColumnsDepths: FunctionComponent<IListColumnsDepths_Props> = ({ cards, showAllChildren }) => {
  return (
    <div className="column">
      <div className="empty-place"></div>
      <div className="group">
        {cards.map((card) => {
          return <Card showAllChildren={showAllChildren} card={card} />;
        })}
      </div>
      <div className="empty-place"></div>
    </div>
  );
};
