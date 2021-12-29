import _ from 'lodash';
import { IDataChains, IDataSelectedElem, IPreactState } from '../interfaces';

export const makeChainOnClick = (
  inputState: IPreactState[][],
  selectedElem: IDataSelectedElem,
  lastSelectedElem?: IDataChains
) => {
  const { id: selectedId, depth: selectedDepth, children, parents, neighbors, scrollChildren } = selectedElem;

  if (lastSelectedElem?.id === selectedId) return null;

  const scrollingChildren = (scrollArr: IDataChains[], clickParents: IDataChains[], clickScrolls: IDataChains[]) => {
    const chainPositions = (inputArr: IDataChains[], toArr: IDataChains[], scrollEl: IDataChains): void => {
      inputArr.forEach((elem) => {
        if (scrollEl.depth === elem.depth) {
          toArr[toArr.indexOf(scrollEl)] = elem;
        }
      });
    };
    scrollArr.forEach((scroll) => {
      if (scroll.depth === selectedDepth) {
        scrollArr[scrollArr.indexOf(scroll)] = { id: selectedId, depth: selectedDepth };
      }
      chainPositions(clickParents, scrollArr, scroll);
      chainPositions(clickScrolls, scrollArr, scroll);
    });
  };

  const newStatePreact: IPreactState[][] = inputState.map((column) => {
    return column.map((card) => {
      const newCard = Object.assign({}, card);

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
      if (parent) {
        newCard.isParent = true;
        newCard.scrollElement = true;
        scrollingChildren(newCard.scrollChildren, parents, scrollChildren);
      }
      if (neighbors.includes(card.id)) newCard.isNeighbor = true;

      return newCard;
    });
  });

  return { lastSelectedElem: { id: selectedId, depth: selectedDepth }, newStatePreact };
};
