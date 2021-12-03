import { FunctionComponent } from 'preact';
import { IListColumnsDepths_Props } from '../interfaces';
import { Card } from './Card';

export const ListColumnsDepths: FunctionComponent<IListColumnsDepths_Props> = ({ cards }) => {
  return (
    <div className="column">
      <div className="empty-place"></div>
      <div className="group">
        {cards.map((card) => {
          return <Card key={card.id} card={card} />;
        })}
      </div>
      <div className="empty-place"></div>
    </div>
  );
};
