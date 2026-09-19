<script>
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { userSettings } from "$lib/userSettings";
    import * as m from "$lib/paraglide/messages.js";

    const url = $page.url.origin;

    let sharexConfigURL = new URL(`${url}/config.sxcu`);

    const endpoints = {
        upload: `${url}/api/upload`,
        delete: `${url}/api/delete`,
        object: `${url}/api/object`,
    };

    $: {
        if ($userSettings.fileContentDisposition) {
            sharexConfigURL.searchParams.delete("skip-cd");
        } else {
            sharexConfigURL.searchParams.set("skip-cd", "true");
        }

        if ($userSettings.appendFileExt) {
            sharexConfigURL.searchParams.set("ext", "true");
        } else {
            sharexConfigURL.searchParams.delete("ext");
        }
        sharexConfigURL = sharexConfigURL;
    }
</script>

<div>
    <details open>
        <summary>ShareX</summary>
        {#if browser}
            <p>
                <a
                    href={sharexConfigURL.toString()}
                    data-umami-event="sharex-download">{m["uploaders.click_here"]()}</a
                > {m["uploaders.download_sharex"]()}
            </p>
        {/if}
    </details>
</div>

<div>
    <details open>
        <summary>Chatterino</summary>
        <div>
            <p>{m["uploaders.chatterino_path"]()}</p>

            <table>
                <tr>
                    <th>{m["uploaders.request_url"]()}</th>
                    <td
                        >{endpoints.upload}{!$userSettings.fileContentDisposition
                            ? "?skip-cd=true"
                            : ""}</td
                    >
                </tr>
                <tr>
                    <th>{m["uploaders.form_field"]()}</th>
                    <td>file</td>
                </tr>
                <tr>
                    <th>{m["uploaders.image_link"]()}</th>
                    <td
                        >{`{link}${$userSettings.appendFileExt ? "{ext}" : ""}`}</td
                    >
                </tr>
                <tr>
                    <th>{m["uploaders.deletion_link"]()}</th>
                    <td>{"{delete}"}</td>
                </tr>
            </table>
        </div>
    </details>
</div>

<div>
    <details>
        <summary>
            <a
                target="_blank"
                href="https://play.google.com/store/apps/details?id=com.flxrs.dankchat&ref=segs.lol"
                data-umami-event="dankchat-link">DankChat</a
            >
        </summary>
        <p>
            {m["uploaders.dankchat_desc1"]()}<br />
            {m["uploaders.dankchat_desc2"]()}
            <a target="_blank" href="https://kappa.lol/">kappa.lol</a>.
        </p>
    </details>
</div>

<div>
    <details>
        <summary>API</summary>
        <div>
            <table>
                <tr>
                    <th>{m["uploaders.upload"]()}</th>
                    <td class="code">
                        curl "{endpoints.upload}" -F
                        "file=@/home/supa/kappa.png"
                    </td>
                </tr>
            </table>
            <div class="r">
                <pre>content-type: application/json</pre>
                <pre>{JSON.stringify(
                        {
                            id: "${id}",
                            ext: ".png",
                            type: "image/png",
                            checksum: "${md5}",
                            key: "${key}",
                            link: `${$page.url.origin}/\${id}`,
                            delete: `${$page.url.origin}/delete?\${key}`,
                        },
                        null,
                        4,
                    )}</pre>
            </div>
        </div>
        <div>
            <table>
                <tr>
                    <th>{m["uploaders.delete"]()}</th>
                    <td class="code">
                        curl "{endpoints.delete}?key=$fileKey"
                    </td>
                </tr>
            </table>
            <div class="r">
                <pre>content-type: application/json</pre>
                <pre>{JSON.stringify({ success: true }, null, 4)}</pre>
            </div>
        </div>
        <div>
            <table>
                <tr>
                    <th>{m["uploaders.object"]()}</th>
                    <td class="code">
                        curl "{endpoints.object}?id=$fileId"
                    </td>
                </tr>
            </table>
            <div class="r">
                <pre>content-type: application/json</pre>
                <pre>{JSON.stringify(
                        {
                            id: "${id}",
                            type: "${mimetype}",
                            date: "${Number(unixUploadTimeMS)}",
                            size: "${Number(bytes)}",
                            checksums: { md5: "${md5}" },
                            name: "${filename} (nullable)",
                        },
                        null,
                        4,
                    )}</pre>
            </div>
        </div>
    </details>
</div>

<style>
    summary {
        margin-top: 10px;
        margin-bottom: 0;
        font-weight: 500;
        font-size: 2em;
        cursor: pointer;
    }

    details p {
        margin-top: 0;
    }

    .r {
        border-left: 1px solid rgb(var(--fg));
        padding: 0 10px;
        margin: 5px;
    }

    table {
        border-spacing: 2px;
        border-collapse: separate;
    }

    td {
        padding: 3px;
        background-color: rgb(var(--bg2));
        border-radius: 5px;
    }

    th {
        text-align: inherit;
    }

    .code {
        font-family: monospace;
        background-color: rgb(var(--bg0));
    }
</style>
