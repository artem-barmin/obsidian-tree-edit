import { IStateRootReducer, RootInterfaces } from '../../interfaces';
import { getReadyMarkdown } from '../../scripts';

export const createMainStates = (state: IStateRootReducer, { preactState, stateMDContent }: RootInterfaces.ICreateMainStates) => {
  return {
    ...state,
    stateForRender: [...preactState],
    stateMDContent: [...stateMDContent],
    lastSelectedElem: { ...{ id: '', depth: 0 } },
    stateOfNavigation: getReadyMarkdown(stateMDContent),
  };
};
