import { h, FunctionComponent } from 'preact';
import { useRef, useState } from 'preact/hooks';

import { ICard_Props } from '../interfaces';
import { CardView } from './CardView';
import { CardCodeMirror } from './CardCodeMirror';
import { CardActions } from './CardActions';

export const Card: FunctionComponent<ICard_Props> = ({ card, showAllChain, cardAction }) => {
  const {
    id,
    depth,
    headerHTML,
    contentsHTML,
    markdownContent,
    children,
    scrollChildren,
    parents,
    neighbors,
    isSelected,
    isEdit,
    isParent,
    isChild,
    isNeighbor,
    scrollElement,
  } = card;

  const $divCard = useRef<HTMLDivElement>(null);
  const classes: string[] = ['card'];

  if (isSelected) classes.push('selected-item');
  else if (isChild) classes.push('chain-down');
  else if (isParent || isNeighbor) classes.push('chain-up');
  else classes.push('no-active');

  if (scrollElement && $divCard.current) {
    $divCard.current.scrollIntoView({ block: 'center' });
  }

  return (
    <div
      className={classes.join(' ')}
      onClick={() => showAllChain({ id, depth, children, parents, neighbors, scrollChildren })}
      ref={$divCard}
    >
      <CardActions isSelected={isSelected} isEdit={isEdit} cardAction={cardAction} />

      {isEdit && isSelected ? (
        <CardCodeMirror markdownContent={markdownContent} depth={depth} />
      ) : (
        <CardView header={headerHTML} contents={contentsHTML} />
      )}
    </div>
  );
};
