import { FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useDispatch } from 'react-redux';
import { ICard_Props } from '../interfaces';
import { RootReducerActions } from '../redux/actions';
import { CardButtons } from './CardButtons';
import { MemoCardCodeMirror } from './CardCodeMirror';
import { CardView } from './CardView';

const { clickCardView } = RootReducerActions;

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
  const [editorValue, setEditorValue] = useState<string>('');

  const classes = ['card'];

  if (isSelected) classes.push('selected-item');
  else if (isChild) classes.push('chain-down');
  else if (isParent || isNeighbor) classes.push('chain-up');
  else classes.push('no-active');

  const onClick = (e: MouseEvent) => {
    const classesElem = (e.target as HTMLElement).className.split(' ');

    if (!classesElem.includes('card-btn')) {
      dispatch(clickCardView({ id, depth, children, parents, neighbors, scrollChildren }));
    }
  };

  useEffect(() => {
    if ($divCard.current && scrollElement) {
      $divCard.current.scrollIntoView({ block: 'center' });
    }
  }, [scrollElement, $divCard.current]);

  return (
    <div className={classes.join(' ')} onClick={onClick} ref={$divCard}>
      <CardButtons isSelected={isSelected} isEdit={isEdit} depth={depth} editorValue={editorValue} />

      {isEdit && isSelected ? (
        <MemoCardCodeMirror
          markdownContent={markdownContent}
          depth={depth}
          editorValue={editorValue}
          setEditorValue={setEditorValue}
        />
      ) : (
        <CardView header={headerHTML} contents={contentsHTML} />
      )}
    </div>
  );
};
