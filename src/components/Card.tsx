import { FunctionComponent } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { useDispatch } from 'react-redux';
import { ICard_Props } from '../interfaces';
import { RootReducerActions } from '../redux/actions';
import { CardButtons } from './CardButtons';
import { CardCodeMirror } from './CardCodeMirror';
import { MemoCardView } from './CardView';

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

  return (
    <div
      className={classes.join(' ')}
      onClick={onClick}
      ref={$divCard}
      style={{ scrollSnapAlign: scrollElement ? 'center' : 'none' }}
    >
      <CardButtons isSelected={isSelected} isEdit={isEdit} depth={depth} editorValue={editorValue} />

      {isEdit && isSelected ? (
        <CardCodeMirror
          markdownContent={markdownContent}
          depth={depth}
          editorValue={editorValue}
          setEditorValue={setEditorValue}
        />
      ) : (
        <MemoCardView header={headerHTML} contents={contentsHTML} />
      )}
    </div>
  );
};
