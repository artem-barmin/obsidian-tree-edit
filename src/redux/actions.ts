import { IDataSelectedElem } from 'src/interfaces';
import { newCardContent, readyState } from 'src/scripts/statePreactTree';
import { ICardAction_Args } from './interfacesRedux';
import { CARD_ACTION, CHANGE_FIRST_RENDER, CLICK_CARD_VIEW, CREATE_PREACT_STATE, SET_EDITOR_CM } from './types';

export const createPreactState = (markdownText: string) => {
  return async (dispatch: Function) => {
    const state = await readyState(markdownText);

    dispatch({ type: CREATE_PREACT_STATE, payload: [...state] });
  };
};

export const cardAction = (data: ICardAction_Args) => {
  return async (dispatch: Function) => {
    const { isEdit, newMD } = data;

    const newContent = !isEdit && newMD ? await newCardContent(newMD) : null;

    dispatch({ type: CARD_ACTION, payload: { isEdit, newContent } });
  };
};

export const changeFirstRender = (filename: string) => ({ type: CHANGE_FIRST_RENDER, payload: filename });
export const clickCardView = (data: IDataSelectedElem) => ({ type: CLICK_CARD_VIEW, payload: { ...data } });
export const setEditorCM = (editor: CodeMirror.Editor) => ({ type: SET_EDITOR_CM, payload: editor });
