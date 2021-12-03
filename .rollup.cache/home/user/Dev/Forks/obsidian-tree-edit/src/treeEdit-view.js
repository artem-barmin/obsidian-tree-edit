import _ from 'lodash';
import { ItemView } from 'obsidian';
import { MD_VIEW_TYPE, MM_VIEW_TYPE } from './constants';
import { preactRender } from './index';
import { fileContents } from './scripts/statePreactTree';
export default class TreeEditView extends ItemView {
    constructor(settings, leaf, initialFileInfo) {
        super(leaf);
        this.settings = settings;
        this.filePath = initialFileInfo.path;
        this.fileName = initialFileInfo.basename;
        this.vault = this.app.vault;
        this.workspace = this.app.workspace;
    }
    getViewType() {
        return MM_VIEW_TYPE;
    }
    getDisplayText() {
        return this.displayText ?? 'Tree Edit';
    }
    getIcon() {
        return 'dot-network';
    }
    async onOpen() {
        this.registerActiveLeafUpdate();
        this.listeners = [
            this.workspace.on('resize', () => this.update()),
            this.workspace.on('css-change', () => this.update()),
            this.leaf.on('group-change', (group) => this.updateLinkedLeaf(group, this)),
        ];
    }
    async onClose() {
        this.listeners.forEach((listener) => this.workspace.offref(listener));
    }
    registerActiveLeafUpdate() {
        this.registerInterval(window.setInterval(() => this.checkAndUpdate(), 1000));
    }
    async checkAndUpdate() {
        try {
            if (await this.checkActiveLeaf()) {
                this.update();
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    updateLinkedLeaf(group, mmView) {
        if (group === null) {
            mmView.linkedLeaf = undefined;
            return;
        }
        const mdLinkedLeaf = mmView.workspace.getGroupLeaves(group).filter((l) => l.view.getViewType() === MM_VIEW_TYPE)[0];
        mmView.linkedLeaf = mdLinkedLeaf;
        this.checkAndUpdate();
    }
    async update() {
        if (this.filePath) {
            await this.readMarkDown();
            if (this.fileName !== this.prevFileName || this.currentMd !== this.prevCurrentMd) {
                this.prevFileName = this.fileName;
                this.prevCurrentMd = this.currentMd;
                const fileHeaders = _.find(fileContents(this.currentMd), { type: 'heading' });
                !fileHeaders || this.getLeafTarget().view.getViewType() !== MD_VIEW_TYPE
                    ? this.displayEmpty(true)
                    : this.displayEmpty(false);
            }
        }
        this.displayText = this.fileName != undefined ? `Tree edit of ${this.fileName}` : 'Tree Edit';
        this.load();
    }
    getLeafTarget() {
        if (!this.isLeafPinned) {
            this.linkedLeaf = this.app.workspace.activeLeaf;
        }
        return this.linkedLeaf != undefined ? this.linkedLeaf : this.app.workspace.activeLeaf;
    }
    async checkActiveLeaf() {
        if (this.app.workspace.activeLeaf.view.getViewType() === MM_VIEW_TYPE) {
            return false;
        }
        const pathHasChanged = this.readFilePath();
        const markDownHasChanged = await this.readMarkDown();
        const updateRequired = pathHasChanged || markDownHasChanged;
        return updateRequired;
    }
    async readMarkDown() {
        const md = await this.app.vault.adapter.read(this.filePath);
        const markDownHasChanged = this.currentMd != md;
        this.currentMd = md;
        return markDownHasChanged;
    }
    readFilePath() {
        const fileInfo = this.getLeafTarget().view.file;
        const pathHasChanged = this.filePath != fileInfo.path;
        this.filePath = fileInfo.path;
        this.fileName = fileInfo.basename;
        return pathHasChanged;
    }
    displayEmpty(display) {
        if (this.mainDiv === undefined) {
            const div = document.createElement('div');
            div.className = 'tree-edit';
            this.containerEl.children[1].appendChild(div);
            this.mainDiv = div;
        }
        if (!display) {
            preactRender(this);
            this.mainDiv.innerHTML = '';
        }
        else {
            this.mainDiv.innerHTML = 'Headers not found';
        }
    }
}
//# sourceMappingURL=treeEdit-view.js.map