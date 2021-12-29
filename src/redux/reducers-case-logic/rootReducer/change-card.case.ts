import { IStateRootReducer, RootInterfaces } from '../../interfaces';
import { getReadyMarkdown } from '../../scripts';

export const changeCard = (state: IStateRootReducer, { isEdit, newContent }: RootInterfaces.IChangeCard) => {
  const { stateForRender, stateMDContent, lastSelectedElem, stateOfNavigation } = state;

  let wasChanged = false;

  const newStatePreact = stateForRender.map((column) =>
    column.map((card) => {
      if (card.isSelected) {
        card.isEdit = isEdit;

        if (newContent && newContent !== card.markdownContent) {
          wasChanged = true;
          card.markdownContent = newContent;
        }
      }
      return { ...card };
    })
  );

  if (wasChanged && newContent) {
    const newStateMDContent = stateMDContent.map((card) => {
      if (card.id === lastSelectedElem.id) {
        card.markdownContent = newContent;
      }
      return { ...card };
    });

    const newMD = getReadyMarkdown(newStateMDContent);

    return {
      ...state,
      stateForRender: [...newStatePreact],
      stateMDContent: [...newStateMDContent],
      stateOfNavigation: newMD,
      changedFromInterface: !isEdit,
    };
  } else if (!stateOfNavigation && !isEdit) {
    const newMD = stateMDContent[0].markdownContent;

    return { ...state, stateForRender: [...newStatePreact], stateOfNavigation: newMD, changedFromInterface: true };
  } else {
    return { ...state, stateForRender: [...newStatePreact] };
  }
};
