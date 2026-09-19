import { writable, get } from "svelte/store";
import { getLocale, setLocale } from "$lib/paraglide/runtime.js";

/** @type {import('$lib/types.js').UserSettings} */
const defaultSettings = {
    "appendFileExt": false,
    "rememberFileHistory": true,
    "fileContentDisposition": true,
    "stripExif": false,
    "showThumbnails": true,
    "theme": "dark",
    "lang": "en"
}

/**
 *  @type {import('svelte/store').Writable<import('$lib/types.js').UserSettings>}
 */
export const userSettings = writable(defaultSettings)

export const loadSettings = () => {
    const userSettingsVal = localStorage.getItem("user-settings");
    if (!userSettingsVal) return;
    /** @type {import('$lib/types.js').UserSettings} */
    const savedSettings = JSON.parse(userSettingsVal);

    userSettings.update((def) => {
        return Object.assign(def, savedSettings);
    });

    setLocale(savedSettings.lang, { reload: false });
};

export const saveSettings = () => {
    localStorage.setItem("user-settings", JSON.stringify(get(userSettings)));
}
