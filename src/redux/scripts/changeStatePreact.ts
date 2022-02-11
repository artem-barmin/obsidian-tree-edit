import _ from 'lodash';
import { IDataChains, IDataSelectedElem, IPreactState } from '../interfaces';
import { copiedCardState } from './deepCopyStates';

export const makeChainOnClick = (
  inputState: IPreactState[][],
  selectedElem: IDataSelectedElem,
  lastSelectedElem?: IDataChains
) => {
  const { id: selectedId, depth: selectedDepth, children, parents, neighbors, scrollChildren } = selectedElem;

  if (lastSelectedElem?.id === selectedId) return null;

  const parentsSelectedElem: IDataChains[] = [];

  const stateWithFlags: IPreactState[][] = inputState.map((column) => {
    return column.map((card) => {
      const newCard = copiedCardState(card);

      if (selectedId === card.id) {
        newCard.isSelected = true;
        newCard.scrollElement = true;
      } else {
        newCard.isSelected = false;
        newCard.isEdit = false;
        newCard.isChild = false;
        newCard.isNeighbor = false;
        newCard.isParent = false;
        newCard.scrollElement = false;
      }

      const child = _.find(children, { id: card.id });
      const scrollChild = _.find(scrollChildren, { id: card.id });
      const parent = _.find(parents, { id: card.id });

      if (child) newCard.isChild = true;
      if (scrollChild) newCard.scrollElement = true;
      if (neighbors.includes(card.id)) newCard.isNeighbor = true;

      if (parent) {
        newCard.isParent = true;
        newCard.scrollElement = true;

        parentsSelectedElem.push({ id: card.id, depth: card.depth });
      }

      return newCard;
    });
  });

  const newStatePreact = stateWithFlags.map((column) => {
    return column.map((card) => {
      if (_.find(parents, { id: card.id })) {
        return {
          ...card,
          scrollChildren: card.scrollChildren.map((scroll) => {
            for (const parent of parentsSelectedElem) {
              if (scroll.depth === parent.depth) {
                return { ...scroll, id: parent.id };
              }
            }

            return scroll.depth === selectedDepth ? { ...scroll, id: selectedId } : scroll;
          }),
        };
      }

      return card;
    });
  });

  return { lastSelectedElem: { id: selectedId, depth: selectedDepth }, newStatePreact };
};
