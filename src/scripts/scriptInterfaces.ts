import { VNode } from 'preact';

export type VirtualDom = (VNode | string)[];

export type id = string;

export type idChains = id[];

export interface IPreactState extends IStateInfo {
  children: IDataChains[];
  scrollChildren: IDataChains[];
  parents: IDataChains[];
  neighbors: idChains;
  isSelected: boolean;
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
  parents: IDataChains[];
  neighbors: idChains;
}

export interface IStateInfo extends IDataChains {
  id: id;
  headerHTML: VirtualDom;
  contentsHTML: VirtualDom[];
}

export interface IDataChains {
  id: id;
  depth: number;
}
