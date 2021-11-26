import { CARD_ACTION, CHANGE_FIRST_RENDER, CLICK_CARD_VIEW, CREATE_MAIN_STATES, DELETE_CARD, SET_EDITOR_CM } from './types';
import { newCardContent, readyState } from 'src/scripts/statePreactTree';
import { ICardAction_Args, IDataSelectedElem } from './interfacesRedux';

export const createMainStates = (markdown: string) => {
  return async (dispatch: Function) => {
    const { stateMDContent, preactState } = await readyState(markdown);

    dispatch({ type: CREATE_MAIN_STATES, payload: { stateMDContent, preactState } });
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
export const deleteCard = () => ({ type: DELETE_CARD });
