import _ from 'lodash';
import { id, IDataChains, IDataSelectedElem, INearestNeighbor_Input, IPreactState, IStateRootReducer } from '../../interfaces';
import { getReadyMarkdown, makeChainOnClick } from '../../scripts';

const nearestNeighbor = ({ inputState, lastSelectedElem, allNeighborsId, parentId }: INearestNeighbor_Input) => {
  const neigborsId: id[] = [];

  if (parentId) {
    const { children } = _.find(inputState, { id: parentId }) as IPreactState;
    const neighbors = _.filter(children, { depth: lastSelectedElem.depth });

    neighbors.length > 1 ? neigborsId.push(..._.map(neighbors, 'id')) : neigborsId.push(...allNeighborsId);
  } else {
    neigborsId.push(..._.map(inputState, 'id'));
  }

  const index = neigborsId.indexOf(lastSelectedElem.id);
  return neigborsId[index - 1] ?? neigborsId[index + 1];
};

export const deleteCard = (state: IStateRootReducer) => {
  const { stateForRender, stateMDContent, lastSelectedElem } = state;
  const { id: selectedId, depth: selectedDepth } = lastSelectedElem;

  const allNeighborsState = stateForRender[selectedDepth - 1];
  const allNeighborsId = _.map(allNeighborsState, 'id');
  const deleteChildren: IDataChains[] = [];

  let dataForCardView: IDataSelectedElem;
  let closestNeighbor: id = '';
  let closestParent: id = '';

  for (const { id, children, parents } of allNeighborsState) {
    if (id === selectedId) {
      if (parents.length) {
        const parentId = parents[parents.length - 1].id;

        allNeighborsState.length > 1
          ? (closestNeighbor = nearestNeighbor({ inputState: stateForRender.flat(), lastSelectedElem, allNeighborsId, parentId }))
          : (closestParent = parentId);
      } else {
        closestNeighbor = nearestNeighbor({ inputState: stateForRender[0], lastSelectedElem, allNeighborsId });
      }

      deleteChildren.push(...children);
    }
  }

  const withoutDeletedCards = stateForRender.map((column) =>
    column.filter(({ id, depth, children, parents, neighbors, scrollChildren }) => {
      if (id === selectedId) return false;
      else if (_.find(deleteChildren, { id })) return false;
      else if ((closestNeighbor || closestParent) === id) {
        dataForCardView = Object.assign({}, { id, depth, children, parents, neighbors, scrollChildren });
        return true;
      } else {
        return true;
      }
    })
  );

  const noMentionsInChain = withoutDeletedCards.map((column) => {
    return column.map((card) => {
      return {
        ...card,
        children: card.children.filter(({ id }) => !(id === selectedId || _.find(deleteChildren, { id }))),
        scrollChildren: card.scrollChildren.filter(({ id }) => !(id === selectedId || _.find(deleteChildren, { id }))),
        neighbors: card.neighbors.filter((id) => id !== selectedId),
      };
    });
  });

  const noEmptyColumns = noMentionsInChain.filter((column) => column.length);

  const result = makeChainOnClick(noEmptyColumns, dataForCardView!);

  if (result) {
    const { newStatePreact, lastSelectedElem: lastElem } = result;

    const newStateMDContent = stateMDContent.filter(({ id }) => !(id === selectedId || _.find(deleteChildren, { id })));

    const newMD = getReadyMarkdown(newStateMDContent);

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
