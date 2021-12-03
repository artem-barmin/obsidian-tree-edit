import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { Card } from './Card';
export const ListColumnsDepths = ({ cards }) => {
    return (_jsxs("div", { className: "column", children: [_jsx("div", { className: "empty-place" }, void 0), _jsx("div", { className: "group", children: cards.map((card) => {
                    return _jsx(Card, { card: card }, card.id);
                }) }, void 0), _jsx("div", { className: "empty-place" }, void 0)] }, void 0));
};
//# sourceMappingURL=ListColumnsDepths.js.map