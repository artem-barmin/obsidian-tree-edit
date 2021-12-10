import { IPreactState, IStateMDContent } from '../sharedInterfaces';

export interface ICreateMainStates {
  stateMDContent: IStateMDContent[];
  preactState: IPreactState[][];
}

export interface IAddCard {
  whereToAdd: string;
  markdownContent: string;
}

export interface IChangeCard {
  isEdit: boolean;
  newContent: string;
}
