import { TStore } from './redux/interfacesRedux';
import { id, IDataChains, idChains, IPreactState, VirtualDom } from './redux/interfacesRedux';

export interface IMainProvider_Props {
  store: TStore;
  markdown: string;
}

export interface IApp_Props {
  markdownText: string;
  fileName: string;
}

export interface IListColumnsDepths_Props {
  cards: IPreactState[];
}
export interface IDataSelectedElem {
  id: id;
  depth: number;
  children: IDataChains[];
  parents: IDataChains[];
  neighbors: idChains;
  scrollChildren: IDataChains[];
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
