import { RootInterfaces } from '../interfaces';
import { IAction } from '../interfaces/IAction';
import { IDataSelectedElem } from '../interfaces/sharedInterfaces';
import { RootTypes } from '../types';
import { CREATE_EMPTY_CARD } from '../types/root-reducer.types';

const { ADD_CARD, CHANGE_CARD, CHANGE_FIRST_RENDER, CLICK_CARD_VIEW, CREATE_MAIN_STATES, DELETE_CARD } = RootTypes;

export type CreateMainStates = IAction<typeof CREATE_MAIN_STATES, RootInterfaces.ICreateMainStates>;

export type CreateEmptyCard = IAction<typeof CREATE_EMPTY_CARD, boolean>;

export type ChangeFirstRender = IAction<typeof CHANGE_FIRST_RENDER, string>;

export type ClickCardView = IAction<typeof CLICK_CARD_VIEW, IDataSelectedElem>;

export type AddCard = IAction<typeof ADD_CARD, RootInterfaces.IAddCard>;

export type ChangeCard = IAction<typeof CHANGE_CARD, RootInterfaces.IChangeCard>;

export type DeleteCard = IAction<typeof DELETE_CARD>;

export type RootAction =
  | CreateMainStates
  | CreateEmptyCard
  | ChangeFirstRender
  | ClickCardView
  | AddCard
  | ChangeCard
  | DeleteCard;
