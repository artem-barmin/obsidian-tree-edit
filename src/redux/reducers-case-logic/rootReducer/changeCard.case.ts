import { getReadyMarkdown } from '../../scripts';
import { ICardAction_Payload, IStateRootReducer } from '../../interfaces';

export const changeCard = (state: IStateRootReducer, { isEdit, newContent }: ICardAction_Payload) => {
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
      return { ...card };
    })
  );

  if (wasChanged && newContent) {
    const newStateMDContent = stateMDContent.map((card) => {
      if (card.id === lastSelectedElem.id) {
        card.markdownContent = newContent.markdownContent;
      }
      return { ...card };
    });

    const newMD = getReadyMarkdown(newStateMDContent);

    return { ...state, stateForRender: [...newStatePreact], stateMDContent: [...newStateMDContent], stateOfNavigation: newMD };
  } else {
    return { ...state, stateForRender: [...newStatePreact] };
  }
};
