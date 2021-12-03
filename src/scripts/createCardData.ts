import { PreactHTMLConverter } from 'preact-html-converter';
import { remark } from 'remark';
import remarkHtml, { Root } from 'remark-html';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { ICreateCardData, IPreactState } from '../redux/interfaces';

const converter = PreactHTMLConverter();

export const createCardData = ({ id, depth, headerHTML, contentsHTML, markdownContent, parents, neighbors }: ICreateCardData) => {
  const objState: IPreactState = {
    id,
    depth,
    headerHTML,
    contentsHTML: [...contentsHTML],
    markdownContent,
    children: [],
    scrollChildren: [],
    parents: parents ? [...parents] : [],
    neighbors: neighbors ? [...neighbors] : [],
    isSelected: false,
    isEdit: false,
    isParent: false,
    isChild: false,
    isNeighbor: false,
    scrollElement: false,
  };

  return objState;
};

export const convertASTtoData = async (ast: Root) => {
  const resultMD: string = remark().stringify(ast);
  const resultHTML = String(await unified().use(remarkParse).use(remarkHtml).process(resultMD));

  const data = {
    contentHTML: converter.convert(resultHTML),
    markdownContent: `${remark().stringify(ast)}\n`,
  };

  return data;
};

export const createEmptyHeader = (depth: number) => {
  let header = '';

  if (depth === 1) header = '#';
  else if (depth === 2) header = '##';
  else if (depth === 3) header = '###';
  else if (depth === 4) header = '####';
  else if (depth === 5) header = '#####';
  else if (depth === 6) header = '######';

  return `${header} `;
};
