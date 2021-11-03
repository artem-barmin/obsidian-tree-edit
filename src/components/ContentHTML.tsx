import { h, FunctionComponent } from 'preact';
import { PreactHTMLConverter } from 'preact-html-converter';

const converter = PreactHTMLConverter();

export const ContentHTML: FunctionComponent<{ contentHTML: string; index: number }> = ({ contentHTML, index }) => {
  // console.log(contentHTML);
  return (
    <div key={index} style={{ textAlign: 'start' }}>
      {converter.convert(contentHTML)}
    </div>
  );
};
