import { RootAction } from '../actions-types/root-reducer.actions-types';
import { IStateRootReducer } from '../interfaces';
import { RootReducerCases } from '../reducers-case-logic';
import { RootTypes } from '../types';

const { DELETE_CARD, CREATE_MAIN_STATES, CLICK_CARD_VIEW, CHANGE_FIRST_RENDER, CHANGE_CARD, ADD_CARD, CREATE_EMPTY_CARD } =
  RootTypes;
const { createMainStates, clickCardView, addCard, changeCard, deleteCard, createEmptyCard } = RootReducerCases;

const initialState: IStateRootReducer = {
  changedFromInterface: false,
  removeAllContent: false,
  stateMDContent: [],
  stateForRender: [],
  stateOfNavigation: '',
  lastSelectedElem: { id: '', depth: 0 },
};

export const rootReducer = (state = initialState, action: RootAction) => {
  switch (action.type) {
    case CREATE_EMPTY_CARD:
      return createEmptyCard(state, action.payload!);
    case CHANGE_FIRST_RENDER:
      return { ...state, stateOfNavigation: action.payload! };
    case CREATE_MAIN_STATES:
      return createMainStates(state, action.payload!);
    case CLICK_CARD_VIEW:
      return clickCardView(state, action.payload!);
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
