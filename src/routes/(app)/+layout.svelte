<script>
    import { page } from "$app/stores";
    import { dev } from "$app/environment";
    import Icon from "$lib/components/Icon.svelte";
    import {
        loadSettings,
        saveSettings,
        userSettings,
    } from "$lib/userSettings.js";
    import { onMount } from "svelte";
    import Dialog from "$lib/components/Dialog.svelte";
    import Donate from "$lib/components/Donate.svelte";
    import ApiKey from "$lib/components/ApiKey.svelte";

    /** @typedef {import("$lib/types.js").Theme} Theme */

    /** @type {Theme[]} */
    const themes = ["light", "dark", "amoled", "catppuccin"];

    /** @type {HTMLDialogElement} */
    let donateDialog;

    /** @type {HTMLDialogElement} */
    let apiKeyDialog;

    /** @type {string} */
    let apiKey = "";

    /** @type {string | null} */
    let twitchAvatar = null;
    const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
    const BACKEND_URL = dev ? import.meta.env.VITE_LOCAL_BACKEND : "";
    const REDIRECT_URI = dev ? $page.url.href : "";
    
    const twitchLoginUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=`;

    onMount(async () => {
        loadSettings();

        apiKey = localStorage.getItem("api_key") || "";

        const savedAvatar = localStorage.getItem("twitch_avatar");
        if (savedAvatar) {
            twitchAvatar = savedAvatar;
        }

        if (window.location.hash) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const token = hashParams.get("access_token");

            if (token) {
                window.history.replaceState({}, document.title, window.location.pathname);

                try {
                    const backendRes = await fetch(`${BACKEND_URL}/api/key`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ token: token }),
                    });

                    if (backendRes.ok) {
                        const data = await backendRes.json();
                        if (data.api_key) {
                            localStorage.setItem("api_key", data.api_key);
                            apiKey = data.api_key;
                        }
                    }

                    const twitchRes = await fetch("https://api.twitch.tv/helix/users", {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Client-Id": TWITCH_CLIENT_ID,
                        },
                    });

                    if (twitchRes.ok) {
                        const twitchData = await twitchRes.json();
                        const avatarUrl = twitchData.data[0].profile_image_url;
                        
                        twitchAvatar = avatarUrl;
                        localStorage.setItem("twitch_avatar", avatarUrl);
                    }
                } catch (err) {
                    console.error("Failed to authenticate with Twitch:", err);
                }
            }
        }
    });

    const changeTheme = (
        /** @type {MouseEvent} */ e,
        /** @type {Theme} */ theme,
    ) => {
        e.preventDefault();

        $userSettings.theme = theme;
        saveSettings();
    };
</script>

<svelte:head>
    <title
        >{$page.url.hostname}{(() => {
            const path = $page.url.pathname.slice(1);
            return path ? ` / ${path}` : "";
        })()}</title
    >
    <link
        rel="stylesheet"
        href="/static/styles/{$userSettings.theme || 'dark'}.css"
    />
</svelte:head>

<main>
    <div class="wrapper">
        <Dialog bind:node={donateDialog}>
            <section>
                <Donate></Donate>
            </section>
        </Dialog>
        <Dialog bind:node={apiKeyDialog}>
            <section>
                <ApiKey {apiKey}></ApiKey>
            </section>
        </Dialog>

        <h1 class="name pride">{$page.url.hostname}</h1>

        <nav>
            <div class="nav-left">
                <ul>
                    <li>
                        <a
                            aria-current={$page.url.pathname === "/"
                                ? "page"
                                : undefined}
                            href="/">Home</a
                        >
                    </li>
                    <li>
                        <a
                            aria-current={$page.url.pathname === "/uploaders"
                                ? "page"
                                : undefined}
                            href="/uploaders">Uploaders</a
                        >
                    </li>
                </ul>
            </div>
            <div>
                <ul class="nav-links">
                    <li>
                        {#if twitchAvatar}
                            <button 
                              style="all: unset;"
                              on:click={(e) => {
                                e.preventDefault();
                                apiKeyDialog.showModal();
                            }}>
                              <img src={twitchAvatar} alt="Twitch Avatar" class="twitch-avatar" title="Connected to Twitch" />
                            </button>
                        {:else}
                            <a href={twitchLoginUrl}>Connect with Twitch</a>
                        {/if}
                    </li>
                    <li>
                        <a
                            href="https://github.com/amai-brat/uploader_frontend"
                            target="_blank">GitHub</a
                        >
                    </li>
                    <li>
                        <a
                            class="support-btn"
                            href="/"
                            on:click={(e) => {
                                e.preventDefault();
                                donateDialog.showModal();
                            }}
                        >
                            <Icon class="icon" src="/static/heart.svg"></Icon>
                            Support
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        <hr />

        <noscript>JavaScript is required for this website.</noscript>

        <details class="settings">
            <summary>Settings</summary>
            <div class="container">
                <div class="option themes">
                    <span>Theme:</span>
                    {#each themes as theme}
                        <a
                            href="/"
                            class="theme-name"
                            on:click={(e) => changeTheme(e, theme)}>{theme}</a
                        >
                    {/each}
                </div>
                <label class="option">
                    <input
                        type="checkbox"
                        id="file-ext"
                        name="file-ext"
                        bind:checked={$userSettings.appendFileExt}
                        on:change={saveSettings}
                    />
                    Append file extension to URL
                </label>
                <label class="option">
                    <input
                        type="checkbox"
                        id="file-history"
                        name="file-history"
                        bind:checked={$userSettings.rememberFileHistory}
                        on:change={saveSettings}
                    />
                    Remember upload history, stored locally
                </label>
                <label class="option">
                    <input
                        type="checkbox"
                        id="file-disposition"
                        name="file-disposition"
                        bind:checked={$userSettings.fileContentDisposition}
                        on:change={saveSettings}
                    />
                    Share your file's original name&nbsp;
                    <span
                        class="tooltip"
                        title="Enabling this will show your file's original (local) name to other users in supported browsers; e.g. when saving."
                        >( ? )</span
                    >
                </label>
                <label class="option">
                    <input
                        type="checkbox"
                        id="file-stripexif"
                        name="file-stripexif"
                        bind:checked={$userSettings.stripExif}
                        on:change={saveSettings}
                    />
                    Entirely strip Exif data from image
                </label>
                <label class="option">
                    <input
                        type="checkbox"
                        id="file-showthumb"
                        name="file-showthumb"
                        bind:checked={$userSettings.showThumbnails}
                        on:change={saveSettings}
                    />
                    Show file thumbnails
                </label>
            </div>
        </details>

        <slot />
    </div>
</main>

<style lang="scss">
    :root {
        --font-body: "Noto Sans", sans-serif, -apple-system, "Helvetica Neue";
    }

    main {
        display: flex;
        justify-content: center;
        min-height: 100vh;
        margin: 0;
        background-color: rgb(var(--bg));
        font-family: var(--font-body);
        color: rgb(var(--fg));
    }

    h1 {
        font-weight: 400;
    }

    [aria-current="page"] {
        text-decoration: overline;
    }

    h1 {
        font-size: 2rem;
    }

    input {
        font-size: inherit;
        font-family: inherit;
        margin-left: 0;
        accent-color: rgb(var(--primary));

        &:focus:not(:focus-visible) {
            outline: none;
        }
    }

    @media screen and (max-width: 800px) {
        .wrapper {
            width: 100%;
        }
    }

    .wrapper {
        width: 800px;
        padding: 10px;
    }

    .settings {
        display: flex;
        background-color: rgb(var(--bg_h));
        width: fit-content;
        border-radius: 0.45rem;
        gap: 2px;
        flex-direction: column;

        outline: 1px solid rgb(var(--outl2));

        &[open] {
            background-color: rgb(var(--bg2));
            summary {
                // margin-bottom: 5px;
                border-bottom: 2px solid rgb(var(--primary));
            }
        }

        summary {
            cursor: pointer;
            padding: 0.35rem 1rem 0.35rem 1rem;
        }

        .container {
            display: flex;
            flex-direction: column;
            padding: 0.25rem 0.5rem;
        }
    }

    .option {
        display: flex;
        align-items: center;
        max-width: max-content;
    }

    .themes {
        gap: 1ch;
        margin: 5px 0;
    }

    nav {
        display: flex;
    }

    .nav-left {
        margin-right: auto;
    }

    .nav-links {
        gap: 0.35rem;
    }

    .tooltip {
        cursor: help;
        text-decoration: underline dotted;
    }

    .name {
        display: inline-block;
        margin: 0;
        overflow: auto;
        font-weight: 500;
        text-shadow: 1px 1px 1px rgb(var(--fg) / 0.3);
    }

    hr {
        margin: 1rem 0 1rem;
        border: 2px solid rgb(var(--primary));
        border-radius: 0.45rem;
        margin: 0.35rem 0 1rem 0;
    }

    ul {
        display: flex;
        height: 22px;
        flex-direction: row;
        padding: 0;
        margin: 0;
        list-style-type: none;
    }

    li {
        display: inline-flex;
        height: 100%;
        align-items: center;
        &:not(:last-child)::after {
            content: "•";
            margin: 0 0.5ch;
        }
    }

    .twitch-avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid rgb(var(--outl2));
    }

    .support-btn {
        color: rgb(var(--fg2));
        display: flex;
        height: 100%;
        font-weight: 500;
        background-color: rgb(var(--bg2));
        border-radius: 0.25rem;
        align-items: center;
        padding: 0 0.35rem;

        outline: 1px solid rgb(var(--outl2));

        :global(.icon) {
            margin-right: 2px;
            width: 1em;
            height: 1em;
            animation: pulse 1.5s ease-in infinite alternate;
        }

        @keyframes pulse {
            to {
                transform: scale(1.25);
                background-color: #c81919;
            }
        }

        &:hover :global(.icon) {
            background-color: #c81919;
        }
    }

    .theme-name {
        text-transform: capitalize;
    }

    .pride {
        background-image: linear-gradient(
            to right,
            #e50000,
            #ff8d00,
            #ffee00,
            #028121,
            #004cff,
            #770088
        );
        background-clip: text;
        color: transparent;
    }
</style>
