import _ from 'lodash';
import { IDataChains, IDataSelectedElem, IPreactState, IStateMDContent } from '../redux/interfacesRedux';

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

  const newStatePreact = inputState.map((column) => {
    for (const card of column) {
      if (selectedId === card.id) {
        card.isSelected = true;
        card.scrollElement = true;
      } else {
        card.isSelected = false;
        card.isEdit = false;
        card.isChild = false;
        card.isNeighbor = false;
        card.isParent = false;
        card.scrollElement = false;
      }
      const child = _.find(children, { id: card.id });
      const scrollChild = _.find(scrollChildren, { id: card.id });
      const parent = _.find(parents, { id: card.id });
      if (child) card.isChild = true;
      if (scrollChild) card.scrollElement = true;
      if (parent) {
        card.isParent = true;
        card.scrollElement = true;
        scrollingChildren(card.scrollChildren, parents, scrollChildren);
      }
      if (neighbors.includes(card.id)) card.isNeighbor = true;
    }
    return column;
  });

  return { lastSelectedElem: { id: selectedId, depth: selectedDepth }, newStatePreact };
};

// export const calculatingNewMarkdown = (inputState: IStateMDContent[], selectedElem) => {
//   let result = '';

//     for (const { id, markdownContent } of inputState) {
//       if (id === lastSelectedElem.id) fullMD += result!.markdownContent;
//       else fullMD += markdownContent;
//     }
// }
