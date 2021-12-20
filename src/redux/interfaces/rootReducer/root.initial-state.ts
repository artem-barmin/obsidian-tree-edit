import { IDataChains, IPreactState, IStateMDContent } from '../sharedInterfaces';

export interface IStateRootReducer {
  removeAllContent: boolean;
  stateMDContent: IStateMDContent[];
  stateForRender: IPreactState[][];
  stateOfNavigation: string;
  lastSelectedElem: IDataChains;
}
