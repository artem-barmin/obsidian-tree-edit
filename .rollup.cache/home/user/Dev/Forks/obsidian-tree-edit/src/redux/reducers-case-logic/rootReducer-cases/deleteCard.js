import _ from 'lodash';
import { makeChainOnClick } from '../../../scripts';
export const deleteCard = (state) => {
    const { stateForRender, stateMDContent, lastSelectedElem } = state;
    const { id: selectedId, depth: selectedDepth } = lastSelectedElem;
    const lastChainOfCards = selectedDepth === 1 && stateForRender[0].length === 1;
    if (lastChainOfCards) {
        return state;
    }
    const allNeighborsState = stateForRender[selectedDepth - 1];
    const allNeighbors = _.map(allNeighborsState, 'id');
    const deleteChildren = [];
    let dataForCardView;
    let closestNeighbor = '';
    let closestParent = '';
    let newMD = '';
    const nearestNeighbor = ({ inputState, parentId }, selectedElem = lastSelectedElem, allNeighborsId = allNeighbors) => {
        const neigborsId = [];
        if (parentId) {
            const { children } = _.find(inputState, { id: parentId });
            const neighbors = _.filter(children, { depth: selectedElem.depth });
            neighbors.length > 1 ? neigborsId.push(..._.map(neighbors, 'id')) : neigborsId.push(...allNeighborsId);
        }
        else {
            neigborsId.push(..._.map(inputState, 'id'));
        }
        const index = neigborsId.indexOf(selectedElem.id);
        return neigborsId[index - 1] ?? neigborsId[index + 1];
    };
    for (const { id, children, parents } of allNeighborsState) {
        if (id === selectedId) {
            if (parents.length) {
                const parentId = parents[parents.length - 1].id;
                allNeighborsState.length > 1
                    ? (closestNeighbor = nearestNeighbor({ inputState: stateForRender.flat(), parentId }))
                    : (closestParent = parentId);
            }
            else {
                closestNeighbor = nearestNeighbor({ inputState: stateForRender[0] });
            }
            deleteChildren.push(...children);
        }
    }
    const withoutDeletedCards = stateForRender.map((column) => column.filter(({ id, depth, children, parents, neighbors, scrollChildren }) => {
        if (id === selectedId)
            return false;
        else if (_.find(deleteChildren, { id }))
            return false;
        else if ((closestNeighbor || closestParent) === id) {
            dataForCardView = Object.assign({}, { id, depth, children, parents, neighbors, scrollChildren });
            return true;
        }
        else {
            return true;
        }
    }));
    if (!dataForCardView)
        return state;
    const filterState = withoutDeletedCards.map((column) => column.map((card) => {
        card.children = card.children.filter(({ id }) => !(id === selectedId || _.find(deleteChildren, { id })));
        card.scrollChildren = card.scrollChildren.filter(({ id }) => !_.find(deleteChildren, { id }));
        card.neighbors = card.neighbors.filter((id) => id !== selectedId);
        return { ...card };
    }));
    const newStateMDContent = stateMDContent.filter(({ id }) => !(id === selectedId || _.find(deleteChildren, { id })));
    for (const { markdownContent } of newStateMDContent) {
        newMD += markdownContent;
    }
    const result = makeChainOnClick(filterState, dataForCardView);
    if (result) {
        const { newStatePreact, lastSelectedElem: lastElem } = result;
        return { ...state, lastSelectedElem: { ...lastElem }, stateForRender: [...newStatePreact], stateOfNavigation: newMD };
    }
    else {
        return state;
    }
};
//# sourceMappingURL=deleteCard.js.map