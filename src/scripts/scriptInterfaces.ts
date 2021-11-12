import { VNode } from 'preact';

export type VirtualDom = (VNode | string)[];

export type id = string;

export type idChains = id[];

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

export interface IHeaderChains extends IDataChains {
  children: IHeaderChains[];
  parents: IDataChains[];
  neighbors: idChains;
}

export interface IHeadersData extends IDataChains {
  headerHTML: VirtualDom;
  contentsHTML: VirtualDom[];
  headerMD: string;
  contentsMD: string[];
}

export interface IDataChains {
  id: id;
  depth: number;
}
