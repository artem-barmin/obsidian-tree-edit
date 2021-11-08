import { id, IDataChains, idChains, IPreactState } from './scripts/scriptInterfaces';

export interface IListColumnsDepths_Props {
  cards: IPreactState[];
  showAllChain: Function;
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
  showAllChain: Function;
  card: IPreactState;
}
