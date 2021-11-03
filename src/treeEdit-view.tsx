import { MM_VIEW_TYPE } from './constants';
import { EventRef, ItemView, Vault, Workspace, WorkspaceLeaf } from 'obsidian';
import TreeEditSettings from './PluginSettings';
import { render } from 'preact';
import { App } from './components/App';
// import './styles/index.scss';

export default class MyTree extends ItemView {
  filePath: string;
  fileName: string;
  linkedLeaf: WorkspaceLeaf | undefined;
  displayText!: string;
  currentMd!: string;
  vault: Vault;
  workspace: Workspace;
  listeners!: EventRef[];
  emptyDiv!: HTMLDivElement;
  isLeafPinned!: boolean;
  settings: TreeEditSettings;

  getViewType(): string {
    return MM_VIEW_TYPE;
  }

  getDisplayText(): string {
    return this.displayText ?? 'Mind Map';
  }

  getIcon(): string {
    return 'dot-network';
  }

  // onMoreOptionsMenu(menu: Menu): void {
  // 		menu
  // 		.addItem((item) =>
  // 				item
  // 				.setIcon('pin')
  // 				.setTitle('Pin')
  // 				.onClick(() => this.pinCurrentLeaf())
  // 		)
  // 		.addSeparator()
  // 		.addItem((item) =>
  // 				item
  // 				.setIcon('image-file')
  // 				.setTitle('Copy screenshot')
  // 				// .onClick(() => copyImageToClipboard(this.svg))
  // 		);
  // 		menu.showAtPosition({x: 0, y: 0});
  // }

  constructor(settings: TreeEditSettings, leaf: WorkspaceLeaf, initialFileInfo: { path: string; basename: string }) {
    super(leaf);
    this.settings = settings;
    this.filePath = initialFileInfo.path;
    this.fileName = initialFileInfo.basename;
    this.vault = this.app.vault;
    this.workspace = this.app.workspace;
  }

  async onOpen() {
    // this.obsMarkmap = new ObsidianMarkmap(this.vault);
    this.registerActiveLeafUpdate();
    this.listeners = [
      // this.workspace.on('layout-change', () => this.update()),
      this.workspace.on('resize', () => this.update()),
      this.workspace.on('css-change', () => this.update()),
      this.leaf.on('group-change', (group) => this.updateLinkedLeaf(group, this))
    ];
  }

  async onClose(): Promise<void> {
    this.listeners.forEach((listener) => this.workspace.offref(listener));
  }

  async checkAndUpdate(): Promise<void> {
    try {
      if (await this.checkActiveLeaf()) {
        this.update();
      }
    } catch (error) {
      console.error(error);
    }
  }

  updateLinkedLeaf(group: string, mmView: MyTree): void {
    if (group === null) {
      mmView.linkedLeaf = undefined;
      return;
    }
    const mdLinkedLeaf = mmView.workspace.getGroupLeaves(group).filter((l) => l.view.getViewType() === MM_VIEW_TYPE)[0];
    mmView.linkedLeaf = mdLinkedLeaf;
    this.checkAndUpdate();
  }

  async update(): Promise<void> {
    if (this.filePath) {
      await this.readMarkDown();
      // if(this.f.length === 0 || this.getLeafTarget().view.getViewType() != 'markdown'){
      // removeExistingSVG();
      // } else {
      // const { root, features } = await this.transformMarkdown();
      // this.displayEmpty(false);
      // this.svg = createSVG(this.containerEl, this.settings.lineHeight);
      // this.renderMarkmap(root, this.svg);
      // }
      this.displayEmpty(true);
    }
    this.displayText = this.fileName != undefined ? `Mind Map of ${this.fileName}` : 'Mind Map';
    this.load();
  }

  registerActiveLeafUpdate() {
    this.registerInterval(window.setInterval(() => this.checkAndUpdate(), 1000));
  }

  getLeafTarget(): WorkspaceLeaf {
    if (!this.isLeafPinned) {
      this.linkedLeaf = this.app.workspace.activeLeaf!;
    }
    return this.linkedLeaf != undefined ? this.linkedLeaf : this.app.workspace.activeLeaf!;
  }

  async checkActiveLeaf(): Promise<boolean> {
    if (this.app.workspace.activeLeaf!.view.getViewType() === MM_VIEW_TYPE) {
      return false;
    }
    const pathHasChanged = this.readFilePath();
    const markDownHasChanged = await this.readMarkDown();
    const updateRequired = pathHasChanged || markDownHasChanged;
    return updateRequired;
  }

  async readMarkDown(): Promise<boolean> {
    const md: string = await this.app.vault.adapter.read(this.filePath);
    const markDownHasChanged: boolean = this.currentMd != md;
    this.currentMd = md;
    return markDownHasChanged;
  }

  readFilePath(): boolean {
    const fileInfo: any = (this.getLeafTarget().view as any).file;
    const pathHasChanged: boolean = this.filePath != fileInfo.path;
    this.filePath = fileInfo.path;
    this.fileName = fileInfo.basename;
    return pathHasChanged;
  }

  async displayEmpty(display: boolean): Promise<void> {
    const md: string = await this.app.vault.adapter.read(this.filePath);
    // console.log(md)
    if (this.emptyDiv === undefined) {
      const div: HTMLDivElement = document.createElement('div');
      div.className = 'pane-empty';
      // div.innerText = divContent
      this.containerEl.children[1].appendChild(div);
      this.emptyDiv = div;

      render(<App />, this.emptyDiv);
    } else {
      render(<App />, this.emptyDiv ?? (this.emptyDiv = document.body.createDiv()));
      // this.emptyDiv.innerText = divContent
    }
    this.emptyDiv.toggle(display);
  }

  // pinCurrentLeaf() {
  // 	this.isLeafPinned = true;
  // 	this.pinAction = this.addAction('filled-pin', 'Pin', () => this.unPin(), 20);
  // 	this.pinAction.addClass('is-active');
  // }

  // unPin() {
  // 	this.isLeafPinned = false;
  // 	this.pinAction.parentNode.removeChild(this.pinAction);
  // }
}
