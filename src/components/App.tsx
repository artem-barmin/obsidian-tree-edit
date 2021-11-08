import { h, FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import _ from 'lodash';

import { readyState } from '../scripts/statePreactTree';
import { ListColumnsDepths } from './ListColumnsDepths';
import { IDataChains, id, idChains, IPreactState } from '../scripts/scriptInterfaces';

export const App: FunctionComponent<{ markdownText: string }> = ({ markdownText }) => {
  const [columsWithCards, setColumsWithCards] = useState<IPreactState[][]>([]);
  const lastClickElem = useRef<id>('');

  useEffect(() => {
    (async () => setColumsWithCards(await readyState(markdownText)))();
  }, []);

  const showAllChildren = (
    children: IDataChains[],
    scrollChildren: IDataChains[],
    parents: IDataChains[],
    neighbors: idChains,
    clickId: id,
    clickDepth: number
  ): void => {
    if (lastClickElem.current === clickId) return;
    lastClickElem.current = clickId;

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

  return (
    <section className="tree-edit">
      {columsWithCards.map((depths, index: number) => {
        return depths.length ? <ListColumnsDepths key={index} cards={depths} showAllChildren={showAllChildren} /> : null;
      })}
    </section>
  );
};
