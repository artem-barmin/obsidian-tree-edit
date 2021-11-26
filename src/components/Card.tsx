import { h, FunctionComponent } from 'preact';
import { useRef } from 'preact/hooks';
import { useDispatch } from 'react-redux';

import { ICard_Props } from '../interfaces';
import { CardView } from './CardView';
import { MemoCardCodeMirror } from './CardCodeMirror';
import { CardActions } from './CardActions';
import { clickCardView } from 'src/redux/actions';

export const Card: FunctionComponent<ICard_Props> = ({ card }) => {
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

  const dispatch = useDispatch();
  const $divCard = useRef<HTMLDivElement>(null);
  const classes: string[] = ['card'];

  if (isSelected) classes.push('selected-item');
  else if (isChild) classes.push('chain-down');
  else if (isParent || isNeighbor) classes.push('chain-up');
  else classes.push('no-active');

  if (scrollElement && $divCard.current) {
    $divCard.current.scrollIntoView({ block: 'center' });
  }

  const onClick = (e: MouseEvent) => {
    const classesElem = (e.target as HTMLElement).className.split(' ');

    if (!classesElem.includes('card-btn')) {
      dispatch(clickCardView({ id, depth, children, parents, neighbors, scrollChildren }));
    }
  };

  return (
    <div className={classes.join(' ')} onClick={onClick} ref={$divCard}>
      <CardActions isSelected={isSelected} isEdit={isEdit} />

      {isEdit && isSelected ? (
        <MemoCardCodeMirror markdownContent={markdownContent} depth={depth} />
      ) : (
        <CardView header={headerHTML} contents={contentsHTML} />
      )}
    </div>
  );
};
