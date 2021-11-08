import { h, FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import _ from 'lodash';

import { readyState } from '../scripts/statePreactTree';
import { ListColumnsDepths } from './ListColumnsDepths';
import { IDataChains, IPreactState } from '../scripts/scriptInterfaces';
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

      const scrollingChildren = (scrollArr: IDataChains[]): void => {
        scrollArr.forEach((scroll) => {
          if (scroll.depth === clickDepth) {
            scrollArr[scrollArr.indexOf(scroll)] = { id: clickId, depth: clickDepth };
          }
          parents.forEach((parent) => {
            if (scroll.depth === parent.depth) {
              scrollArr[scrollArr.indexOf(scroll)] = parent;
            }
          });
        });
      };

      for (const state of prevState) {
        for (const elem of state) {
          if (clickId === elem.id) {
            elem.isChild = true;
            elem.scrollElement = true;
          } else {
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
            scrollingChildren(elem.scrollChildren);
          }
          if (neighbors.includes(elem.id)) elem.isNeighbor = true;
        }
        newState.push(state);
      }

      return newState;
    });
  };

  const onKeyDown = (e: KeyboardEvent, selectedElem: IDataChains, state: IPreactState[][]): void => {
    const code: string = e.code;

    if (code === 'ArrowUp' || code === 'ArrowDown') {
      e.preventDefault();

      const depthIndex: number = selectedElem.depth - 1;
      let currentIndex: number = 0;

      if (depthIndex > 0) {
        for (const elem of state[depthIndex]) {
          if (elem.id === selectedElem.id) {
            currentIndex = state[depthIndex].indexOf(elem);
          }
        }

        const lastIndex: number = state[depthIndex].length - 1;
        if (code === 'ArrowUp' && currentIndex > 0) currentIndex--;
        else if (code === 'ArrowDown' && currentIndex <= lastIndex) currentIndex++;

        const returnedItem: IPreactState | undefined = state[depthIndex][currentIndex];
        if (returnedItem) {
          const { id, depth, children, parents, neighbors, scrollChildren } = returnedItem;
          showAllChain({ id, depth, children, parents, neighbors, scrollChildren });
        }
      }
    }
  };

  return (
    <section className="tree-edit" onKeyDown={(e) => onKeyDown(e, lastClickElem.current, columsWithCards)} tabIndex={0}>
      {columsWithCards.map((depths, index: number) => {
        return depths.length ? <ListColumnsDepths key={index} cards={depths} showAllChain={showAllChain} /> : null;
      })}
    </section>
  );
};
