import _ from 'lodash';
import { EventRef, ItemView, Vault, Workspace, WorkspaceLeaf } from 'obsidian';
import { MD_VIEW_TYPE, MM_VIEW_TYPE } from './constants';
import { preactRender } from './index';
import { fileContents } from './redux/scripts';
import TreeEditSettings from './settings';

export default class TreeEditView extends ItemView {
  filePath: string;
  fileName: string;
  prevFileName!: string;
  linkedLeaf?: WorkspaceLeaf;
  displayText!: string;
  currentMd!: string;
  prevCurrentMd!: string;
  headersExist!: boolean;
  vault: Vault;
  workspace: Workspace;
  listeners!: EventRef[];
  mainDiv!: HTMLDivElement;
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
    const childrenLeafContent = this.leaf.view.containerEl.children;

    for (const elem of childrenLeafContent) {
      if (elem.classList.contains('view-content')) {
        const content = elem as HTMLDivElement;
        content.style.padding = '0';
        content.style.overflow = 'hidden';
      }
    }

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

  updateLinkedLeaf(group: string, mmView: TreeEditView): void {
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

      if (this.fileName !== this.prevFileName || this.currentMd !== this.prevCurrentMd) {
        this.prevFileName = this.fileName;
        this.prevCurrentMd = this.currentMd;

        const fileHeaders = _.find(fileContents(this.currentMd), { type: 'heading' });
        const leafViewType = this.getLeafTarget().view.getViewType();
        const mardownOrThreeEdit = leafViewType !== MD_VIEW_TYPE && leafViewType !== MM_VIEW_TYPE;

        !mardownOrThreeEdit && !fileHeaders ? this.displayEmpty(true) : this.displayEmpty(false);
      }
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

  displayEmpty(display: boolean): void {
    if (this.mainDiv === undefined) {
      const div: HTMLDivElement = document.createElement('div');
      div.className = 'tree-edit';
      this.containerEl.children[1].appendChild(div);
      this.mainDiv = div;
    }

    this.headersExist = !display;

    preactRender(this);
  }
}
