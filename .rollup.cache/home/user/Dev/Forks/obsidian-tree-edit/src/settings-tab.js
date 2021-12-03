import { PluginSettingTab, Setting } from 'obsidian';
export class SampleSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        new Setting(containerEl)
            .setName('Preview Split')
            .setDesc('Split direction for the Mind Map Preview')
            .addDropdown((dropDown) => dropDown
            .addOption('horizontal', 'Horizontal')
            .addOption('vertical', 'Vertical')
            .setValue(this.plugin.settings.splitDirection || 'horizontal')
            .onChange((value) => {
            this.plugin.settings.splitDirection = value;
            this.plugin.saveData(this.plugin.settings);
        }));
    }
}
//# sourceMappingURL=settings-tab.js.map