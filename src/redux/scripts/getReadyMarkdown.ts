import _ from 'lodash';
import { IStateMDContent } from '../interfaces';

export const getReadyMarkdown = (inputStateMDContent: IStateMDContent[]) => {
  return _.map(inputStateMDContent, 'markdownContent').join('');
};
