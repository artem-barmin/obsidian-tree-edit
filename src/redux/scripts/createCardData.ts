import { ICreateCardData, IPreactState } from '../interfaces';

export const createCardData = ({ id, depth, markdownContent, parents, neighbors, isSelected, isEdit }: ICreateCardData) => {
  const objState: IPreactState = {
    id,
    depth,
    markdownContent,
    children: [],
    scrollChildren: [],
    parents: parents ? [...parents] : [],
    neighbors: neighbors ? [...neighbors] : [],
    isSelected: isSelected ?? false,
    isEdit: isEdit ?? false,
    isParent: false,
    isChild: false,
    isNeighbor: false,
    scrollElement: isSelected ?? false,
  };

  return objState;
};

export const createEmptyHeader = (depth: number) => {
  let header = '';

  if (depth === 1) header = '#';
  else if (depth === 2) header = '##';
  else if (depth === 3) header = '###';
  else if (depth === 4) header = '####';
  else if (depth === 5) header = '#####';
  else if (depth === 6) header = '######';

  return header;
};
