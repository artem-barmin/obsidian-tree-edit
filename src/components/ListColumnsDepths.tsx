import { h, FunctionComponent } from 'preact';

import { Card } from './Card';
import { IListColumnsDepths_Props } from '../interfaces';

export const ListColumnsDepths: FunctionComponent<IListColumnsDepths_Props> = ({ cards, showAllChain, cardAction }) => {
  return (
    <div className="column">
      <div className="empty-place"></div>
      <div className="group">
        {cards.map((card) => {
          return <Card key={card.id} card={card} showAllChain={showAllChain} cardAction={cardAction} />;
        })}
      </div>
      <div className="empty-place"></div>
    </div>
  );
};
