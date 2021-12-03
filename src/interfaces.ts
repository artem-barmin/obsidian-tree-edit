import { IPreactState, VirtualDom } from './redux/interfaces/interfacesRedux';
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
  header: VirtualDom;
  contents: VirtualDom[];
}

export interface ICardButtons_Props {
  isSelected: boolean;
  isEdit: boolean;
  depth: number;
}

export interface ICardActions_Props {
  isEdit: boolean;
  addNewCard: Function;
}

export interface ICardCodeMirror_Props {
  markdownContent: string;
  depth: number;
}
