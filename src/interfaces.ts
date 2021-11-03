import { IPreactState } from './scripts/scriptInterfaces';

export interface IListColumnsDepths_Props {
  cards: IPreactState[];
  showAllChildren: Function;
}

export interface ICard_Props {
  showAllChildren: Function;
  card: IPreactState;
}
