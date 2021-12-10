import { IDataChains, IPreactState, IStateMDContent } from '../sharedInterfaces';

export interface IStateRootReducer {
  stateMDContent: IStateMDContent[];
  stateForRender: IPreactState[][];
  stateOfNavigation: string;
  lastSelectedElem: IDataChains;
}
