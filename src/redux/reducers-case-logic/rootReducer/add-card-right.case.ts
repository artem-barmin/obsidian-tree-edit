import _ from 'lodash';
import { nanoid } from 'nanoid';
import {
  IAddCardToParents_Input,
  IAddToStateRight_Input,
  IPreactState,
  IStateRootReducer,
  RootInterfaces,
} from '../../interfaces';
import { addCardToNeighbors, copiedCardState, copiedStateForRender, createCardData, createNewCardStates } from '../../scripts';

const addCardToParents = ({ inputState, allParents, newCardId, selectedDepth, lastNeighborId }: IAddCardToParents_Input) => {
  for (const { id, children, scrollChildren } of inputState.flat()) {
    if (_.find(allParents, { id })) {
      if (lastNeighborId) {
        const index = _.findIndex(children, { id: lastNeighborId }) + 1;
        children.splice(index, 0, { id: newCardId, depth: selectedDepth + 1 });
      } else {
        children.push({ id: newCardId, depth: selectedDepth + 1 });
      }

      scrollChildren.push({ id: newCardId, depth: selectedDepth + 1 });
    }
  }
};

const addCardToState = ({ inputState, lastSelectedElem, allChildren, cardState, allParents }: IAddToStateRight_Input) => {
  const { id: selectedId, depth: selectedDepth } = lastSelectedElem;

  const newStateForRender = copiedStateForRender(inputState);
  const newCardState = copiedCardState(cardState);

  const newCardId = cardState.id;

  let cardFromWhichAdd = '';

  if (!allChildren.length) {
    if (newStateForRender.length !== selectedDepth) {
      const allCardsSelection = newStateForRender[selectedDepth - 1];
      const allNeighbors = newStateForRender[selectedDepth];
      const selectedCardIndex = _.findIndex(allCardsSelection, { id: selectedId });

      let lastNeighborIndex: number = 0;

      for (let i = selectedCardIndex - 1; i >= 0; i--) {
        const { children } = allCardsSelection[i];

        if (children.length) {
          const neighbors = _.filter(children, { depth: selectedDepth + 1 });
          const lastNeighborId = _.last(neighbors)!.id;

          lastNeighborIndex = _.findIndex(allNeighbors, { id: lastNeighborId }) + 1;
          break;
        }
      }

      allNeighbors.splice(lastNeighborIndex, 0, { ...newCardState });
    } else {
      newStateForRender.push([{ ...newCardState }]);
    }

    cardFromWhichAdd = selectedId;

    addCardToParents({ inputState: newStateForRender, allParents, newCardId, selectedDepth });
  } else {
    const allNeighborsState = newStateForRender[selectedDepth];
    const allNeighbors = _.map(allNeighborsState, 'id');

    const closestParent = _.find(newStateForRender.flat(), { id: selectedId });
    const chainNeighbors = _.filter(closestParent!.children, { depth: selectedDepth + 1 });

    const lastNeighborId = _.last(chainNeighbors)!.id;
    const cardIndexInDepth = allNeighbors.indexOf(lastNeighborId) + 1;

    cardFromWhichAdd = lastNeighborId;
    newCardState.neighbors.push(..._.map(chainNeighbors, 'id'));
    allNeighborsState.splice(cardIndexInDepth, 0, { ...newCardState });

    addCardToNeighbors({
      inputState: allNeighborsState,
      selectedId,
      newCardId,
      cardIndexInDepth,
      allNeighbors,
      chainNeighbors,
    });

    addCardToParents({ inputState: newStateForRender, allParents, newCardId, selectedDepth, lastNeighborId });
  }

  return {
    newStateForRender,
    cardFromWhichAdd,
  };
};

export const addCardRight = (state: IStateRootReducer, { whereToAdd, markdownContent }: RootInterfaces.IAddCard) => {
  const { lastSelectedElem, stateForRender, stateMDContent } = state;

  const selectedCardState = _.find(stateForRender.flat(), { id: lastSelectedElem.id }) as IPreactState;
  const { parents: parentsOfSelected, children: allChildren } = selectedCardState!;

  const newCardId = nanoid();

  const allParents = [...parentsOfSelected, lastSelectedElem];

  const cardState = createCardData({
    id: newCardId,
    depth: lastSelectedElem.depth + 1,
    markdownContent,
    parents: [...allParents],
    neighbors: [],
    isEdit: true,
  });

  const { newStateForRender, cardFromWhichAdd } = addCardToState({
    lastSelectedElem,
    allChildren,
    inputState: stateForRender,
    cardState,
    allParents,
  });

  const readyStates = createNewCardStates({
    stateForRender: newStateForRender,
    stateMDContent,
    newCardId,
    whereToAdd,
    cardFromWhichAdd,
    markdownContent,
  });

  if (readyStates) {
    const { newStatePreact, newStateMDContent, lastElem, newMD } = readyStates;

    return {
      ...state,
      lastSelectedElem: lastElem,
      stateForRender: newStatePreact,
      stateMDContent: newStateMDContent,
      stateOfNavigation: newMD,
      changedFromInterface: true,
    };
  } else {
    return state;
  }
};
