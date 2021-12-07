import { Editor } from 'codemirror';
import { FunctionComponent } from 'preact';
import { memo } from 'preact/compat';
import { UnControlled } from 'react-codemirror2';
import { useDispatch } from 'react-redux';
import { ICardCodeMirror_Props } from '../interfaces';
import { RootReducerActions } from '../redux/actions';

const { changeCard } = RootReducerActions;

const CardCodeMirror: FunctionComponent<ICardCodeMirror_Props> = ({ markdownContent, depth, editorValue, setEditorValue }) => {
  const dispatch = useDispatch();

  const headPos = (instance: Editor) => {
    const lastLine = instance.lastLine();
    const lastLineCh = instance.getLine(lastLine).length;
    return { lastLine, lastLineCh };
  };

  const onKeyDown = async (instance: Editor, e: KeyboardEvent) => {
    const lengthForHeader: number = 9;
    const { line, ch } = instance.getCursor();

    if (instance.isReadOnly() && e.code !== 'Backspace') {
      instance.setOption('readOnly', false);
    } else if (line !== 0 && ch <= lengthForHeader) {
      const textCurrentPosition = instance.getRange({ line, ch: 0 }, { line, ch: lengthForHeader });
      const spacesForHeader = textCurrentPosition.match(/^[ ]{1,3}$/g);

      if ((spacesForHeader || ch === 0) && e.key === '#') {
        e.preventDefault();
      }
    }
  };

  const onPaste = (instance: Editor, e: ClipboardEvent) => {
    const paste = e.clipboardData!.getData('text');
    let line = 1;
    const lines: { [key: string]: string } = {};

    for (const elem of paste) {
      if (elem === '\n') line++;
      else !lines[line] ? (lines[line] = elem) : (lines[line] += elem);
    }
    for (const [key, value] of Object.entries(lines)) {
      if (value.match(/^[ ]{0,3}#{1,6}$/g)) delete lines[key];
    }

    const editedLine = Object.values(lines).join('\n');
    if (editedLine !== paste) e.preventDefault();
  };

  const onCursorActivity = (instance: Editor) => {
    const { line, ch } = instance.getCursor();
    const selection = instance.getSelection();
    const firstLine = instance.getLine(0);
    const chHeader = depth + 1;

    if (line === 0 && ch <= chHeader) {
      instance.setOption('readOnly', true);
      instance.setCursor({ line: 0, ch: chHeader });
    } else if (selection.indexOf(firstLine) === 0) {
      const { lastLine, lastLineCh } = headPos(instance);
      instance.setSelection({ line: 0, ch: chHeader }, { line: lastLine, ch: lastLineCh });
    } else instance.setOption('readOnly', false);
  };

  const onFocus = (instance: Editor) => {
    const { lastLine, lastLineCh } = headPos(instance);
    instance.setCursor({ line: lastLine, ch: lastLineCh });
  };

  const onChange = (editor: Editor, currentValue: string, setValue = setEditorValue) => {
    if (currentValue !== editor.getValue()) {
      setValue(editor.getValue());
    }
  };

  return (
    <div className="block-edit">
      <UnControlled
        value={editorValue}
        options={{
          mode: 'markdown',
          autofocus: true,
          extraKeys: {
            Esc: () => {
              dispatch(changeCard({ isEdit: false, newMD: '' }));
            },
            'Shift-Enter': (instance) => {
              dispatch(changeCard({ isEdit: false, newMD: instance.getValue() }));
            },
          },
        }}
        editorDidMount={(editor) => {
          editor.setValue(`${markdownContent.slice(0, markdownContent.length - 2)} `);
        }}
        onChange={(editor) => onChange(editor, editorValue)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onCursorActivity={onCursorActivity}
        onPaste={onPaste}
      />
    </div>
  );
};

export const MemoCardCodeMirror = memo(CardCodeMirror);
