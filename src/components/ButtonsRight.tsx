import { FunctionComponent } from 'preact';
import { useDispatch } from 'react-redux';
import { useEmptyCard, useLastCard } from '../hooks';
import { IButtonsRight_Props } from '../interfaces';
import { RootReducerActions } from '../redux/actions';

const { changeCard, deleteCard, createEmptyCard } = RootReducerActions;

export const ButtonsRight: FunctionComponent<IButtonsRight_Props> = ({ isEdit, depth, addNewCard, editorValue }) => {
  const dispatch = useDispatch();
  const isEmptyCard = useEmptyCard();
  const isLastCard = useLastCard();

  const statusTitle = isEdit ? 'Save changes' : 'Edit card';
  const deleteTitile = isLastCard ? 'Delete markdown content' : 'Delete card';
  const classesEdit = ['card-btn', isEdit ? 'save' : 'edit'];

  const onClickDelete = (lastCard: boolean) => {
    if (!lastCard) {
      dispatch(deleteCard());
    } else {
      dispatch(createEmptyCard(true));
    }
  };

  return (
    <div className="block-buttons-right" style={{ justifyContent: !isEdit ? 'space-between' : 'flex-end' }}>
      {!isEdit && (
        <>
          {!isEmptyCard && (
            <span className="card-btn delete" title={deleteTitile} onClick={() => onClickDelete(isLastCard)}>
              ✖
            </span>
          )}

          {depth < 6 && (
            <span
              className="card-btn add-card"
              title="Add child"
              onClick={() => addNewCard('right')}
              style={isEmptyCard ? { marginTop: 'auto', alignSelf: 'center' } : {}}
            >
              +
            </span>
          )}
        </>
      )}

      <span
        className={classesEdit.join(' ')}
        title={statusTitle}
        onClick={() => dispatch(changeCard(!isEdit, isEdit ? editorValue : ''))}
        style={{ alignSelf: 'flex-end' }}
      >
        {isEdit ? '✔' : '✎'}
      </span>
    </div>
  );
};
