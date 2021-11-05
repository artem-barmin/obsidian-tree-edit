import { h, FunctionComponent } from 'preact';
import { useRef } from 'preact/hooks';

import { ICard_Props } from '../interfaces';
import { ContentHTML } from './ContentHTML';
import { HeaderHTML } from './HeaderHTML';

export const Card: FunctionComponent<ICard_Props> = ({ card, showAllChildren }) => {
  const {
    id,
    depth,
    headerHTML,
    contentsHTML,
    children,
    scrollChildren,
    parents,
    neighbors,
    isParent,
    isChild,
    isNeighbor,
    scrollElement
  } = card;

  const $divCard = useRef<HTMLDivElement>(null);
  const classes: string[] = ['card'];

  if (isChild) classes.push('chain-down ');
  else if (isParent || isNeighbor) classes.push('chain-up');
  else classes.push('no-active');

  if (scrollElement && $divCard.current) {
    $divCard.current.scrollIntoView({ block: 'center' });
  }

  return (
    <div
      className={classes.join(' ')}
      key={id}
      onClick={() => showAllChildren(children, scrollChildren, parents, neighbors, id, depth)}
      ref={$divCard}
    >
      <HeaderHTML headerHTML={headerHTML} />

      {contentsHTML.map((content, index: number) => {
        return <ContentHTML contentHTML={content} index={index} />;
      })}
    </div>
  );
};
