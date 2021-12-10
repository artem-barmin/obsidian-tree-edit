import { FunctionComponent } from 'preact';
import { useDispatch } from 'react-redux';
import { ICardButtons_Props } from '../interfaces';
import { RootReducerActions } from '../redux/actions';
import { createEmptyHeader } from '../redux/scripts';
import { CardActions } from './CardActions';

const { addCard } = RootReducerActions;

export const CardButtons: FunctionComponent<ICardButtons_Props> = ({ isSelected, isEdit, depth, editorValue }) => {
  if (!isSelected) return null;

  const dispatch = useDispatch();

  const addNewCard = (whereToAdd: string, currentDepth = depth) => {
    const newMDHeader = whereToAdd === 'right' ? createEmptyHeader(currentDepth + 1) : createEmptyHeader(currentDepth);

    dispatch(addCard(whereToAdd, `${newMDHeader}\n\n`));
  };

  return (
    <>
      <div className="block-buttons-right" style={{ justifyContent: !isEdit ? 'space-between' : 'flex-end' }}>
        <CardActions isEdit={isEdit} depth={depth} addNewCard={addNewCard} editorValue={editorValue} />
      </div>

      {!isEdit && (
        <>
          <div className="flex-row  block-buttons-top">
            <span className="card-btn add-card" title="Добавить выше" onClick={() => addNewCard('up')}>
              +
            </span>
          </div>

          <div className="flex-row block-buttons-bottom">
            <span className="card-btn add-card" title="Добавить ниже" onClick={() => addNewCard('down')}>
              +
            </span>
          </div>
        </>
      )}
    </>
  );
};
