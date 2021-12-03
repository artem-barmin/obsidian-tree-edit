import { jsx as _jsx } from "preact/jsx-runtime";
import CodeMirror from 'codemirror';
import { memo } from 'preact/compat';
import { useEffect, useRef } from 'preact/hooks';
import { useDispatch } from 'react-redux';
import { RootReducerActions } from '../redux/actions';
const { changeCard, setEditorCM } = RootReducerActions;
const CardCodeMirror = ({ markdownContent, depth }) => {
    const dispatch = useDispatch();
    const $divCodeMirror = useRef(null);
    const headPos = (instance) => {
        const lastLine = instance.lastLine();
        const lastLineCh = instance.getLine(lastLine).length;
        return { lastLine, lastLineCh };
    };
    const onKeyDown = async (instance, e) => {
        const lengthForHeader = 9;
        const { line, ch } = instance.getCursor();
        if (e.code === 'Escape')
            dispatch(changeCard({ isEdit: false, newMD: '' }));
        else if (instance.isReadOnly() && e.code !== 'Backspace') {
            instance.setOption('readOnly', false);
        }
        else if (line !== 0 && ch <= lengthForHeader) {
            const textCurrentPosition = instance.getRange({ line, ch: 0 }, { line, ch: lengthForHeader });
            const spacesForHeader = textCurrentPosition.match(/^[ ]{1,3}$/g);
            if ((spacesForHeader || ch === 0) && e.key === '#') {
                e.preventDefault();
            }
        }
    };
    const onPaste = (instance, e) => {
        const paste = e.clipboardData.getData('text');
        let line = 1;
        const lines = {};
        for (const elem of paste) {
            if (elem === '\n')
                line++;
            else
                !lines[line] ? (lines[line] = elem) : (lines[line] += elem);
        }
        for (const [key, value] of Object.entries(lines)) {
            if (value.match(/^[ ]{0,3}#{1,6}$/g))
                delete lines[key];
        }
        const editedLine = Object.values(lines).join('\n');
        if (editedLine !== paste)
            e.preventDefault();
    };
    const onCursorActivity = (instance) => {
        const { line, ch } = instance.getCursor();
        const selection = instance.getSelection();
        const firstLine = instance.getLine(0);
        const chHeader = depth + 1;
        if (line === 0 && ch <= chHeader) {
            instance.setOption('readOnly', true);
            instance.setCursor({ line: 0, ch: chHeader });
        }
        else if (selection.indexOf(firstLine) === 0) {
            const { lastLine, lastLineCh } = headPos(instance);
            instance.setSelection({ line: 0, ch: chHeader }, { line: lastLine, ch: lastLineCh });
        }
        else
            instance.setOption('readOnly', false);
    };
    const onFocus = (instance) => {
        const { lastLine, lastLineCh } = headPos(instance);
        instance.setCursor({ line: lastLine, ch: lastLineCh });
    };
    useEffect(() => {
        const editor = CodeMirror($divCodeMirror.current, {
            value: `${markdownContent.slice(0, markdownContent.length - 2)} `,
            mode: 'markdown',
            autofocus: true,
        });
        dispatch(setEditorCM(editor));
        editor.on('focus', onFocus);
        editor.on('keydown', onKeyDown);
        editor.on('cursorActivity', onCursorActivity);
        editor.on('paste', onPaste);
    }, [$divCodeMirror.current, markdownContent]);
    return _jsx("div", { ref: $divCodeMirror, className: "block-edit" }, void 0);
};
export const MemoCardCodeMirror = memo(CardCodeMirror);
//# sourceMappingURL=CardCodeMirror.js.map