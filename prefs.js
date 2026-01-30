import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class AutoMaximizePreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage();
        window.add(page);

        const group = new Adw.PreferencesGroup({
            title: _('Behavior'),
            description: _('Configure how windows are automatically resized'),
        });
        page.add(group);

        const fullscreenRow = new Adw.SwitchRow({
            title: _('Use Fullscreen'),
            subtitle: _('Make windows fullscreen instead of maximized (hides title bar)'),
        });
        group.add(fullscreenRow);

        settings.bind(
            'use-fullscreen',
            fullscreenRow,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
    }
}
