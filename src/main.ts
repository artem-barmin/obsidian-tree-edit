import { App, Plugin, PluginSettingTab, Setting, Workspace, WorkspaceLeaf } from 'obsidian';
import { MM_VIEW_TYPE } from './constants';
import TreeEditSettings from './PluginSettings';
import MyTree from './treeEdit-view';

interface MyPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: 'default'
};

export default class MyPlugin extends Plugin {
  settings!: TreeEditSettings;
  myTree!: MyTree;
  workspace!: Workspace;
  // vault!: Vault;

  async onload(): Promise<void> {
    // console.log('loading plugin');
    // this.vault = this.app.vault;
    this.workspace = this.app.workspace;
    this.settings = Object.assign(
      {
        splitDirection: 'Horizontal',
        nodeMinHeight: 16,
        lineHeight: '1em',
        spacingVertical: 5,
        spacingHorizontal: 80,
        paddingX: 8
      },
      await this.loadData()
    );

    await this.loadSettings();

    // this.mount()

    // this.addRibbonIcon('dice', 'Tree edit', () => {
    // 	new Notice('This is a notice!');
    // });

    this.addStatusBarItem().setText('Status Bar Text');

    this.registerView(MM_VIEW_TYPE, (leaf: WorkspaceLeaf): MyTree => {
      return (this.myTree = new MyTree(this.settings, leaf, {
        path: this.activeLeafPath(this.workspace),
        basename: this.activeLeafName(this.workspace)
      }));
    });

    this.addCommand({
      id: 'open-sample-modal',
      name: 'My script',
      callback: () => this.markMapPreview(),
      hotkeys: []
      // callback: () => this.SampleModal(),

      // checkCallback: (checking: boolean) => {
      // 	let leaf = this.app.workspace.activeLeaf;

      // 	if (leaf) {
      // 		if (checking) {
      // 			return true;
      // 		};
      // 		new SampleModal(this.app).open();
      // 	}

      // 	return false;
      // }
    });

    this.addSettingTab(new SampleSettingTab(this.app, this));

    // this.registerCodeMirror((cm: CodeMirror.Editor) => {
    // 	console.log('codemirror', cm);
    // });

    // this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
    // 	console.log('click', evt);
    // });

    // this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
  }

  // mount() {

  // 	render(
  // 		createApp({}),
  // 		this.appEl ?? (this.appEl = document.body.createDiv())
  // 	);
  // }

  markMapPreview(): void {
    const fileInfo = {
      path: this.activeLeafPath(this.workspace),
      basename: this.activeLeafName(this.workspace)
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

  // onunload() {
  // 	console.log('unloading plugin');
  // }

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

// class SampleModal extends Modal {
// 	[x: string]: any;

// 	constructor(app: App) {
// 		super(app);
// 	}

// 	getDisplayText(): string {
// 		return this.displayText ?? 'Mind Map';
// 	}

// 	onOpen() {
// 		let {contentEl} = this;
// 		contentEl.setText('<div>qq</div>');
// 	}

// 	onClose() {
// 		let {contentEl} = this;
// 		contentEl.empty();
// 	}
// }

class SampleSettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
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
            // this.plugin.settings = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
