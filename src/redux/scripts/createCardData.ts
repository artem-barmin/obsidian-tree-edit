import _ from 'lodash';
import {
  IAddCardToNeighbors_Input,
  ICreateCardData_Input,
  ICreateNewCardStates_Input,
  IDataSelectedElem,
  IPreactState,
} from '../interfaces';
import { makeChainOnClick } from './changeStatePreact';
import { getReadyMarkdown } from './getReadyMarkdown';

export const createNewCardStates = ({
  stateForRender,
  stateMDContent,
  newCardId,
  whereToAdd,
  cardFromWhichAdd,
  markdownContent,
}: ICreateNewCardStates_Input) => {
  const newStateForRender = stateForRender.map((column) => column.map((card) => ({ ...card })));
  const newStateMDContent = stateMDContent.map((card) => ({ ...card }));

  const readyCardState = _.find(newStateForRender.flat(), { id: newCardId }) as IPreactState;

  const dataForCardView: IDataSelectedElem = {
    id: readyCardState.id,
    depth: readyCardState.depth,
    children: readyCardState.children,
    parents: readyCardState.parents,
    neighbors: readyCardState.neighbors,
    scrollChildren: readyCardState.scrollChildren,
  };

  const result = makeChainOnClick(stateForRender, dataForCardView);

  if (result) {
    const { newStatePreact, lastSelectedElem: lastElem } = result;

    let indexFromElement = _.findIndex(newStateMDContent, { id: cardFromWhichAdd });

    if (whereToAdd === 'down' || whereToAdd === 'right') indexFromElement += 1;

    newStateMDContent.splice(indexFromElement, 0, { id: newCardId, markdownContent });

    const newMD = getReadyMarkdown(newStateMDContent);

    return {
      lastElem,
      newStatePreact,
      newStateMDContent,
      newMD,
    };
  } else {
    return null;
  }
};

export const createCardData = ({ id, depth, markdownContent, parents, neighbors, isSelected, isEdit }: ICreateCardData_Input) => {
  const objState: IPreactState = {
    id,
    depth,
    markdownContent,
    children: [],
    scrollChildren: [],
    parents: parents ? [...parents] : [],
    neighbors: neighbors ? [...neighbors] : [],
    isSelected: isSelected ?? false,
    isEdit: isEdit ?? false,
    isParent: false,
    isChild: false,
    isNeighbor: false,
    scrollElement: isSelected ?? false,
  };

  return objState;
};

export const createEmptyHeader = (depth: number) => {
  return _.repeat('#', depth);
};

export const addCardToNeighbors = ({
  inputState,
  selectedId,
  newCardId,
  cardIndexInDepth,
  allNeighbors,
  chainNeighbors = [],
}: IAddCardToNeighbors_Input) => {
  for (const { id, neighbors } of inputState) {
    if (chainNeighbors.length && !_.find(chainNeighbors, { id })) {
      continue;
    }

    if (neighbors.includes(selectedId)) {
      neighbors.splice(cardIndexInDepth, 0, newCardId);
    } else {
      const index = allNeighbors.indexOf(selectedId);
      const closestNeighbor = allNeighbors[index - 1] ?? allNeighbors[index + 1];

      if (allNeighbors.indexOf(id) === 0) {
        neighbors.unshift(newCardId);
      } else if (neighbors.indexOf(closestNeighbor) === neighbors.length - 1) {
        neighbors.push(newCardId);
      } else {
        neighbors.splice(index, 0, newCardId);
      }
    }
  }
};
