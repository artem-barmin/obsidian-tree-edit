import {
  AddCard,
  ChangeCard,
  ChangeFirstRender,
  ClickCardView,
  CreateMainStates,
  DeleteCard,
} from '../actions-types/root-Reducer.actions-types';
import { IDataSelectedElem } from '../interfaces';
import { readyState } from '../scripts';
import { RootTypes } from '../types/';

const { ADD_CARD, CHANGE_CARD, CHANGE_FIRST_RENDER, CLICK_CARD_VIEW, CREATE_MAIN_STATES, DELETE_CARD } = RootTypes;

type Dispatch<T, R = void> = (action: T) => R;

export const createMainStates = (markdown: string) => {
  return async (dispatch: Dispatch<CreateMainStates>) => {
    const { stateMDContent, preactState } = await readyState(markdown);

    dispatch({ type: CREATE_MAIN_STATES, payload: { stateMDContent, preactState } });
  };
};

export const changeFirstRender = (filename: string): ChangeFirstRender => ({
  type: CHANGE_FIRST_RENDER,
  payload: filename,
});

export const clickCardView = (data: IDataSelectedElem): ClickCardView => ({
  type: CLICK_CARD_VIEW,
  payload: { ...data },
});

export const addCard = (whereToAdd: string, markdownContent: string): AddCard => ({
  type: ADD_CARD,
  payload: { whereToAdd, markdownContent },
});

export const changeCard = (isEdit: boolean, newContent: string): ChangeCard => ({
  type: CHANGE_CARD,
  payload: { isEdit, newContent },
});

export const deleteCard = (): DeleteCard => ({ type: DELETE_CARD });
