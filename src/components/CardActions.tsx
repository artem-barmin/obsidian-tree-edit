import { h, FunctionComponent } from 'preact';
import { ICardActions_Props } from 'src/interfaces';

export const CardActions: FunctionComponent<ICardActions_Props> = ({ isSelected, isEdit, cardAction }) => {
  if (!isSelected) return null;

  const statusTitle: string = isEdit ? 'Сохранить изменения' : 'Редактировать карточку';
  const classes: string[] = ['card-btn', isEdit ? 'save' : 'edit'];

  return (
    <>
      <span className="card-btn delete" title="Удалить карточку">
        ✖
      </span>
      <span className={classes.join(' ')} title={statusTitle} onClick={() => cardAction(!isEdit)}>
        {isEdit ? '✔' : '✎'}
      </span>
    </>
  );
};
