import { h, FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import { ListColumnsDepths } from './ListColumnsDepths';
import { id, IDataChains, IPreactState } from '../redux/interfacesRedux';
import { clickCardView, createMainStates } from 'src/redux/actions';
import { IState } from 'src/redux/interfacesRedux';
import { IApp_Props } from 'src/interfaces';

export const App: FunctionComponent<IApp_Props> = ({ plugin }) => {
  const { columsWithCards, lastSelectedElem, stateOfNavigation } = useSelector(
    ({ stateForRender, lastSelectedElem, stateOfNavigation }: IState) => {
      return { columsWithCards: stateForRender, lastSelectedElem, stateOfNavigation };
    }
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(createMainStates(plugin.currentMd));
  }, [plugin.currentMd]);

  useEffect(() => {
    if (stateOfNavigation) {
      (async () => {
        await plugin.app.vault.adapter.write(plugin.filePath, stateOfNavigation);
      })();
    }
  }, [stateOfNavigation]);

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

      if (needElem! && inputState[needElem.depth - 1]) {
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
        return depths.length ? <ListColumnsDepths key={index} cards={depths} /> : null;
      })}
    </section>
  );
};
