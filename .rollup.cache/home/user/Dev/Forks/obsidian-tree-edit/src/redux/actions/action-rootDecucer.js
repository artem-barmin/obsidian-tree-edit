import { convertASTtoData, newCardContent, readyState } from '../../scripts';
import { RootReducerTypes } from '../types/';
const { ADD_CARD, CHANGE_CARD, CHANGE_FIRST_RENDER, CLICK_CARD_VIEW, CREATE_MAIN_STATES, DELETE_CARD, SET_EDITOR_CM } = RootReducerTypes;
export const createMainStates = (markdown) => {
    return async (dispatch) => {
        const { stateMDContent, preactState } = await readyState(markdown);
        dispatch({ type: CREATE_MAIN_STATES, payload: { stateMDContent, preactState } });
    };
};
export const changeCard = (data) => {
    return async (dispatch) => {
        const { isEdit, newMD } = data;
        const newContent = !isEdit && newMD ? await newCardContent(newMD) : null;
        dispatch({ type: CHANGE_CARD, payload: { isEdit, newContent } });
    };
};
export const addCard = (whereToAdd, astHeader) => {
    return async (dispatch) => {
        const { contentHTML, markdownContent } = await convertASTtoData(astHeader);
        dispatch({ type: ADD_CARD, payload: { whereToAdd, contentHTML, markdownContent } });
    };
};
export const changeFirstRender = (filename) => ({ type: CHANGE_FIRST_RENDER, payload: filename });
export const clickCardView = (data) => ({ type: CLICK_CARD_VIEW, payload: { ...data } });
export const setEditorCM = (editor) => ({ type: SET_EDITOR_CM, payload: editor });
export const deleteCard = () => ({ type: DELETE_CARD });
//# sourceMappingURL=action-rootDecucer.js.map