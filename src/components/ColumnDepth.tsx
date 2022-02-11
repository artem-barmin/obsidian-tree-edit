import _ from 'lodash';
import { FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { IColumnDepth_Props } from '../interfaces';
import { Card } from './Card';

export const ColumnDepth: FunctionComponent<IColumnDepth_Props> = ({ cards }) => {
  const $divColumn = useRef<HTMLDivElement>(null);
  const isSelectedCard = _.some(cards, { isSelected: true });

  useEffect(() => {
    if ($divColumn.current && isSelectedCard) {
      $divColumn.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isSelectedCard]);

  return (
    <div className="column" ref={$divColumn}>
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
