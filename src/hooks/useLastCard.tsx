import { useSelector } from 'react-redux';
import { IStateRootReducer } from '../redux/interfaces';

export const useLastCard = () => {
  const { stateForRender, lastSelectedElem } = useSelector((state: IStateRootReducer) => {
    return {
      stateForRender: state.stateForRender,
      lastSelectedElem: state.lastSelectedElem,
    };
  });

  return lastSelectedElem.depth === 1 && stateForRender[0].length === 1;
};
