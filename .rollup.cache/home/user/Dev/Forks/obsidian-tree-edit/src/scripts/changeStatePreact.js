import _ from 'lodash';
export const makeChainOnClick = (inputState, selectedElem, lastSelectedElem) => {
    const { id: selectedId, depth: selectedDepth, children, parents, neighbors, scrollChildren } = selectedElem;
    if (lastSelectedElem?.id === selectedId)
        return null;
    const scrollingChildren = (scrollArr, clickParents, clickScrolls) => {
        const chainPositions = (inputArr, toArr, scrollEl) => {
            inputArr.forEach((elem) => {
                if (scrollEl.depth === elem.depth) {
                    toArr[toArr.indexOf(scrollEl)] = elem;
                }
            });
        };
        scrollArr.forEach((scroll) => {
            if (scroll.depth === selectedDepth) {
                scrollArr[scrollArr.indexOf(scroll)] = { id: selectedId, depth: selectedDepth };
            }
            chainPositions(clickParents, scrollArr, scroll);
            chainPositions(clickScrolls, scrollArr, scroll);
        });
    };
    const newStatePreact = inputState.map((column) => {
        for (const card of column) {
            if (selectedId === card.id) {
                card.isSelected = true;
                card.scrollElement = true;
            }
            else {
                card.isSelected = false;
                card.isEdit = false;
                card.isChild = false;
                card.isNeighbor = false;
                card.isParent = false;
                card.scrollElement = false;
            }
            const child = _.find(children, { id: card.id });
            const scrollChild = _.find(scrollChildren, { id: card.id });
            const parent = _.find(parents, { id: card.id });
            if (child)
                card.isChild = true;
            if (scrollChild)
                card.scrollElement = true;
            if (parent) {
                card.isParent = true;
                card.scrollElement = true;
                scrollingChildren(card.scrollChildren, parents, scrollChildren);
            }
            if (neighbors.includes(card.id))
                card.isNeighbor = true;
        }
        return column;
    });
    return { lastSelectedElem: { id: selectedId, depth: selectedDepth }, newStatePreact };
};
//# sourceMappingURL=changeStatePreact.js.map