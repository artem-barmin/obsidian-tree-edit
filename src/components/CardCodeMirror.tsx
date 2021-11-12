import { h, FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import CodeMirror, { Editor } from 'codemirror';
import { ICardCodeMirror_Props } from 'src/interfaces';

export const CardCodeMirror: FunctionComponent<ICardCodeMirror_Props> = ({ headerMD, contentsMD }) => {
  const $divCodeMirror = useRef<HTMLDivElement>(null);

  const onKeyDownMirror = (instance: Editor, e: KeyboardEvent) => {
    const code: string = e.code;
  };

  useEffect(() => {
    const editor = CodeMirror($divCodeMirror.current!, {
      value: `# Test
    Какой-то текст
    В две строки`,
      mode: 'markdown',
    });

    editor.on('keydown', onKeyDownMirror);
  }, [$divCodeMirror.current]);

  return <div ref={$divCodeMirror}></div>;
};
