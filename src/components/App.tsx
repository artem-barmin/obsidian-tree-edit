import { h, FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import _ from 'lodash';

import { readyState } from '../scripts/statePreactTree';
import { ListColumnsDepths } from './ListColumnsDepths';
import { id, IDataChains, IPreactState } from '../scripts/scriptInterfaces';
import { IDataSelectedElem } from 'src/interfaces';

export const App: FunctionComponent<{ markdownText: string }> = ({ markdownText }) => {
  const [columsWithCards, setColumsWithCards] = useState<IPreactState[][]>([]);
  const lastClickElem = useRef<IDataChains>({ id: '', depth: 0 });

  useEffect(() => {
    (async () => setColumsWithCards(await readyState(markdownText)))();
  }, [markdownText]);

  const showAllChain = ({
    id: clickId,
    depth: clickDepth,
    children,
    parents,
    neighbors,
    scrollChildren,
  }: IDataSelectedElem): void => {
    if (lastClickElem.current.id === clickId) return;
    lastClickElem.current = { id: clickId, depth: clickDepth };

    setColumsWithCards((prevState) => {
      const newState: IPreactState[][] = [];

      const scrollingChildren = (scrollArr: IDataChains[], clickParents: IDataChains[], clickScrolls: IDataChains[]): void => {
        const chainPositions = (inputArr: IDataChains[], toArr: IDataChains[], scrollEl: IDataChains): void => {
          inputArr.forEach((elem) => {
            if (scrollEl.depth === elem.depth) {
              toArr[toArr.indexOf(scrollEl)] = elem;
            }
          });
        };

        scrollArr.forEach((scroll) => {
          if (scroll.depth === clickDepth) {
            scrollArr[scrollArr.indexOf(scroll)] = { id: clickId, depth: clickDepth };
          }

          chainPositions(clickParents, scrollArr, scroll);
          chainPositions(clickScrolls, scrollArr, scroll);
        });
      };

      for (const state of prevState) {
        for (const elem of state) {
          if (clickId === elem.id) {
            elem.isSelected = true;
            elem.scrollElement = true;
          } else {
            elem.isSelected = false;
            elem.isEdit = false;
            elem.isChild = false;
            elem.isNeighbor = false;
            elem.isParent = false;
            elem.scrollElement = false;
          }

          const child: IDataChains | undefined = _.find(children, { id: elem.id });
          const scrollChild: IDataChains | undefined = _.find(scrollChildren, { id: elem.id });
          const parent: IDataChains | undefined = _.find(parents, { id: elem.id });

          if (child) elem.isChild = true;
          if (scrollChild) elem.scrollElement = true;
          if (parent) {
            elem.isParent = true;
            elem.scrollElement = true;
            scrollingChildren(elem.scrollChildren, parents, scrollChildren);
          }
          if (neighbors.includes(elem.id)) elem.isNeighbor = true;
        }
        newState.push(state);
      }

      return newState;
    });
  };

  const cardAction = (edit: boolean) => {
    setColumsWithCards((prevState) =>
      prevState.map((state) =>
        state.map((elem) => {
          if (elem.isSelected) elem.isEdit = edit;
          return elem;
        })
      )
    );
  };

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
        showAllChain({ id, depth, children, parents, neighbors, scrollChildren });
      }
    } else if (code === 'ArrowLeft' || code === 'ArrowRight') {
      e.preventDefault();

      const parentOrChild = (
        parent: boolean,
        selectedId: id = selectedElem.id,
        state: IPreactState[][] = inputState
      ): IDataChains | undefined => {
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
            showAllChain({ id, depth, children, parents, neighbors, scrollChildren });
          }
        }
      }
    }
  };

  return (
    <section className="tree-edit" onKeyDown={(e) => onKeyDown(e, lastClickElem.current, columsWithCards)} tabIndex={0}>
      {columsWithCards.map((depths, index: number) => {
        return depths.length ? (
          <ListColumnsDepths key={index} cards={depths} showAllChain={showAllChain} cardAction={cardAction} />
        ) : null;
      })}
    </section>
  );
};
