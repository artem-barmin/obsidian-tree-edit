export type id = string;

export type idChains = string[];

export interface IPreactState extends IStateInfo {
  children: IDataChains[];
  scrollChildren: IDataChains[];
  parents: idChains;
  neighbors: idChains;
  isParent: boolean;
  isChild: boolean;
  isNeighbor: boolean;
  scrollElement: boolean;
}

export interface IHeadersData extends IStateInfo {
  depth: number;
}

export interface IHeaderChains {
  id: id;
  depth: number;
  children: IHeaderChains[];
  parents: idChains;
  neighbors: idChains;
}

export interface IStateInfo {
  id: id;
  headerHTML: string;
  contentsHTML: string[];
}

export interface IDataChains {
  id: id;
  depth: number;
}
