export type id = string;
export type idChains = id[];

export interface ICardAction_Args {
  isEdit: boolean;
  newMD: string;
}

export interface IPreactState extends IHeadersData {
  children: IDataChains[];
  scrollChildren: IDataChains[];
  parents: IDataChains[];
  neighbors: idChains;
  isSelected: boolean;
  isEdit: boolean;
  isParent: boolean;
  isChild: boolean;
  isNeighbor: boolean;
  scrollElement: boolean;
}

export interface IDataSelectedElem {
  id: id;
  depth: number;
  children: IDataChains[];
  parents: IDataChains[];
  neighbors: idChains;
  scrollChildren: IDataChains[];
}

export interface IStateMDContent {
  id: id;
  markdownContent: string;
}

export interface IHeaderChains extends IDataChains {
  children: IHeaderChains[];
  parents: IDataChains[];
  neighbors: idChains;
}

export interface IHeadersData extends IDataChains {
  markdownContent: string;
}

export interface INearestNeighbor {
  inputState: IPreactState[];
  parentId?: id;
}

export interface ICreateCardData {
  id: id;
  depth: number;
  markdownContent: string;
  parents?: IDataChains[];
  neighbors?: idChains;
  isSelected?: boolean;
  isEdit?: boolean;
}

export interface IAddNewCardToParents_Input {
  inputState: IPreactState[][];
  allParents: IDataChains[];
  newCardId: id;
  selectedDepth: number;
  lastNeighborId?: id;
}

export interface IAddNewCardToNeighbors_Input {
  inputState: IPreactState[];
  selectedId: id;
  newCardId: id;
  cardIndexInDepth: number;
  allNeighbors: idChains;
  chainNeighbors?: IDataChains[];
}

export interface IDataChains {
  id: id;
  depth: number;
}
