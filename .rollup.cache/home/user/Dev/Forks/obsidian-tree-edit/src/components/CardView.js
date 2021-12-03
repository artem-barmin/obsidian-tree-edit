import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
import { nanoid } from 'nanoid';
import { ContentHTML } from './ContentHTML';
import { HeaderHTML } from './HeaderHTML';
export const CardView = ({ header, contents }) => {
    return (_jsxs("div", { className: "view", children: [_jsx(HeaderHTML, { headerHTML: header }, void 0), contents.map((content) => {
                return _jsx(ContentHTML, { contentHTML: content }, nanoid());
            })] }, void 0));
};
//# sourceMappingURL=CardView.js.map