<script>
  import { onMount } from "svelte";

  export let apiKey = "";
  let copied = false;
  let showKey = false;

  onMount(() => {
    if (!apiKey) {
      apiKey = localStorage.getItem("api_key") || "";
    }
  });

  const copyToClipboard = async () => {
    if (!apiKey) return;
    try {
      await navigator.clipboard.writeText(apiKey);
      copied = true;

      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const toggleVisibility = () => {
    showKey = !showKey;
  };
</script>

<div class="api-key-wrapper">
  <label for="api-key-input">Your API Key</label>
  <div class="input-group">
    <div class="input-container">
      <input
        id="api-key-input"
        type={showKey ? "text" : "password"}
        value={apiKey}
        readonly
        placeholder="No API key found"
      />

      {#if apiKey}
        <button
          class="toggle-btn"
          on:click={toggleVisibility}
          title={showKey ? "Hide key" : "Show key"}
        >
          {showKey ? "Hide" : "Show"}
        </button>
      {/if}
    </div>

    <button
      on:click={copyToClipboard}
      class="copy-btn"
      class:copied
      disabled={!apiKey}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  </div>
</div>

<style lang="scss">
  .api-key-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0;

    label {
      font-size: 0.9rem;
      font-weight: 600;
      opacity: 0.8;
    }
  }

  .input-group {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    width: 100%;
  }

  .input-container {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;

    input {
      width: 100%;
      padding: 0.5rem 3.5rem 0.5rem 0.5rem;
      font-family: monospace;
      background-color: rgba(128, 128, 128, 0.1);
      color: rgb(var(--fg));
      border: 1px solid rgb(var(--primary));
      border-radius: 4px;
      outline: none;

      &:focus {
        box-shadow: 0 0 0 2px rgba(var(--primary), 0.3);
      }

      &::placeholder {
        font-family: sans-serif;
        opacity: 0.5;
      }
    }

    .toggle-btn {
      position: absolute;
      right: 0.25rem;
      background: none;
      border: none;
      color: rgb(var(--fg));
      font-size: 0.8rem;
      cursor: pointer;
      opacity: 0.7;
      padding: 0.25rem 0.5rem;

      &:hover {
        opacity: 1;
        text-decoration: underline;
      }
    }
  }

  .copy-btn {
    padding: 0.5rem 1rem;
    background-color: rgb(var(--primary));
    color: rgb(var(--bg));
    border: 1px solid rgb(var(--primary));
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.copied {
      background-color: #22c55e;
      border-color: #22c55e;
      color: white;
    }
  }
</style>
