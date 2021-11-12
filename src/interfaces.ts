import { id, IDataChains, idChains, IPreactState, VirtualDom } from './scripts/scriptInterfaces';

export interface IListColumnsDepths_Props {
  cards: IPreactState[];
  showAllChain: Function;
  cardAction: Function;
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
  showAllChain: Function;
  cardAction: Function;
}

export interface ICardView_Props {
  header: VirtualDom;
  contents: VirtualDom[];
}

export interface ICardActions_Props {
  isSelected: boolean;
  isEdit: boolean;
  cardAction: Function;
}

export interface ICardCodeMirror_Props {
  headerMD: string;
  contentsMD: string[];
}
