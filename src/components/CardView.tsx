import Markdown from 'markdown-to-jsx';
import { FunctionComponent } from 'preact';
import { memo } from 'preact/compat';
import { ICardView_Props } from '../interfaces';

const CardView: FunctionComponent<ICardView_Props> = ({ depth, markdownContent }) => {
  const emptyHeader = markdownContent.length === depth + 2;

  return <div className="view">{!emptyHeader ? <Markdown>{markdownContent}</Markdown> : ''}</div>;
};

export const MemoCardView = memo(CardView);
