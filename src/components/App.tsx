import { h, FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

import { readyState } from '../scripts/statePreactTree';
import { ListColumnsDepths } from './ListColumnsDepths';
import { IDataChains, id, idChains, IPreactState } from '../scripts/scriptInterfaces';

export const App: FunctionComponent = () => {
  const [columsWithCards, setColumsWithCards] = useState<IPreactState[][]>([]);
  const lastClickElem = useRef<id>('');

  useEffect(() => {
    (async () => setColumsWithCards(await readyState()))();
  }, []);

  const showAllChildren = (
    children: IDataChains[],
    scrollChildren: IDataChains[],
    parents: idChains,
    neighbors: idChains,
    currentElemId: id
  ): void => {
    if (lastClickElem.current === currentElemId) return;
    lastClickElem.current = currentElemId;

    setColumsWithCards((prevState) => {
      const newState: IPreactState[][] = [];
      // let deleteEl: id = '';
      // let clickElDepth: number = 0;
      // const currentParentElem: id = parents[parents.length - 1];

      for (const state of prevState) {
        for (const elem of state) {
          if (currentElemId === elem.id) {
            elem.isChild = true;
            elem.scrollElement = true;
          } else {
            if (elem.isChild) elem.isChild = false;
            if (elem.isParent) elem.isParent = false;
            if (elem.isNeighbor) elem.isNeighbor = false;
            if (elem.scrollElement) elem.scrollElement = false;
          }

          const child = children.find((child) => child.id === elem.id);
          const scrollChild = scrollChildren.find((child) => child.id === elem.id);

          if (child) elem.isChild = true;
          if (scrollChild) elem.scrollElement = true;
          if (parents.includes(elem.id)) {
            elem.isParent = true;
            elem.scrollElement = true;
          }
          if (neighbors.includes(elem.id)) elem.isNeighbor = true;

          // Сhange the previous clicked item to the current item
          // if (currentParentElem === elem.id) {
          //   const { depth: clickDepth } = elem.children.find((child) => child.id === currentElemId);
          //   clickElDepth = clickDepth;
          //   for (const child of elem.scrollChildren) {
          //     if (clickDepth === child.depth && child.id !== currentElemId) {
          //       deleteEl = child.id;
          //     }
          //   }

          //   elem.scrollChildren = elem.scrollChildren.filter((delEl) => delEl.id !== deleteEl);
          //   elem.scrollChildren.push({ id: currentElemId, depth: clickDepth });
          // }

          // if (parents.includes(elem.id)) {
          //   if (elem.id !== currentParentElem) {
          //     console.log(elem.scrollChildren);
          //     console.log(elem.id);
          //   }
          // }
        }

        newState.push(state);
      }

      return newState;
    });
  };

  return (
    <section>
      {columsWithCards.map((depths, index: number) => {
        return depths.length ? <ListColumnsDepths key={index} cards={depths} showAllChildren={showAllChildren} /> : null;
      })}
    </section>
  );
};
