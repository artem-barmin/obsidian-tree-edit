import { nanoid } from 'nanoid';
import { IStateRootReducer } from '../../interfaces';
import { createCardData } from '../../scripts';

export const createEmptyCard = (state: IStateRootReducer, removeContent: boolean) => {
  const headerId = nanoid();

  const cardData = { id: headerId, markdownContent: '#\n\n' };
  const cardState = createCardData({ ...cardData, depth: 1, isSelected: true });

  return {
    ...state,
    stateForRender: Array.from([[{ ...cardState }]]),
    stateMDContent: Array.from([{ ...cardData }]),
    lastSelectedElem: { ...{ id: headerId, depth: 1 } },
    stateOfNavigation: '',
    removeAllContent: removeContent,
  };
};
