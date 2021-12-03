import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "preact/jsx-runtime";
import { useDispatch, useSelector } from 'react-redux';
import { RootReducerActions } from '../redux/actions';
const { changeCard, deleteCard } = RootReducerActions;
export const CardActions = ({ isEdit, addNewCard }) => {
    const editor = useSelector((state) => state.editorCM);
    const dispatch = useDispatch();
    const statusTitle = isEdit ? 'Сохранить изменения' : 'Редактировать карточку';
    const classes = ['card-btn', isEdit ? 'save' : 'edit'];
    return (_jsxs(_Fragment, { children: [!isEdit && (_jsxs(_Fragment, { children: [_jsx("span", { className: "card-btn delete", title: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443", onClick: () => dispatch(deleteCard()), children: "\u2716" }, void 0), _jsx("span", { className: "card-btn add-card", title: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0434\u043E\u0447\u043A\u0443", onClick: () => addNewCard('right'), children: "+" }, void 0)] }, void 0)), _jsx("span", { className: classes.join(' '), title: statusTitle, onClick: () => dispatch(changeCard({ isEdit: !isEdit, newMD: editor?.getValue() })), children: isEdit ? '✔' : '✎' }, void 0)] }, void 0));
};
//# sourceMappingURL=CardActions.js.map