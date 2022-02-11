import { RootInterfaces } from '../interfaces';
import { IAction } from '../interfaces/IAction';
import { IDataSelectedElem } from '../interfaces/sharedInterfaces';
import { RootTypes } from '../types';

export type CreateMainStates = IAction<typeof RootTypes.CREATE_MAIN_STATES, RootInterfaces.ICreateMainStates>;

export type CreateEmptyCard = IAction<typeof RootTypes.CREATE_EMPTY_CARD, boolean>;

export type ChangeFirstRender = IAction<typeof RootTypes.CHANGE_FIRST_RENDER, string>;

export type ClickCardView = IAction<typeof RootTypes.CLICK_CARD_VIEW, IDataSelectedElem>;

export type AddCardRight = IAction<typeof RootTypes.ADD_CARD_RIGHT, RootInterfaces.IAddCard>;

export type AddCardVertically = IAction<typeof RootTypes.ADD_CARD_VERTICALLY, RootInterfaces.IAddCard>;

export type ChangeCard = IAction<typeof RootTypes.CHANGE_CARD, RootInterfaces.IChangeCard>;

export type DeleteCard = IAction<typeof RootTypes.DELETE_CARD>;

export type RootAction =
  | CreateMainStates
  | CreateEmptyCard
  | ChangeFirstRender
  | ClickCardView
  | AddCardRight
  | ChangeCard
  | DeleteCard
  | AddCardVertically;
