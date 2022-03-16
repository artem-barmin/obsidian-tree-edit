import { App, PluginSettingTab, Setting, SplitDirection } from 'obsidian';
import TreeEdit from './main';

export class SampleSettingTab extends PluginSettingTab {
  plugin: TreeEdit;

  constructor(app: App, plugin: TreeEdit) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Preview Split')
      .setDesc('Split direction for the Tree Edit Preview')
      .addDropdown((dropDown) =>
        dropDown
          .addOption('horizontal', 'Horizontal')
          .addOption('vertical', 'Vertical')
          .setValue(this.plugin.settings.splitDirection || 'horizontal')
          .onChange((value: string) => {
            this.plugin.settings.splitDirection = value as SplitDirection;
            this.plugin.saveData(this.plugin.settings);
          })
      );
  }
}
