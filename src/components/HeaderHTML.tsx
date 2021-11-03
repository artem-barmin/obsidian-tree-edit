import { h, FunctionComponent } from 'preact';
import { PreactHTMLConverter } from 'preact-html-converter';

const converter = PreactHTMLConverter();

export const HeaderHTML: FunctionComponent<{ headerHTML: string }> = ({ headerHTML }) => {
  return <div style={{ fontSize: '17px', fontStyle: 'italic', textAlign: 'start' }}>{converter.convert(headerHTML)}</div>;
};
