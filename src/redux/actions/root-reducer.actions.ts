import {
  AddCardRight,
  AddCardVertically,
  ChangeCard,
  ChangeFirstRender,
  ClickCardView,
  CreateEmptyCard,
  CreateMainStates,
  DeleteCard,
} from '../actions-types/root-reducer.actions-types';
import { IDataSelectedElem } from '../interfaces';
import { readyState } from '../scripts';
import { RootTypes } from '../types/';

type Dispatch<T, R = void> = (action: T) => R;

export const createMainStates = (markdown: string) => {
  return async (dispatch: Dispatch<CreateMainStates>) => {
    const { stateMDContent, preactState } = await readyState(markdown);

    dispatch({
      type: RootTypes.CREATE_MAIN_STATES,
      payload: { stateMDContent, preactState },
    });
  };
};

export const createEmptyCard = (removeContent: boolean): CreateEmptyCard => ({
  type: RootTypes.CREATE_EMPTY_CARD,
  payload: removeContent,
});

export const changeFirstRender = (filename: string): ChangeFirstRender => ({
  type: RootTypes.CHANGE_FIRST_RENDER,
  payload: filename,
});

export const clickCardView = (data: IDataSelectedElem): ClickCardView => ({
  type: RootTypes.CLICK_CARD_VIEW,
  payload: { ...data },
});

export const addCardRight = (whereToAdd: string, markdownContent: string): AddCardRight => ({
  type: RootTypes.ADD_CARD_RIGHT,
  payload: { whereToAdd, markdownContent },
});

export const addCardVertically = (whereToAdd: string, markdownContent: string): AddCardVertically => ({
  type: RootTypes.ADD_CARD_VERTICALLY,
  payload: { whereToAdd, markdownContent },
});

export const changeCard = (isEdit: boolean, newContent: string): ChangeCard => ({
  type: RootTypes.CHANGE_CARD,
  payload: { isEdit, newContent },
});

export const deleteCard = (): DeleteCard => ({ type: RootTypes.DELETE_CARD });
