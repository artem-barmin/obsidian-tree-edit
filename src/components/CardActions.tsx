import { h, FunctionComponent } from 'preact';
import { useDispatch, useSelector } from 'react-redux';

import { ICardActions_Props } from 'src/interfaces';
import { IState } from 'src/redux/interfacesRedux';
import { cardAction } from '../redux/actions';

export const CardActions: FunctionComponent<ICardActions_Props> = ({ isSelected, isEdit }) => {
  if (!isSelected) return null;

  const editor = useSelector((state: IState) => state.editorCM);
  const dispatch = useDispatch();

  const statusTitle: string = isEdit ? 'Сохранить изменения' : 'Редактировать карточку';
  const classes: string[] = ['card-btn', isEdit ? 'save' : 'edit'];

  return (
    <>
      <span className="card-btn delete" title="Удалить карточку">
        ✖
      </span>
      <span
        className={classes.join(' ')}
        title={statusTitle}
        onClick={() => dispatch(cardAction({ isEdit: !isEdit, newMD: editor?.getValue() }))}
      >
        {isEdit ? '✔' : '✎'}
      </span>
    </>
  );
};
