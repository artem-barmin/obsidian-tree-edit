import { makeChainOnClick } from '../../scripts';
import { IStateRootReducer, RootAction } from '../interfaces';
import { RootReducerCases } from '../reducers-case-logic';
import { RootReducerTypes } from '../types';

const { DELETE_CARD, CREATE_MAIN_STATES, CLICK_CARD_VIEW, CHANGE_FIRST_RENDER, CHANGE_CARD, ADD_CARD } = RootReducerTypes;
const { addCard, changeCard, deleteCard } = RootReducerCases;

const initialState: IStateRootReducer = {
  stateMDContent: [],
  stateForRender: [],
  stateOfNavigation: '',
  lastSelectedElem: { id: '', depth: 0 },
};

export const rootReducer = (state = initialState, action: RootAction) => {
  switch (action.type) {
    case CHANGE_FIRST_RENDER:
      return { ...state, stateOfNavigation: action.payload! };
    case CREATE_MAIN_STATES:
      const { stateMDContent, preactState } = action.payload!;
      return {
        ...state,
        stateForRender: [...preactState],
        stateMDContent: [...stateMDContent],
        lastSelectedElem: { ...{ id: '', depth: 0 } },
        stateOfNavigation: '',
      };
    case CLICK_CARD_VIEW:
      const result = makeChainOnClick(state.stateForRender, action.payload!, state.lastSelectedElem);

      if (!result) return state;

      const { newStatePreact, lastSelectedElem } = result;

      return { ...state, lastSelectedElem: { ...lastSelectedElem }, stateForRender: [...newStatePreact] };
    case ADD_CARD:
      return addCard(state, action.payload!);
    case CHANGE_CARD:
      return changeCard(state, action.payload!);
    case DELETE_CARD:
      return deleteCard(state);
    default:
      return state;
  }
};
