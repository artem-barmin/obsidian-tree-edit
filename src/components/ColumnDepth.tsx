import _ from 'lodash';
import { FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { IColumnDepth } from '../interfaces';
import { Card } from './Card';

export const ColumnDepth: FunctionComponent<IColumnDepth> = ({ cards }) => {
  const $divColumn = useRef<HTMLDivElement>(null);
  const isSelectedCard = _.some(cards, { isSelected: true });
  const currentDepth = _.map(cards, 'depth')[0];

  useEffect(() => {
    if ($divColumn.current && isSelectedCard) {
      $divColumn.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [$divColumn, isSelectedCard]);

  return (
    <div className="column" id={`column-depth-${currentDepth}`} ref={$divColumn}>
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
