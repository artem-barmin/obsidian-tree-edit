import _ from 'lodash';
import { nanoid } from 'nanoid';
import { IAddToStateVertically_Input, id, IDataChains, IPreactState, IStateRootReducer, RootInterfaces } from '../../interfaces';
import { addCardToNeighbors, copiedStateForRender, createCardData, createNewCardStates } from '../../scripts';

const addCardToState = ({
  inputState,
  lastSelectedElem,
  selectedCardState,
  whereToAdd,
  cardState,
}: IAddToStateVertically_Input) => {
  const { id: selectedId, depth: selectedDepth } = lastSelectedElem;
  const { parents: parentsOfSelected, children: allChildren } = selectedCardState;
  const newStateForRender = copiedStateForRender(inputState);
  const newCardId = cardState.id;

  const lastChild: IDataChains | undefined = _.last(allChildren);
  const allNeighborsState = newStateForRender[selectedDepth - 1];
  const allNeighbors: id[] = _.map(allNeighborsState, 'id');

  const cardFromWhichAdd = whereToAdd === 'down' && lastChild ? lastChild.id : selectedId;
  const cardIndexInDepth = whereToAdd === 'up' ? allNeighbors.indexOf(selectedId) : allNeighbors.indexOf(selectedId) + 1;

  if (selectedDepth !== 1) {
    const closestParentId = _.last(parentsOfSelected)!.id;
    const closestParent = _.find(newStateForRender.flat(), { id: closestParentId });

    const { children: chainChildren } = closestParent!;
    const chainNeighbors = _.filter(chainChildren, { depth: selectedDepth });

    cardState.neighbors.push(..._.map(chainNeighbors, 'id'));

    addCardToNeighbors({ inputState: allNeighborsState, selectedId, newCardId, cardIndexInDepth, allNeighbors });

    for (const { id, children } of newStateForRender.flat()) {
      if (_.find(parentsOfSelected, { id })) {
        children.splice(cardIndexInDepth, 0, { id: newCardId, depth: selectedDepth });
      }
    }
  } else {
    cardState.neighbors.push(...allNeighbors);

    addCardToNeighbors({ inputState: allNeighborsState, selectedId, newCardId, cardIndexInDepth, allNeighbors });
  }

  allNeighborsState.splice(cardIndexInDepth, 0, { ...cardState });

  return {
    newStateForRender,
    cardFromWhichAdd,
  };
};

export const addCardVertically = (state: IStateRootReducer, { whereToAdd, markdownContent }: RootInterfaces.IAddCard) => {
  const { lastSelectedElem, stateForRender, stateMDContent } = state;

  const selectedCardState = _.find(stateForRender.flat(), { id: lastSelectedElem.id }) as IPreactState;
  const { parents: parentsOfSelected } = selectedCardState;

  const newCardId = nanoid();

  const cardState = createCardData({
    id: newCardId,
    depth: lastSelectedElem.depth,
    markdownContent,
    parents: [...parentsOfSelected],
    neighbors: [],
    isEdit: true,
  });

  const { newStateForRender, cardFromWhichAdd } = addCardToState({
    lastSelectedElem,
    selectedCardState,
    inputState: stateForRender,
    whereToAdd,
    cardState,
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
      lastSelectedElem: { ...lastElem },
      stateForRender: [...newStatePreact],
      stateMDContent: [...newStateMDContent],
      stateOfNavigation: newMD,
      changedFromInterface: true,
    };
  } else {
    return state;
  }
};
