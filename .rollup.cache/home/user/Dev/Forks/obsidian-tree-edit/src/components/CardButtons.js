import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "preact/jsx-runtime";
import { useDispatch } from 'react-redux';
import { RootReducerActions } from '../redux/actions';
import { createEmptyHeader, fileContents } from '../scripts';
import { CardActions } from './CardActions';
const { addCard } = RootReducerActions;
export const CardButtons = ({ isSelected, isEdit, depth }) => {
    if (!isSelected)
        return null;
    const dispatch = useDispatch();
    const addNewCard = (whereToAdd, currentDepth = depth) => {
        if (currentDepth === 6)
            return;
        const newMDHeader = whereToAdd === 'right' ? createEmptyHeader(currentDepth + 1) : createEmptyHeader(currentDepth);
        const [astHeader] = fileContents(newMDHeader);
        dispatch(addCard(whereToAdd, astHeader));
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "block-buttons-right", style: { justifyContent: !isEdit ? 'space-between' : 'flex-end' }, children: _jsx(CardActions, { isEdit: isEdit, addNewCard: addNewCard }, void 0) }, void 0), !isEdit && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex-row  block-buttons-top", children: _jsx("span", { className: "card-btn add-card", title: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432\u044B\u0448\u0435", onClick: () => addNewCard('up'), children: "+" }, void 0) }, void 0), _jsx("div", { className: "flex-row block-buttons-bottom", children: _jsx("span", { className: "card-btn add-card", title: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u0438\u0436\u0435", onClick: () => addNewCard('down'), children: "+" }, void 0) }, void 0)] }, void 0))] }, void 0));
};
//# sourceMappingURL=CardButtons.js.map