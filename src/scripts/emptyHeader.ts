export const emptyHeader = (markdownContent: string, depth?: number) => {
  let noLineBreaks = markdownContent.split('\n').join('');

  if (depth && noLineBreaks.length === depth) {
    noLineBreaks += ' ';
  }

  const isEmpty = noLineBreaks.match(/^#{1,6}[ ]+$/gi);

  return isEmpty ? String(isEmpty) : '';
};
