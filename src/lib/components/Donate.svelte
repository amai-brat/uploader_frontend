<script>
    import Icon from "./Icon.svelte";
</script>

<h2 class="title">
    <Icon class="icon" src="/static/heart.svg"></Icon>
    Support
</h2>

<p>This website is an entirely free and ad-less service sustained without profit in mind.<br />Every donation is greatly appreciated!</p>

<p>
    <b>If you really want to donate, write an email with request to add donation here:</b><br />
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
