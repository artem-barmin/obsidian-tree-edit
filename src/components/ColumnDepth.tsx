import _ from 'lodash';
import { FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { IListColumnsDepths_Props } from '../interfaces';
import { Card } from './Card';

export const ListColumnsDepths: FunctionComponent<IListColumnsDepths_Props> = ({ cards }) => {
  const $divColumn = useRef<HTMLDivElement>(null);
  const isSelectedCard = _.some(cards, { isSelected: true });
  const columnDepth = _.map(cards, 'depth')[0];

  useEffect(() => {
    if ($divColumn && isSelectedCard) {
      $divColumn.current!.scrollIntoView({ behavior: 'smooth' });
    }
  }, [$divColumn, isSelectedCard]);

  return (
    <div className="column" ref={$divColumn} id={`depth-${columnDepth}`}>
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
