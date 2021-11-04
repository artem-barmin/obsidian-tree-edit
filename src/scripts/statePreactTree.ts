import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse/lib';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { Root } from 'remark-parse/lib';
import { nanoid } from 'nanoid';
import { PreactHTMLConverter } from 'preact-html-converter';
import _ from 'lodash';

import { markdownText } from '../constMd';
import { IPreactState, IHeadersData, IHeaderChains, idChains, IDataChains, VirtualDom } from './scriptInterfaces';

const converter = PreactHTMLConverter();

const astToHTML = async (ast: any): Promise<string> => {
  const resultMD: string = remark().stringify(ast);
  const resultHTML = await unified().use(remarkParse).use(remarkHtml).process(resultMD);
  return String(resultHTML);
};

const initialState = async (markdown: Root) => {
  const headersData: IHeadersData[] = [];
  const preactState: IPreactState[][] = [];
  const childrenNode: any = [];

  visit(markdown, 'root', (node): void => {
    childrenNode.push(...node.children);
  });

  for (const elem of childrenNode) {
    if (elem.type === 'thematicBreak') continue;

    const orderLength: number = headersData.length;
    const contentHTML: VirtualDom = converter.convert(await astToHTML(elem));

    if (elem.type === 'heading') {
      const objTitle: IHeadersData = {
        id: nanoid(),
        depth: elem.depth,
        headerHTML: contentHTML,
        contentsHTML: []
      };
      headersData.push(objTitle);
      continue;
    }

    if (!orderLength) continue;
    headersData[orderLength - 1].contentsHTML.push(contentHTML);
  }

  headersData.forEach(({ id, depth, headerHTML, contentsHTML }) => {
    const objState: IPreactState = {
      id,
      depth,
      headerHTML,
      contentsHTML,
      children: [],
      scrollChildren: [],
      parents: [],
      neighbors: [],
      isParent: false,
      isChild: false,
      isNeighbor: false,
      scrollElement: false
    };

    const currentDepth = preactState[depth - 1];
    !currentDepth ? preactState.push([objState]) : currentDepth.push(objState);
  });

  return { headersData, preactState };
};

const buildTree = (inputArr: IHeadersData[]) => {
  const buildNode = (input: IHeadersData, parentArr: IDataChains[]): IHeaderChains => ({
    id: input.id,
    depth: input.depth,
    children: [],
    parents: parentArr && parentArr.length ? [...parentArr] : [],
    neighbors: []
  });

  const buildLevel = (globalInput: IHeadersData[], parentArr?: IDataChains[]) => {
    const currentLevel: IHeaderChains[] = [];
    let levelDepth: number = 0;

    const parents = parentArr && parentArr.length ? [...parentArr] : [];

    let currentElement: IHeadersData;

    while ((currentElement = globalInput[globalIndex])) {
      if (!currentElement || currentElement.depth < levelDepth) {
        break;
      }
      if (!currentLevel.length) {
        currentLevel.push(buildNode(currentElement, parents));
        levelDepth = currentElement.depth;
        globalIndex++;
        continue;
      }
      if (currentElement.depth > levelDepth) {
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

  const tree = buildLevel(inputArr);

  return tree;
};

export const readyState = async () => {
  const initalMD: Root = remark().parse(markdownText);
  const { headersData, preactState } = await initialState(initalMD);
  const headerChains = buildTree(headersData);

  const definingChains = (inputChain: IHeaderChains[]): void => {
    const scrollingChildren = (children: IDataChains[], scrollChildren: IDataChains[]) => {
      const uniqDepths: number[] = [];

      children.forEach(({ depth, id }: IDataChains) => {
        if (uniqDepths.includes(depth)) return;

        uniqDepths.push(depth);
        scrollChildren.push({ id, depth });
      });
    };
    const addChildren = (childrenInput: IHeaderChains[], state: IDataChains[]): void => {
      for (const { id, children, depth } of childrenInput) {
        state.push({ id, depth });
        addChildren(children, state);
      }
    };

    const stateChain = (globalInput: IHeaderChains[]): void => {
      for (const chainEl of globalInput) {
        for (const state of preactState.flat()) {
          if (chainEl.id !== state.id) continue;

          state.parents.push(...chainEl.parents);
          state.neighbors.push(...chainEl.neighbors);
          addChildren(chainEl.children, state.children);
          scrollingChildren(state.children, state.scrollChildren);
          break;
        }
        stateChain(chainEl.children);
      }
    };
    stateChain(inputChain);
  };

  definingChains(headerChains);

  return preactState;
};
