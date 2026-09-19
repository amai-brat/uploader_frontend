<script>
    import Icon from "./Icon.svelte";
    import * as m from "$lib/paraglide/messages.js";
</script>

<h2 class="title">
    <Icon class="icon" src="/static/heart.svg"></Icon>
    {m["support.title"]()}
</h2>

<p>
    {m["support.desc_1"]()}<br />
    {m["support.desc_2"]()}
</p>

<p>
    <b>{m["support.donate_request"]()}</b><br />
    <a href="mailto:amai@cock.li" target="_blank"><b>amai@cock.li</b></a>
</p>

<style lang="scss">
    .title {
        color: rgb(var(--fg2));
    }

    .title :global(.icon) {
        vertical-align: middle;
        width: 12pt;
        height: 12pt;
        animation: pulse 0.8s ease-in infinite alternate;
    }

    @keyframes pulse {
        to {
            transform: scale(1.25);
            background-color: #c81919;
        }
    }
</style>
