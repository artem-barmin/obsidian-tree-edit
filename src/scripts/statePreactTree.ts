import _ from 'lodash';
import { nanoid } from 'nanoid';
import { remark } from 'remark';
import { Root } from 'remark-parse/lib';
import {
  IDataChains,
  idChains,
  IHeaderChains,
  IHeadersData,
  INewCardContent,
  IPreactState,
  IStateMDContent,
} from '../redux/interfaces/interfacesRedux';
import { convertASTtoData, createCardData } from './createCardData';

export const fileContents = (markdownText: string): any[] => {
  const markdown: Root = remark().parse(markdownText);
  return [...markdown.children];
};

const initialState = async (markdownText: string) => {
  const headersData: IHeadersData[] = [];
  const preactState: IPreactState[][] = [];
  const stateMDContent: IStateMDContent[] = [];

  for (const elem of fileContents(markdownText)) {
    const orderLength: number = headersData.length;

    const { contentHTML, markdownContent } = await convertASTtoData(elem);

    if (elem.type === 'heading') {
      const headerData: IHeadersData = {
        id: nanoid(),
        depth: elem.depth,
        headerHTML: contentHTML,
        contentsHTML: [],
        markdownContent,
      };

      headersData.push(headerData);
    } else if (orderLength) {
      headersData[orderLength - 1].contentsHTML.push(contentHTML);
      headersData[orderLength - 1].markdownContent += markdownContent;
    }
  }

  for (const { id, markdownContent } of headersData) {
    stateMDContent.push({ id, markdownContent });
  }

  for (const data of headersData) {
    const objState = createCardData(data);

    const currentDepth = preactState[data.depth - 1];

    !currentDepth ? preactState.push([{ ...objState }]) : currentDepth.push({ ...objState });
  }

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
    const { contentHTML, markdownContent } = await convertASTtoData(elem);

    if (elem.type === 'heading') {
      result.headerHTML = contentHTML;
      result.markdownContent = markdownContent;
    } else {
      result.contentsHTML.push(contentHTML);
      result.markdownContent += markdownContent;
    }
  }

  return result;
};
