import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

export default class AutoMaximizeExtension {
    constructor() {
        this._windowCreatedId = null;
    }

    enable() {
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
    }

    _onWindowCreated(window) {
        // Only maximize normal windows (not dialogs, menus, etc.)
        if (window.get_window_type() !== Meta.WindowType.NORMAL) {
            return;
        }

        // Wait for the window to be ready before maximizing
        const actor = window.get_compositor_private();
        if (actor) {
            const id = actor.connect('first-frame', () => {
                actor.disconnect(id);
                window.maximize(Meta.MaximizeFlags.BOTH);
            });
        } else {
            // Fallback: maximize immediately
            window.maximize(Meta.MaximizeFlags.BOTH);
        }
    }
}
