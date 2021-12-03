import _ from 'lodash';
import { nanoid } from 'nanoid';
import { createCardData, makeChainOnClick } from '../../../scripts';
import {
  IAddCard_Payload,
  IAddNewCardToNeighbors_Input,
  IAddNewCardToParents_Input,
  id,
  IDataSelectedElem,
  IState,
} from '../../interfaces';

const addNewCardToNeighbors = ({
  inputState,
  selectedId,
  newCardId,
  cardIndexInDepth,
  allNeighbors,
  chainNeighbors = [],
}: IAddNewCardToNeighbors_Input) => {
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

const addNewCardToParents = ({
  inputState,
  allParents,
  newCardId,
  selectedDepth,
  lastNeighborId,
}: IAddNewCardToParents_Input) => {
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

export const addCard = (state: IState, { whereToAdd, contentHTML, markdownContent }: IAddCard_Payload) => {
  const { lastSelectedElem, stateForRender, stateOfNavigation, stateMDContent } = state;
  const { id: selectedId, depth: selectedDepth } = lastSelectedElem;

  const selectedCardState = _.find(stateForRender.flat(), { id: selectedId });
  const { parents: parentsOfSelected, children: allChildren } = selectedCardState!;

  const newStateForRender = stateForRender.map((column) => column.map((card) => ({ ...card })));
  const newCardId = nanoid();

  let cardFromWhichAdd: id = '';

  if (whereToAdd === 'up' || whereToAdd === 'down') {
    const allNeighborsState = newStateForRender[selectedDepth - 1];
    const allNeighbors: id[] = _.map(allNeighborsState, 'id');
    const cardIndexInDepth = whereToAdd === 'up' ? allNeighbors.indexOf(selectedId) : allNeighbors.indexOf(selectedId) + 1;

    const objState = createCardData({
      id: newCardId,
      depth: selectedDepth,
      headerHTML: contentHTML,
      contentsHTML: [],
      markdownContent,
      parents: [...parentsOfSelected],
      neighbors: [],
    });

    if (selectedDepth !== 1) {
      const closestParentId = parentsOfSelected[parentsOfSelected.length - 1].id;
      const closestParent = _.find(stateForRender.flat(), { id: closestParentId });

      const { children: chainChildren } = closestParent!;
      const chainNeighbors = _.filter(chainChildren, { depth: selectedDepth });

      objState.neighbors.push(..._.map(chainNeighbors, 'id'));

      addNewCardToNeighbors({ inputState: allNeighborsState, selectedId, newCardId, cardIndexInDepth, allNeighbors });

      for (const { id, children } of newStateForRender.flat()) {
        if (_.find(parentsOfSelected, { id })) {
          children.splice(cardIndexInDepth, 0, { id: newCardId, depth: selectedDepth });
        }
      }
    } else {
      objState.neighbors.push(...allNeighbors);

      addNewCardToNeighbors({ inputState: allNeighborsState, selectedId, newCardId, cardIndexInDepth, allNeighbors });
    }

    allNeighborsState.splice(cardIndexInDepth, 0, { ...objState });
  } else {
    const allParents = [...parentsOfSelected, lastSelectedElem];
    const objState = createCardData({
      id: newCardId,
      depth: selectedDepth + 1,
      headerHTML: contentHTML,
      contentsHTML: [],
      markdownContent,
      parents: [...allParents],
      neighbors: [],
    });

    if (!allChildren.length) {
      if (stateForRender.length !== selectedDepth) {
        const allCardsSelection = stateForRender[selectedDepth - 1];
        const allNeighbors = stateForRender[selectedDepth];
        const selectedCardIndex = _.findIndex(allCardsSelection, { id: selectedId });

        let lastNeighborIndex: number = 0;

        for (let i = selectedCardIndex - 1; i >= 0; i--) {
          const { children } = allCardsSelection[i];

          if (children.length) {
            const neighbors = _.filter(children, { depth: selectedDepth + 1 });
            const lastNeighborId = neighbors[neighbors.length - 1].id;

            lastNeighborIndex = _.findIndex(allNeighbors, { id: lastNeighborId }) + 1;
            break;
          }
        }

        newStateForRender[selectedDepth].splice(lastNeighborIndex, 0, { ...objState });
      } else {
        newStateForRender.push([{ ...objState }]);
      }

      addNewCardToParents({ inputState: newStateForRender, allParents, newCardId, selectedDepth });
    } else {
      const allNeighborsState = newStateForRender[selectedDepth];
      const allNeighbors = _.map(allNeighborsState, 'id');

      const closestParent = _.find(stateForRender.flat(), { id: selectedId });
      const { children: chainChildren } = closestParent!;
      const chainNeighbors = _.filter(chainChildren, { depth: selectedDepth + 1 });

      const lastNeighborId = chainNeighbors[chainNeighbors.length - 1].id;
      const cardIndexInDepth = allNeighbors.indexOf(lastNeighborId) + 1;

      objState.neighbors.push(..._.map(chainNeighbors, 'id'));
      allNeighborsState.splice(cardIndexInDepth, 0, { ...objState });

      addNewCardToNeighbors({
        inputState: allNeighborsState,
        selectedId,
        newCardId,
        cardIndexInDepth,
        allNeighbors,
        chainNeighbors,
      });

      addNewCardToParents({ inputState: newStateForRender, allParents, newCardId, selectedDepth, lastNeighborId });
    }
  }

  const newCardState = _.find(newStateForRender.flat(), { id: newCardId });

  if (!newCardState) {
    return state;
  }

  const dataForCardView: IDataSelectedElem = {
    id: newCardState.id,
    depth: newCardState.depth,
    children: newCardState.children,
    parents: newCardState.parents,
    neighbors: newCardState.neighbors,
    scrollChildren: newCardState.scrollChildren,
  };

  const result = makeChainOnClick(newStateForRender, dataForCardView);

  if (result) {
    const { newStatePreact, lastSelectedElem: lastElem } = result;

    console.log(stateMDContent);

    return { ...state, lastSelectedElem: { ...lastElem }, stateForRender: [...newStatePreact] };
  } else {
    return state;
  }
};
