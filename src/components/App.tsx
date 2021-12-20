import _ from 'lodash';
import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useEmptyCard } from 'src/hooks';
import { IApp_Props } from '../interfaces';
import { RootReducerActions } from '../redux/actions';
import { id, IDataChains, IPreactState, IStateRootReducer } from '../redux/interfaces';
import { ColumnDepth } from './ColumnDepth';

const { createMainStates, clickCardView, createEmptyCard } = RootReducerActions;

export const App: FunctionComponent<IApp_Props> = ({ plugin }) => {
  const { columsWithCards, lastSelectedElem, stateOfNavigation, removeAllContent } = useSelector((state: IStateRootReducer) => {
    return {
      columsWithCards: state.stateForRender,
      lastSelectedElem: state.lastSelectedElem,
      stateOfNavigation: state.stateOfNavigation,
      removeAllContent: state.removeAllContent,
    };
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (plugin.headersExist) {
      dispatch(createMainStates(plugin.currentMd));
    } else {
      dispatch(createEmptyCard(false));
    }
  }, [plugin.currentMd, plugin.fileName, plugin.headersExist]);

  useEffect(() => {
    if (stateOfNavigation || (!stateOfNavigation && removeAllContent)) {
      (async () => {
        await plugin.app.vault.adapter.write(plugin.filePath, stateOfNavigation);
      })();
    }
  }, [stateOfNavigation, removeAllContent]);

  const onKeyDown = (e: KeyboardEvent, selectedElem: IDataChains, inputState: IPreactState[][]): void => {
    if (_.find(columsWithCards.flat(), { isEdit: true })) return;

    const code: string = e.code;

    if (code === 'ArrowUp' || code === 'ArrowDown') {
      e.preventDefault();

      const depthIndex: number = selectedElem.depth - 1;
      let currentIndex: number = 0;

      if (depthIndex >= 0) {
        for (const elem of inputState[depthIndex]) {
          if (elem.id === selectedElem.id) {
            currentIndex = inputState[depthIndex].indexOf(elem);
          }
        }

        const lastIndex: number = inputState[depthIndex].length - 1;

        if (code === 'ArrowUp' && currentIndex > 0) currentIndex--;
        else if (code === 'ArrowDown' && currentIndex < lastIndex) currentIndex++;

        const returnedItem: IPreactState = inputState[depthIndex][currentIndex];
        const { id, depth, children, parents, neighbors, scrollChildren } = returnedItem;

        dispatch(clickCardView({ id, depth, children, parents, neighbors, scrollChildren }));
      }
    } else if (code === 'ArrowLeft' || code === 'ArrowRight') {
      e.preventDefault();

      const parentOrChild = (parent: boolean, selectedId: id = selectedElem.id, state: IPreactState[][] = inputState) => {
        for (const { id, parents, scrollChildren } of state.flat()) {
          if (selectedId === id) {
            return parent ? parents[parents.length - 1] : scrollChildren[0];
          }
        }
      };
      const needElem = code === 'ArrowLeft' ? parentOrChild(true) : parentOrChild(false);

      if (needElem && inputState[needElem.depth - 1]) {
        for (const elem of inputState[needElem.depth - 1]) {
          if (needElem.id === elem.id) {
            const { id, depth, children, parents, neighbors, scrollChildren } = elem;

            dispatch(clickCardView({ id, depth, children, parents, neighbors, scrollChildren }));
          }
        }
      }
    }
  };

  return (
    <section className="section-columns" onKeyDown={(e) => onKeyDown(e, lastSelectedElem, columsWithCards)} tabIndex={0}>
      {columsWithCards.map((depths, index: number) => {
        return <ColumnDepth key={index} cards={depths} />;
      })}
    </section>
  );
};
