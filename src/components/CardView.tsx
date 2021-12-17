import Markdown from 'markdown-to-jsx';
import { FunctionComponent } from 'preact';
import { memo } from 'preact/compat';
import { ICardView_Props } from '../interfaces';
import { emptyHeader } from '../scripts';

const CardView: FunctionComponent<ICardView_Props> = ({ depth, markdownContent }) => {
  const isEmpty = emptyHeader(markdownContent, depth);

  return <div className="view">{!isEmpty ? <Markdown>{markdownContent}</Markdown> : ''}</div>;
};

export const MemoCardView = memo(CardView);
