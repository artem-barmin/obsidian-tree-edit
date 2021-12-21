import { useSelector } from 'react-redux';
import { IStateRootReducer } from '../redux/interfaces';

export const useEmptyCard = () => {
  const { stateOfNavigation, stateForRender } = useSelector((state: IStateRootReducer) => {
    return {
      stateOfNavigation: state.stateOfNavigation,
      stateForRender: state.stateForRender,
    };
  });

  return !stateOfNavigation && stateForRender.length === 1;
};
