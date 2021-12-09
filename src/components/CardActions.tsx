import { FunctionComponent } from 'preact';
import { useDispatch } from 'react-redux';
import { ICardActions_Props } from '../interfaces';
import { RootReducerActions } from '../redux/actions';

const { changeCard, deleteCard } = RootReducerActions;

export const CardActions: FunctionComponent<ICardActions_Props> = ({ isEdit, depth, addNewCard, editorValue }) => {
  const dispatch = useDispatch();

  const statusTitle = isEdit ? 'Сохранить изменения' : 'Редактировать карточку';
  const classes = ['card-btn', isEdit ? 'save' : 'edit'];

  return (
    <>
      {!isEdit && (
        <>
          <span className="card-btn delete" title="Удалить карточку" onClick={() => dispatch(deleteCard())}>
            ✖
          </span>

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
        onClick={() => dispatch(changeCard({ isEdit: !isEdit, newMD: isEdit ? editorValue : '' }))}
      >
        {isEdit ? '✔' : '✎'}
      </span>
    </>
  );
};
