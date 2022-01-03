import { IStateRootReducer, RootInterfaces } from '../../interfaces';
import { getReadyMarkdown } from '../../scripts';

export const changeCard = (state: IStateRootReducer, { isEdit, newContent }: RootInterfaces.IChangeCard) => {
  const { stateForRender, stateMDContent, lastSelectedElem, stateOfNavigation } = state;

  let wasChanged = false;

  const newStateForRender = stateForRender.map((column) =>
    column.map((card) => {
      if (card.isSelected) {
        const contentChanged = newContent && newContent !== card.markdownContent;

        if (contentChanged) wasChanged = true;

        return { ...card, isEdit, markdownContent: contentChanged ? newContent : card.markdownContent };
      }

      return { ...card };
    })
  );

  if (wasChanged && newContent) {
    const newStateMDContent = stateMDContent.map((card) => {
      if (card.id === lastSelectedElem.id) {
        return { ...card, markdownContent: newContent };
      }

      return { ...card };
    });

    const newMD = getReadyMarkdown(newStateMDContent);

    return {
      ...state,
      stateForRender: newStateForRender,
      stateMDContent: newStateMDContent,
      stateOfNavigation: newMD,
      changedFromInterface: !isEdit,
    };
  } else if (!stateOfNavigation && !isEdit) {
    const newMD = stateMDContent[0].markdownContent;

    return { ...state, stateForRender: newStateForRender, stateOfNavigation: newMD, changedFromInterface: true };
  } else {
    return { ...state, stateForRender: newStateForRender };
  }
};
