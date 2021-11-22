import { Plugin, Vault, Workspace, WorkspaceLeaf } from 'obsidian';
import { MM_VIEW_TYPE } from './constants';
import TreeEditSettings from './settings';
import { SampleSettingTab } from './settings-tab';
import TreeEditView from './treeEdit-view';

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: 'default',
};

export default class TreeEdit extends Plugin {
  vault!: Vault;
  settings!: TreeEditSettings;
  myTree!: TreeEditView;
  workspace!: Workspace;

  async onload(): Promise<void> {
    this.vault = this.app.vault;
    this.workspace = this.app.workspace;
    this.settings = Object.assign(
      {
        splitDirection: 'Horizontal',
        nodeMinHeight: 16,
        lineHeight: '1em',
        spacingVertical: 5,
        spacingHorizontal: 80,
      },
      await this.loadData()
    );

    await this.loadSettings();

    this.registerView(MM_VIEW_TYPE, (leaf: WorkspaceLeaf): TreeEditView => {
      return (this.myTree = new TreeEditView(this.settings, leaf, {
        path: this.activeLeafPath(this.workspace),
        basename: this.activeLeafName(this.workspace),
      }));
    });

    this.addCommand({
      id: 'open-sample-modal',
      name: 'Writing and editing in the form of a ginko tree',
      callback: () => this.treeEditPreview(),
      hotkeys: [],
    });

    this.addSettingTab(new SampleSettingTab(this.app, this));
  }

  treeEditPreview(): void {
    const fileInfo = {
      path: this.activeLeafPath(this.workspace),
      basename: this.activeLeafName(this.workspace),
    };
    this.initPreview(fileInfo);
  }

  async initPreview(fileInfo: { path: string; basename: string }): Promise<void> {
    if (this.app.workspace.getLeavesOfType(MM_VIEW_TYPE).length > 0) {
      return;
    }
    const preview = this.app.workspace.splitActiveLeaf(this.settings.splitDirection);
    const mmPreview = new TreeEditView(this.settings, preview, fileInfo);
    preview.open(mmPreview);
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  activeLeafPath(workspace: Workspace): string {
    return workspace.activeLeaf?.view.getState().file;
  }

  activeLeafName(workspace: Workspace): string {
    return workspace.activeLeaf?.getDisplayText()!;
  }
}
