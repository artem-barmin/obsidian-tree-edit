import { Editor } from 'codemirror';
import { FunctionComponent } from 'preact';
import { UnControlled as Codemirror } from 'react-codemirror2';
import { useDispatch } from 'react-redux';
import { ICardCodeMirror_Props } from '../interfaces';
import { RootReducerActions } from '../redux/actions';
import { emptyHeader } from '../scripts';

const { changeCard } = RootReducerActions;

export const CardCodeMirror: FunctionComponent<ICardCodeMirror_Props> = ({
  markdownContent,
  depth,
  editorValue,
  setEditorValue,
}) => {
  const dispatch = useDispatch();

  const isEmpty = emptyHeader(markdownContent, depth);
  const readyMarkdown = isEmpty || markdownContent.slice(0, markdownContent.length - 2);

  const headPos = (instance: Editor) => {
    const lastLine = instance.lastLine();
    const lastLineCh = instance.getLine(lastLine).length;
    return { lastLine, lastLineCh };
  };

  const cursorAfterHeader = (instance: Editor, chHeader = depth + 1) => {
    const { line, ch } = instance.getCursor();
    return line === 0 && ch <= chHeader;
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
    } else if (isEmpty && cursorAfterHeader(instance) && e.code === 'Backspace') {
      e.preventDefault();
    } else if (e.ctrlKey && e.code === 'Backspace') {
      const textCurrentPosition = instance.getRange({ line, ch: 0 }, { line, ch: lengthForHeader });
      const spacesForHeader = textCurrentPosition.match(/^#{1,6}[ ]+$/g);

      if (spacesForHeader || (line === 0 && ch === depth + 1)) {
        e.preventDefault();
      }
    }
  };

  const onPaste = (instance: Editor, e: ClipboardEvent) => {
    const paste = e.clipboardData!.getData('text');
    const lines: { [key: string]: string } = {};
    let line = 1;

    for (const elem of paste) {
      if (elem === '\n') {
        line++;
      } else {
        !lines[line] ? (lines[line] = elem) : (lines[line] += elem);
      }
    }
    for (const [key, value] of Object.entries(lines)) {
      if (value.match(/^[ ]{0,3}#{1,6}$/g)) delete lines[key];
    }

    const editedLine = Object.values(lines).join('\n');
    if (editedLine !== paste) e.preventDefault();
  };

  const onCursorActivity = (instance: Editor) => {
    const selection = instance.getSelection();
    const firstLine = instance.getLine(0);
    const chHeader = depth + 1;

    if (cursorAfterHeader(instance)) {
      instance.setOption('readOnly', true);
      instance.setCursor({ line: 0, ch: chHeader });
    } else if (selection.indexOf(firstLine) === 0) {
      const { lastLine, lastLineCh } = headPos(instance);
      instance.setSelection({ line: 0, ch: chHeader }, { line: lastLine, ch: lastLineCh });
    } else {
      instance.setOption('readOnly', false);
    }
  };

  const onChange = (editor: Editor, currentValue: string, setValue = setEditorValue) => {
    if (currentValue !== editor.getValue()) {
      const isEmpty = emptyHeader(editor.getValue());
      const resultValue = isEmpty ? isEmpty.replaceAll(' ', '') : editor.getValue();

      setValue(`${resultValue}\n\n`);
    }
  };

  return (
    <div className="block-edit">
      <Codemirror
        value={readyMarkdown}
        options={{
          mode: 'markdown',
          autofocus: true,
          lineWrapping: true,
          extraKeys: {
            Esc: () => {
              dispatch(changeCard(false, ''));
            },
            'Shift-Enter': () => {
              dispatch(changeCard(false, editorValue));
            },
          },
        }}
        onChange={(editor) => onChange(editor, editorValue)}
        onKeyDown={onKeyDown}
        onCursorActivity={onCursorActivity}
        onPaste={onPaste}
      />
    </div>
  );
};
