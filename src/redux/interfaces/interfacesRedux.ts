import { VNode } from 'preact';
import { Store } from 'redux';

export type TStore = Store<IState, IAction>;
export type VirtualDom = (VNode | string)[];
export type id = string;
export type idChains = id[];

export interface IState {
  stateMDContent: IStateMDContent[];
  stateForRender: IPreactState[][];
  stateOfNavigation: string;
  editorCM: CodeMirror.Editor | null;
  lastSelectedElem: IDataChains;
}

export interface IAction {
  type: string;
  payload: any;
}

export interface ICardAction_Args {
  isEdit: boolean;
  newMD: string | undefined;
}

export interface ICardAction_Payload {
  isEdit: boolean;
  newContent: INewCardContent | null;
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
  headerHTML: VirtualDom;
  contentsHTML: VirtualDom[];
  markdownContent: string;
}

export interface IDataChains {
  id: id;
  depth: number;
}

export interface INewCardContent {
  headerHTML: VirtualDom;
  contentsHTML: VirtualDom[];
  markdownContent: string;
}

export interface INearestNeighbor {
  inputState: IPreactState[];
  parentId?: id;
}

export interface ICreateCardData extends INewCardContent {
  id: id;
  depth: number;
  parents?: IDataChains[];
  neighbors?: idChains;
}

export interface IAddCard_Payload {
  whereToAdd: string;
  contentHTML: VirtualDom;
  markdownContent: string;
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
