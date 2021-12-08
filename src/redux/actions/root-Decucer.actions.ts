import { convertASTtoData, newCardContent, readyState } from '../scripts';
import {
  AddCard,
  ChangeCard,
  ChangeFirstRender,
  ClickCardView,
  CreateMainStates,
  DeleteCard,
} from '../actions-types/root-Reducer.actions-types';
import { ICardAction_Args, IDataSelectedElem } from '../interfaces';
import { RootTypes } from '../types/';

const { ADD_CARD, CHANGE_CARD, CHANGE_FIRST_RENDER, CLICK_CARD_VIEW, CREATE_MAIN_STATES, DELETE_CARD } = RootTypes;

type Dispatch<T, R = void> = (action: T) => R;

export const createMainStates = (markdown: string) => {
  return async (dispatch: Dispatch<CreateMainStates>) => {
    const { stateMDContent, preactState } = await readyState(markdown);

    dispatch({ type: CREATE_MAIN_STATES, payload: { stateMDContent, preactState } });
  };
};

export const changeCard = (data: ICardAction_Args) => {
  return async (dispatch: Dispatch<ChangeCard>) => {
    const { isEdit, newMD } = data;

    const newContent = !isEdit && newMD ? await newCardContent(newMD) : null;

    dispatch({ type: CHANGE_CARD, payload: { isEdit, newContent } });
  };
};

export const addCard = (whereToAdd: string, astHeader: any) => {
  return async (dispatch: Dispatch<AddCard>) => {
    const { contentHTML, markdownContent } = await convertASTtoData(astHeader);

    dispatch({ type: ADD_CARD, payload: { whereToAdd, contentHTML, markdownContent } });
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

export const deleteCard = (): DeleteCard => ({ type: DELETE_CARD });
