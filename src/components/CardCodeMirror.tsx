import { h, FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import CodeMirror, { Editor } from 'codemirror';
import { ICardCodeMirror_Props } from 'src/interfaces';

export const CardCodeMirror: FunctionComponent<ICardCodeMirror_Props> = ({ markdownContent, depth }) => {
  const $divCodeMirror = useRef<HTMLDivElement>(null);

  const headPos = (instance: Editor) => {
    const lastLine = instance.lastLine();
    const lastLineCh = instance.getLine(lastLine).length;
    return { lastLine, lastLineCh };
  };

  const onKeyDownMirror = (instance: Editor, e: KeyboardEvent) => {
    const code: string = e.code;

    if (instance.isReadOnly() && code !== 'Backspace') {
      instance.setOption('readOnly', false);
    }
  };

  const onCursorActivity = (instance: Editor) => {
    const cursorPos = instance.getCursor();
    const selection = instance.getSelection();
    const firstLine = instance.getLine(0);
    const chHeader = depth + 1;

    if (cursorPos.line === 0 && cursorPos.ch <= chHeader) {
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

  useEffect(() => {
    const editor = CodeMirror($divCodeMirror.current!, {
      value: markdownContent.slice(0, markdownContent.length - 2),
      mode: 'markdown',
      autofocus: true,
    });

    editor.on('focus', onFocus);
    editor.on('keydown', onKeyDownMirror);
    editor.on('cursorActivity', onCursorActivity);
  }, [$divCodeMirror.current]);

  return <div ref={$divCodeMirror} className="block-edit"></div>;
};
