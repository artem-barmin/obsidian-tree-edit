import { IDataChains, IPreactState, IStateMDContent } from '../sharedInterfaces';

export interface IStateRootReducer {
  changedFromInterface: boolean;
  removeAllContent: boolean;
  stateMDContent: IStateMDContent[];
  stateForRender: IPreactState[][];
  stateOfNavigation: string;
  lastSelectedElem: IDataChains;
}
