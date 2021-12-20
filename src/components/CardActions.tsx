import { FunctionComponent } from 'preact';
import { useDispatch } from 'react-redux';
import { useEmptyCard, useLastCard } from '../hooks';
import { ICardActions_Props } from '../interfaces';
import { RootReducerActions } from '../redux/actions';

const { changeCard, deleteCard, createEmptyCard } = RootReducerActions;

export const CardActions: FunctionComponent<ICardActions_Props> = ({ isEdit, depth, addNewCard, editorValue }) => {
  const dispatch = useDispatch();
  const isEmptyCard = useEmptyCard();
  const isLastCard = useLastCard();

  const statusTitle = isEdit ? 'Сохранить изменения' : 'Редактировать карточку';
  const deleteTitile = isLastCard ? 'Удалить содержимое маркдауна' : 'Удалить карточку';
  const classes = ['card-btn', isEdit ? 'save' : 'edit'];

  const onClickDelete = (lastCard: boolean) => {
    if (!lastCard) {
      dispatch(deleteCard());
    } else {
      dispatch(createEmptyCard(true));
    }
  };

  return (
    <>
      {!isEdit && (
        <>
          {!isEmptyCard && (
            <span className="card-btn delete" title={deleteTitile} onClick={() => onClickDelete(isLastCard)}>
              ✖
            </span>
          )}

          {depth < 6 && (
            <span className="card-btn add-card" title="Добавить дочку" onClick={() => addNewCard('right')}>
              +
            </span>
          )}
        </>
      )}

      <span
        className={classes.join(' ')}
        title={statusTitle}
        onClick={() => dispatch(changeCard(!isEdit, isEdit ? editorValue : ''))}
      >
        {isEdit ? '✔' : '✎'}
      </span>
    </>
  );
};
