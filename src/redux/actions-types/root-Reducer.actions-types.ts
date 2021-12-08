import { IAction } from '../interfaces/IAction';
import { IDataSelectedElem, INewCardContent, IPreactState, IStateMDContent, VirtualDom } from '../interfaces/interfacesRedux';
import { RootTypes } from '../types';

const { ADD_CARD, CHANGE_CARD, CHANGE_FIRST_RENDER, CLICK_CARD_VIEW, CREATE_MAIN_STATES, DELETE_CARD } = RootTypes;

export type CreateMainStates = IAction<
  typeof CREATE_MAIN_STATES,
  { stateMDContent: IStateMDContent[]; preactState: IPreactState[][] }
>;

export type ChangeFirstRender = IAction<typeof CHANGE_FIRST_RENDER, string>;

export type ClickCardView = IAction<typeof CLICK_CARD_VIEW, IDataSelectedElem>;

export type AddCard = IAction<typeof ADD_CARD, { whereToAdd: string; contentHTML: VirtualDom; markdownContent: string }>;

export type ChangeCard = IAction<typeof CHANGE_CARD, { isEdit: boolean; newContent: INewCardContent | null }>;

export type DeleteCard = IAction<typeof DELETE_CARD>;

export type RootAction = CreateMainStates | ChangeFirstRender | ClickCardView | AddCard | ChangeCard | DeleteCard;
