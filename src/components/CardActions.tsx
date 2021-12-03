import { FunctionComponent } from 'preact';
import { useDispatch, useSelector } from 'react-redux';
import { ICardActions_Props } from '../interfaces';
import { RootReducerActions } from '../redux/actions';
import { IState } from '../redux/interfaces';

const { changeCard, deleteCard } = RootReducerActions;

export const CardActions: FunctionComponent<ICardActions_Props> = ({ isEdit, addNewCard }) => {
  const editor = useSelector((state: IState) => state.editorCM);
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

          <span className="card-btn add-card" title="Добавить дочку" onClick={() => addNewCard('right')}>
            +
          </span>
        </>
      )}

      <span
        className={classes.join(' ')}
        title={statusTitle}
        onClick={() => dispatch(changeCard({ isEdit: !isEdit, newMD: editor?.getValue() }))}
      >
        {isEdit ? '✔' : '✎'}
      </span>
    </>
  );
};
