import { IPreactState, IStateMDContent } from '../interfaces';

export const copiedStateForRender = (inputState: IPreactState[][]) => {
  return inputState.map((column) => {
    return column.map((card) => {
      return {
        ...card,
        parents: card.parents.map((parent) => ({ ...parent })),
        children: card.children.map((child) => ({ ...child })),
        scrollChildren: card.scrollChildren.map((scroll) => ({ ...scroll })),
        neighbors: [...card.neighbors],
      };
    });
  });
};

export const copiedStateMDContent = (inputState: IStateMDContent[]) => {
  return inputState.map((header) => ({ ...header }));
};
