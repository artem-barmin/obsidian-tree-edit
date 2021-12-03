import { makeChainOnClick } from '../../scripts';
import { IAction, IState } from '../interfaces';
import { RootReducerCases } from '../reducers-case-logic';
import { RootReducerTypes } from '../types';

const { SET_EDITOR_CM, DELETE_CARD, CREATE_MAIN_STATES, CLICK_CARD_VIEW, CHANGE_FIRST_RENDER, CHANGE_CARD, ADD_CARD } =
  RootReducerTypes;
const { addCard, changeCard, deleteCard } = RootReducerCases;

const initialState: IState = {
  stateMDContent: [],
  stateForRender: [],
  stateOfNavigation: '',
  editorCM: null,
  lastSelectedElem: { id: '', depth: 0 },
};

export const rootReducer = (state = initialState, action: IAction) => {
  const { type, payload } = action;

  switch (type) {
    case CHANGE_FIRST_RENDER:
      return { ...state, stateOfNavigation: payload };
    case CREATE_MAIN_STATES:
      const { stateMDContent, preactState } = payload;
      return {
        ...state,
        stateForRender: [...preactState],
        stateMDContent: [...stateMDContent],
        lastSelectedElem: { ...{ id: '', depth: 0 } },
        stateOfNavigation: '',
      };
    case CLICK_CARD_VIEW:
      const result = makeChainOnClick(state.stateForRender, payload, state.lastSelectedElem);

      if (!result) return state;

      const { newStatePreact, lastSelectedElem } = result;

      return { ...state, lastSelectedElem: { ...lastSelectedElem }, stateForRender: [...newStatePreact] };
    case ADD_CARD:
      return addCard(state, payload);
    case CHANGE_CARD:
      return changeCard(state, payload);
    case DELETE_CARD:
      return deleteCard(state);
    case SET_EDITOR_CM:
      return { ...state, editorCM: payload };
    default:
      return state;
  }
};
