import _ from 'lodash';
import { CARD_ACTION, CHANGE_FIRST_RENDER, CLICK_CARD_VIEW, CREATE_MAIN_STATES, DELETE_CARD, SET_EDITOR_CM } from './types';
import {
  IAction,
  ICardAction_Payload,
  IState,
  id,
  IPreactState,
  INearestNeighbor,
  IDataSelectedElem,
  IDataChains,
} from './interfacesRedux';
import { makeChainOnClick } from '../scripts/changeStatePreact';

const initialState: IState = {
  stateMDContent: [],
  stateForRender: [],
  stateOfNavigation: '',
  editorCM: null,
  lastSelectedElem: { id: '', depth: 0 },
};

export const rootReducer = (state = initialState, action: IAction) => {
  const { type, payload } = action;

  switch (type) {
    case CHANGE_FIRST_RENDER:
      return { ...state, stateOfNavigation: payload };
    case CREATE_MAIN_STATES:
      const { stateMDContent, preactState } = payload;
      return {
        ...state,
        stateForRender: [...preactState],
        stateMDContent: [...stateMDContent],
        lastSelectedElem: { ...{ id: '', depth: 0 } },
        stateOfNavigation: '',
      };
    case CLICK_CARD_VIEW:
      const result = makeChainOnClick(state.stateForRender, payload, state.lastSelectedElem);

      if (!result) return state;

      const { newStatePreact, lastSelectedElem } = result;

      return { ...state, lastSelectedElem: { ...lastSelectedElem }, stateForRender: [...newStatePreact] };
    case CARD_ACTION:
      return cardAction(state, payload);
    case SET_EDITOR_CM:
      return { ...state, editorCM: payload };
    case DELETE_CARD:
      return deleteCard(state);
    default:
      return state;
  }
};

function cardAction(state: IState, { isEdit, newContent }: ICardAction_Payload) {
  const { stateForRender, stateMDContent, lastSelectedElem } = state;

  let wasChanged = false;

  const newStatePreact = stateForRender.map((column) =>
    column.map((card) => {
      if (card.isSelected) {
        card.isEdit = isEdit;

        if (newContent && (wasChanged = newContent.markdownContent !== card.markdownContent)) {
          card.headerHTML = newContent.headerHTML;
          card.contentsHTML = [...newContent.contentsHTML];
          card.markdownContent = newContent.markdownContent;
        }
      }
      return card;
    })
  );

  if (wasChanged) {
    let newMD = '';

    for (const { id, markdownContent } of stateMDContent) {
      if (id === lastSelectedElem.id) newMD += newContent!.markdownContent;
      else newMD += markdownContent;
    }

    return { ...state, stateForRender: [...newStatePreact], stateOfNavigation: newMD };
  } else return { ...state, stateForRender: [...newStatePreact] };
}

function deleteCard(state: IState) {
  const { stateForRender, stateMDContent, lastSelectedElem } = state;

  let dataForCardView: IDataSelectedElem;

  const lastChainOfCards = lastSelectedElem.depth === 1 && stateForRender[0].length === 1;
  const deleteChildren: IDataChains[] = [];
  let closestNeighbor: id = '';
  let closestParent: id = '';

  const nearestNeighbor = ({ inputState, parentId }: INearestNeighbor, selectedElem = lastSelectedElem) => {
    const neigborsId: id[] = [];

    if (parentId) {
      const { children } = _.find(inputState, { id: parentId }) as IPreactState;
      const neighbors = _.filter(children, { depth: selectedElem.depth });
      neigborsId.push(..._.map(neighbors, 'id'));
    } else {
      neigborsId.push(..._.map(inputState, 'id'));
    }

    const index = neigborsId.indexOf(selectedElem.id);
    return neigborsId[index - 1] ?? neigborsId[index + 1];
  };

  for (const { id, children, parents, neighbors } of stateForRender.flat()) {
    if (id === lastSelectedElem.id) {
      if (parents.length) {
        const parentId = parents[parents.length - 1].id;

        if (neighbors.length) {
          closestNeighbor = nearestNeighbor({ inputState: stateForRender.flat(), parentId });
        } else closestParent = parentId;
      } else if (!lastChainOfCards) {
        closestNeighbor = nearestNeighbor({ inputState: stateForRender[0] });
      }

      deleteChildren.push(...children);
    }
  }

  if (!lastChainOfCards) {
    let newMD = '';

    const withoutDeletedCards = stateForRender.map((column) =>
      column.filter(({ id, depth, children, parents, neighbors, scrollChildren }) => {
        if (id === lastSelectedElem.id) return false;
        else if (_.find(deleteChildren, { id })) return false;
        else if (closestNeighbor === id || closestParent === id) {
          dataForCardView = Object.assign({}, { id, depth, children, parents, neighbors, scrollChildren });
          return true;
        } else return true;
      })
    );

    const filterState = withoutDeletedCards.map((column) =>
      column.map((card) => {
        card.children = card.children.filter(({ id }) => !(id === lastSelectedElem.id || _.find(deleteChildren, { id })));
        card.scrollChildren = card.scrollChildren.filter(({ id }) => !_.find(deleteChildren, { id }));
        card.neighbors = card.neighbors.filter((id) => id !== lastSelectedElem.id);

        return card;
      })
    );

    const newStateMDContent = stateMDContent.filter(({ id }) => !(id === lastSelectedElem.id || _.find(deleteChildren, { id })));

    for (const { markdownContent } of newStateMDContent) newMD += markdownContent;

    const result = makeChainOnClick(filterState, dataForCardView!);
    const { newStatePreact, lastSelectedElem: lastElem } = result!;

    return { ...state, lastSelectedElem: { ...lastElem }, stateForRender: [...newStatePreact], stateOfNavigation: newMD };
  }

  return state;
}
