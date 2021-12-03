import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { useRef } from 'preact/hooks';
import { useDispatch } from 'react-redux';
import { RootReducerActions } from '../redux/actions';
import { CardButtons } from './CardButtons';
import { MemoCardCodeMirror } from './CardCodeMirror';
import { CardView } from './CardView';
const { clickCardView } = RootReducerActions;
export const Card = ({ card }) => {
    const { id, depth, headerHTML, contentsHTML, markdownContent, children, scrollChildren, parents, neighbors, isSelected, isEdit, isParent, isChild, isNeighbor, scrollElement, } = card;
    const dispatch = useDispatch();
    const $divCard = useRef(null);
    const classes = ['card'];
    if (isSelected)
        classes.push('selected-item');
    else if (isChild)
        classes.push('chain-down');
    else if (isParent || isNeighbor)
        classes.push('chain-up');
    else
        classes.push('no-active');
    if (scrollElement && $divCard.current) {
        $divCard.current.scrollIntoView({ block: 'center' });
    }
    const onClick = (e) => {
        const classesElem = e.target.className.split(' ');
        if (!classesElem.includes('card-btn')) {
            dispatch(clickCardView({ id, depth, children, parents, neighbors, scrollChildren }));
        }
    };
    return (_jsxs("div", { className: classes.join(' '), onClick: onClick, ref: $divCard, children: [_jsx(CardButtons, { isSelected: isSelected, isEdit: isEdit, depth: depth }, void 0), isEdit && isSelected ? (_jsx(MemoCardCodeMirror, { markdownContent: markdownContent, depth: depth }, void 0)) : (_jsx(CardView, { header: headerHTML, contents: contentsHTML }, void 0))] }, void 0));
};
//# sourceMappingURL=Card.js.map