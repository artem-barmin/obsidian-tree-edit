import { h, FunctionComponent } from 'preact';

import { Card } from './Card';
import { IListColumnsDepths_Props } from '../interfaces';

export const ListColumnsDepths: FunctionComponent<IListColumnsDepths_Props> = ({ cards, showAllChain }) => {
  return (
    <div className="column">
      <div className="empty-place"></div>
      <div className="group">
        {cards.map((card) => {
          return <Card key={card.id} showAllChain={showAllChain} card={card} />;
        })}
      </div>
      <div className="empty-place"></div>
    </div>
  );
};
