import _ from 'lodash';
import { CARD_ACTION, CHANGE_FIRST_RENDER, CLICK_CARD_VIEW, CREATE_PREACT_STATE, SET_EDITOR_CM } from './types';
import { IAction, ICardAction_Payload, IState, IDataChains } from './interfacesRedux';
import { IDataSelectedElem } from 'src/interfaces';

const initialState: IState = {
  stateForRender: [],
  stateOfNavigation: '',
  editorCM: null,
  lastClickElem: { id: '', depth: 0 },
};

export const rootReducer = (state = initialState, action: IAction) => {
  const { type, payload } = action;

  switch (type) {
    case CHANGE_FIRST_RENDER:
      return { ...state, stateOfNavigation: payload };
    case CREATE_PREACT_STATE:
      return { ...state, stateForRender: [...payload] };
    case CLICK_CARD_VIEW:
      return clickCardView(state, payload);
    case CARD_ACTION:
      return cardAction(state, payload);
    case SET_EDITOR_CM:
      return { ...state, editorCM: payload };
    default:
      return state;
  }
};

function clickCardView(state: IState, data: IDataSelectedElem) {
  const { lastClickElem, stateForRender } = state;
  const { id: clickId, depth: clickDepth, children, parents, neighbors, scrollChildren } = data;

  if (lastClickElem.id === clickId) return state;

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

  const newState = stateForRender.map((column) => {
    for (const card of column) {
      if (clickId === card.id) {
        card.isSelected = true;
        card.scrollElement = true;
      } else {
        card.isSelected = false;
        card.isEdit = false;
        card.isChild = false;
        card.isNeighbor = false;
        card.isParent = false;
        card.scrollElement = false;
      }
      const child: IDataChains | undefined = _.find(children, { id: card.id });
      const scrollChild: IDataChains | undefined = _.find(scrollChildren, { id: card.id });
      const parent: IDataChains | undefined = _.find(parents, { id: card.id });
      if (child) card.isChild = true;
      if (scrollChild) card.scrollElement = true;
      if (parent) {
        card.isParent = true;
        card.scrollElement = true;
        scrollingChildren(card.scrollChildren, parents, scrollChildren);
      }
      if (neighbors.includes(card.id)) card.isNeighbor = true;
    }
    return column;
  });

  return { ...state, lastClickElem: { id: clickId, depth: clickDepth }, stateForRender: [...newState] };
}

function cardAction(state: IState, { isEdit, newContent }: ICardAction_Payload) {
  const { stateForRender } = state;

  const newState = stateForRender.map((column) =>
    column.map((card) => {
      if (card.isSelected) {
        card.isEdit = isEdit;

        if (newContent) {
          card.headerHTML = newContent.headerHTML;
          card.contentsHTML = [...newContent.contentsHTML];
          card.markdownContent = newContent.markdownContent;
        }
      }
      return card;
    })
  );

  return { ...state, stateForRender: [...newState] };
}
