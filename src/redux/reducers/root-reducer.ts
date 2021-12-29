import { RootAction } from '../actions-types/root-reducer.actions-types';
import { IStateRootReducer } from '../interfaces';
import { RootReducerCases } from '../reducers-case-logic';
import { RootTypes } from '../types';

const { createMainStates, clickCardView, addCardRight, addCardVertically, changeCard, deleteCard, createEmptyCard } =
  RootReducerCases;

const initialState: IStateRootReducer = {
  changedFromInterface: false,
  stateMDContent: [],
  stateForRender: [],
  stateOfNavigation: '',
  lastSelectedElem: { id: '', depth: 0 },
};

export const rootReducer = (state = initialState, action: RootAction) => {
  switch (action.type) {
    case RootTypes.CREATE_EMPTY_CARD:
      return createEmptyCard(state, action.payload!);

    case RootTypes.CHANGE_FIRST_RENDER:
      return { ...state, stateOfNavigation: action.payload! };

    case RootTypes.CREATE_MAIN_STATES:
      return createMainStates(state, action.payload!);

    case RootTypes.CLICK_CARD_VIEW:
      return clickCardView(state, action.payload!);

    case RootTypes.ADD_CARD:
      return addCardRight(state, action.payload!);

    case RootTypes.ADD_CARD_VERTICALLY:
      return addCardVertically(state, action.payload!);

    case RootTypes.CHANGE_CARD:
      return changeCard(state, action.payload!);

    case RootTypes.DELETE_CARD:
      return deleteCard(state);

    default:
      return state;
  }
};
