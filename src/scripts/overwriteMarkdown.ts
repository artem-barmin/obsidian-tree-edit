import TreeEditView from '../treeEdit-view';

export const overwriteMarkdown = async (plugin: TreeEditView, newMarkdown: string) => {
  await plugin.app.vault.adapter.write(plugin.filePath, newMarkdown);
};
