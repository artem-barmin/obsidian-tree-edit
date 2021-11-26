import _ from 'lodash';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse/lib';
import { unified } from 'unified';
import { Root } from 'remark-parse/lib';
import { nanoid } from 'nanoid';
import { PreactHTMLConverter } from 'preact-html-converter';

import { IPreactState, IHeadersData, IHeaderChains, idChains, IDataChains, INewCardContent } from '../redux/interfacesRedux';

const converter = PreactHTMLConverter();

export const fileContents = (markdownText: string): any[] => {
  const markdown: Root = remark().parse(markdownText);
  return [...markdown.children];
};

const astToHTML = async (ast: Root): Promise<string> => {
  const resultMD: string = remark().stringify(ast);
  const resultHTML = await unified().use(remarkParse).use(remarkHtml).process(resultMD);
  return String(resultHTML);
};

const initialState = async (markdownText: string) => {
  const headersData: IHeadersData[] = [];
  const preactState: IPreactState[][] = [];
  const stateMDContent: any[] = [];

  for (const elem of fileContents(markdownText)) {
    const orderLength: number = headersData.length;

    if (elem.type === 'heading') {
      const headerData: IHeadersData = {
        id: nanoid(),
        depth: elem.depth,
        headerHTML: converter.convert(await astToHTML(elem)),
        contentsHTML: [],
        markdownContent: `${remark().stringify(elem)}\n`,
      };
      headersData.push(headerData);
    } else if (orderLength) {
      headersData[orderLength - 1].contentsHTML.push(converter.convert(await astToHTML(elem)));
      headersData[orderLength - 1].markdownContent += `${remark().stringify(elem)}\n`;
    }
  }

  for (const { id, markdownContent } of headersData) {
    stateMDContent.push({ id, markdownContent });
  }

  headersData.forEach(({ id, depth, headerHTML, contentsHTML, markdownContent }) => {
    const objState: IPreactState = {
      id,
      depth,
      headerHTML,
      contentsHTML: [...contentsHTML],
      markdownContent,
      children: [],
      scrollChildren: [],
      parents: [],
      neighbors: [],
      isSelected: false,
      isEdit: false,
      isParent: false,
      isChild: false,
      isNeighbor: false,
      scrollElement: false,
    };

    const currentDepth = preactState[depth - 1];
    !currentDepth ? preactState.push([objState]) : currentDepth.push(objState);
  });

  return { headersData, stateMDContent, preactState };
};

const buildTree = (inputArr: IHeadersData[]) => {
  const buildNode = (input: IHeadersData, parentArr: IDataChains[]): IHeaderChains => ({
    id: input.id,
    depth: input.depth,
    children: [],
    parents: parentArr && parentArr.length ? [...parentArr] : [],
    neighbors: [],
  });

  const buildLevel = (globalInput: IHeadersData[], parentArr?: IDataChains[]) => {
    const currentLevel: IHeaderChains[] = [];
    let levelDepth: number = 0;

    const parents = parentArr && parentArr.length ? [...parentArr] : [];

    let currentElement: IHeadersData;

    while ((currentElement = globalInput[globalIndex])) {
      if (!currentElement || currentElement.depth < levelDepth) {
        break;
      } else if (!currentLevel.length) {
        currentLevel.push(buildNode(currentElement, parents));
        levelDepth = currentElement.depth;
        globalIndex++;
      } else if (currentElement.depth > levelDepth) {
        const previousElement = currentLevel[currentLevel.length - 1];
        const { id, depth } = globalInput[globalIndex - 1];
        previousElement.children = buildLevel(globalInput, [...parents, { id, depth }]);
      } else {
        currentLevel.push(buildNode(currentElement, parents));
        globalIndex++;
      }
    }

    const allCurrentLevelIds: idChains = _.map(currentLevel, 'id');
    _.forEach(currentLevel, (lvl: IHeaderChains) => (lvl.neighbors = _.difference(allCurrentLevelIds, [lvl.id])));

    return currentLevel;
  };

  let globalIndex: number = 0;

  return buildLevel(inputArr);
};

export const readyState = async (markdownText: string) => {
  const { headersData, stateMDContent, preactState } = await initialState(markdownText);
  const headerChains = buildTree(headersData);

  const definingChains = (inputChain: IHeaderChains[], inputState: IPreactState[][]): void => {
    const scrollingChildren = (children: IDataChains[], scrollChildren: IDataChains[]) => {
      const uniqDepths: number[] = [];

      children.forEach(({ depth, id }: IDataChains) => {
        if (!uniqDepths.includes(depth)) {
          uniqDepths.push(depth);
          scrollChildren.push({ id, depth });
        }
      });
    };
    const addChildren = (childrenInput: IHeaderChains[], state: IDataChains[]): void => {
      for (const { id, children, depth } of childrenInput) {
        state.push({ id, depth });
        addChildren(children, state);
      }
    };

    const stateChain = (globalInput: IHeaderChains[], globalState: IPreactState[][] = inputState): void => {
      for (const chainEl of globalInput) {
        for (const state of globalState.flat()) {
          if (chainEl.id === state.id) {
            state.parents.push(...chainEl.parents);
            state.neighbors.push(...chainEl.neighbors);
            addChildren(chainEl.children, state.children);
            scrollingChildren(state.children, state.scrollChildren);
          }
        }
        stateChain(chainEl.children);
      }
    };
    stateChain(inputChain);
  };

  definingChains(headerChains, preactState);

  return { stateMDContent, preactState };
};

export const newCardContent = async (markdownText: string) => {
  const result: INewCardContent = { headerHTML: [], contentsHTML: [], markdownContent: '' };

  for (const elem of fileContents(markdownText)) {
    if (elem.type === 'heading') {
      result.headerHTML = converter.convert(await astToHTML(elem));
      result.markdownContent = `${remark().stringify(elem)}\n`;
    } else {
      result.contentsHTML.push(converter.convert(await astToHTML(elem)));
      result.markdownContent += `${remark().stringify(elem)}\n`;
    }
  }

  return result;
};
