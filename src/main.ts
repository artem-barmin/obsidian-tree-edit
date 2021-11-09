import { App, Plugin, PluginSettingTab, Setting, Workspace, WorkspaceLeaf } from 'obsidian';
import { MM_VIEW_TYPE } from './constants';
import TreeEditSettings from './PluginSettings';
import MyTree from './treeEdit-view';

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: 'default',
};

export default class TreeEdit extends Plugin {
  settings!: TreeEditSettings;
  myTree!: MyTree;
  workspace!: Workspace;

  async onload(): Promise<void> {
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

    this.addStatusBarItem().setText('Status Bar Text');

    this.registerView(MM_VIEW_TYPE, (leaf: WorkspaceLeaf): MyTree => {
      return (this.myTree = new MyTree(this.settings, leaf, {
        path: this.activeLeafPath(this.workspace),
        basename: this.activeLeafName(this.workspace),
      }));
    });

    this.addCommand({
      id: 'open-sample-modal',
      name: 'My script',
      callback: () => this.markMapPreview(),
      hotkeys: [],
    });

    this.addSettingTab(new SampleSettingTab(this.app, this));
  }

  markMapPreview(): void {
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
    const mmPreview = new MyTree(this.settings, preview, fileInfo);
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

class SampleSettingTab extends PluginSettingTab {
  plugin: TreeEdit;

  constructor(app: App, plugin: TreeEdit) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'Settings for my awesome plugin.' });

    new Setting(containerEl)
      .setName('Setting #1')
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder('Enter your secret')
          .setValue('')
          .onChange(async (value) => {
            console.log(`Secret: ${value}`);
            await this.plugin.saveSettings();
          })
      );
  }
}
