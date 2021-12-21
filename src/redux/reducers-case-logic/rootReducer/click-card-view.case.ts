import { IDataSelectedElem, IStateRootReducer } from '../../interfaces';
import { makeChainOnClick } from '../../scripts';

export const clickCardView = (state: IStateRootReducer, payload: IDataSelectedElem) => {
  const result = makeChainOnClick(state.stateForRender, payload, state.lastSelectedElem);

  if (!result) return state;

  const { newStatePreact, lastSelectedElem } = result;

  return { ...state, lastSelectedElem: { ...lastSelectedElem }, stateForRender: [...newStatePreact] };
};
