import { render } from 'preact';
import { EventRef, ItemView, Vault, Workspace, WorkspaceLeaf } from 'obsidian';
import _ from 'lodash';
import TreeEditSettings from './settings';
import { App } from './components/App';
import { MD_VIEW_TYPE, MM_VIEW_TYPE } from './constants';
import { fileContents } from './scripts/statePreactTree';

export default class TreeeditView extends ItemView {
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
    return this.displayText ?? 'Tree Edit';
  }

  getIcon(): string {
    return 'dot-network';
  }

  constructor(settings: TreeEditSettings, leaf: WorkspaceLeaf, initialFileInfo: { path: string; basename: string }) {
    super(leaf);
    this.settings = settings;
    this.filePath = initialFileInfo.path;
    this.fileName = initialFileInfo.basename;
    this.vault = this.app.vault;
    this.workspace = this.app.workspace;
  }

  async onOpen() {
    this.registerActiveLeafUpdate();
    this.listeners = [
      this.workspace.on('resize', () => this.update()),
      this.workspace.on('css-change', () => this.update()),
      this.leaf.on('group-change', (group) => this.updateLinkedLeaf(group, this)),
    ];
  }

  async onClose(): Promise<void> {
    this.listeners.forEach((listener) => this.workspace.offref(listener));
  }

  registerActiveLeafUpdate() {
    this.registerInterval(window.setInterval(() => this.checkAndUpdate(), 1000));
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

  updateLinkedLeaf(group: string, mmView: TreeeditView): void {
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

      const fileHeaders: any[] | undefined = _.find(fileContents(this.currentMd), { type: 'heading' });

      !fileHeaders || this.getLeafTarget().view.getViewType() !== MD_VIEW_TYPE
        ? this.displayEmpty(true)
        : this.displayEmpty(false);
    }
    this.displayText = this.fileName != undefined ? `Tree edit of ${this.fileName}` : 'Tree Edit';
    this.load();
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
    if (this.emptyDiv === undefined) {
      const div: HTMLDivElement = document.createElement('div');
      div.className = 'pane-empty';
      this.containerEl.children[1].appendChild(div);
      this.emptyDiv = div;
    }

    if (!display) {
      this.emptyDiv.innerHTML = '';
      render(<App markdownText={this.currentMd} />, this.emptyDiv);
    } else {
      this.emptyDiv.innerHTML = 'Headers not found';
    }
  }
}
