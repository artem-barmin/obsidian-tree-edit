import { IPreactState, VirtualDom } from './redux/interfacesRedux';
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

export interface ICardActions_Props {
  isSelected: boolean;
  isEdit: boolean;
}

export interface ICardCodeMirror_Props {
  markdownContent: string;
  depth: number;
}
