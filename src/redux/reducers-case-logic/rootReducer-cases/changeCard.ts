import { ICardAction_Payload, IState } from '../../interfaces';

export const changeCard = (state: IState, { isEdit, newContent }: ICardAction_Payload) => {
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
  } else {
    return { ...state, stateForRender: [...newStatePreact] };
  }
};
