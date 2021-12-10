import { IPreactState } from './redux/interfaces/sharedInterfaces';
import TreeEditView from './treeEdit-view';

export interface IApp_Props {
  plugin: TreeEditView;
}

export interface IListColumnsDepths_Props {
  cards: IPreactState[];
}

export interface ICard_Props {
  card: IPreactState;
}

export interface ICardView_Props {
  depth: number;
  markdownContent: string;
}

export interface ICardButtons_Props {
  isSelected: boolean;
  isEdit: boolean;
  depth: number;
  editorValue: string;
}

export interface ICardActions_Props {
  isEdit: boolean;
  depth: number;
  addNewCard: Function;
  editorValue: string;
}

export interface ICardCodeMirror_Props {
  markdownContent: string;
  depth: number;
  editorValue: string;
  setEditorValue: Function;
}
