import { IStateMDContent } from '../redux/interfaces';

export const getReadyMarkdown = (inputStateMDContent: IStateMDContent[]) => {
  let newMarkdown = '';

  for (const { markdownContent } of inputStateMDContent) {
    newMarkdown += markdownContent;
  }

  return newMarkdown;
};
