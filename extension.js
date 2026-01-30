import Gio from 'gi://Gio';
import Meta from 'gi://Meta';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class AutoMaximizeExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._windowCreatedId = global.display.connect(
            'window-created',
            (display, window) => this._onWindowCreated(window)
        );
    }

    disable() {
        if (this._windowCreatedId) {
            global.display.disconnect(this._windowCreatedId);
            this._windowCreatedId = null;
        }
        this._settings = null;
    }

    _onWindowCreated(window) {
        // Only handle normal windows (not dialogs, menus, etc.)
        if (window.get_window_type() !== Meta.WindowType.NORMAL) {
            return;
        }

        const useFullscreen = this._settings.get_boolean('use-fullscreen');

        // Wait for the window to be ready
        const actor = window.get_compositor_private();
        if (actor) {
            const id = actor.connect('first-frame', () => {
                actor.disconnect(id);
                this._applyWindowMode(window, useFullscreen);
            });
        } else {
            this._applyWindowMode(window, useFullscreen);
        }
    }

    _applyWindowMode(window, useFullscreen) {
        if (useFullscreen) {
            window.make_fullscreen();
        } else {
            window.maximize(Meta.MaximizeFlags.BOTH);
        }
    }
}
