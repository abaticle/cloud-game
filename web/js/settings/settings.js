/**
 * App settings module.
 *
 * @version 1
 */
const settings = (() => {
    const revision = 1;

    let settings = {
        _version: revision
    };

    const localStorageProvider = (() => {
        const settingsKey = 'settings';
        const isSupported = _isSupported();

        const _save = () => localStorage.setItem(settingsKey, _export(settings));

        function _isSupported() {
            const testKey = 'test_' + Math.random().toString(36).substring(5);
            try {
                localStorage.setItem(testKey, testKey);
                localStorage.removeItem(testKey);
                return true;
            } catch (e) {
                return false;
            }
        }

        const get = (key) => JSON.parse(localStorage.getItem(key));

        const set = (key, value) => {
            settings[key] = value;
            _save();
        }

        const loadSettings = () => {
            if (!localStorage.getItem(settingsKey)) _save();
            settings = JSON.parse(localStorage.getItem(settingsKey));
        }

        return {
            get,
            set,
            loadSettings,
            isSupported,
        }
    });

    // setting a data provider
    let provider = localStorageProvider();

    const _import = () => {
    }

    const _export = (data) => JSON.stringify(data, null, 2);

    const init = () => {
        if (!provider.isSupported) return;

        provider.loadSettings();

        if (revision !== settings._version) {
            // !to handle this as migrations
        }
    }

    const get = () => settings

    const loadOr = (key, default_) => {
        if (provider.isSupported) {
            if (settings.hasOwnProperty(key)) return settings[key];
            provider.set(key, default_);
        }

        return default_;
    }

    init();

    return {
        get,
        loadOr,
        import: _import,
        export: _export
    }
})(JSON, localStorage, Math);
