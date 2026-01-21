<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { activeServerId } from '$lib/stores/servers';
  import { serverStatus } from '$lib/stores/server';
  import { showToast } from '$lib/stores/ui';
  import { getServerCompose, saveServerCompose, regenerateServerCompose } from '$lib/services/api';

  let composeContent = $state('');
  let isLoading = $state(false);
  let isSaving = $state(false);
  let hasChanges = $state(false);

  async function loadCompose(): Promise<void> {
    if (!$activeServerId) return;
    isLoading = true;
    const result = await getServerCompose($activeServerId);
    isLoading = false;
    if (result.success && result.content) {
      composeContent = result.content;
      hasChanges = false;
    }
  }

  async function handleSave(): Promise<void> {
    if (!$activeServerId || $serverStatus.running) return;
    isSaving = true;
    const result = await saveServerCompose($activeServerId, composeContent);
    isSaving = false;
    if (result.success) {
      showToast($_('composeSaved'));
      hasChanges = false;
    } else {
      showToast(result.error || 'Error', 'error');
    }
  }

  async function handleRegenerate(): Promise<void> {
    if (!$activeServerId || $serverStatus.running) return;
    if (!confirm($_('regenerateCompose') + '?')) return;
    
    isLoading = true;
    const result = await regenerateServerCompose($activeServerId);
    isLoading = false;
    if (result.success && result.content) {
      composeContent = result.content;
      hasChanges = false;
      showToast($_('composeRegenerated'));
    } else {
      showToast(result.error || 'Error', 'error');
    }
  }

  function handleInput(): void {
    hasChanges = true;
  }

  // Load on mount and when server changes
  $effect(() => {
    if ($activeServerId) {
      loadCompose();
    }
  });
</script>

<div class="config-section">
  <div class="config-header">
    <h3>{$_('dockerCompose')}</h3>
    <div class="config-actions">
      <button 
        class="mc-btn small" 
        onclick={handleRegenerate}
        disabled={$serverStatus.running || isLoading}
        title={$_('regenerateCompose')}
      >
        ↻
      </button>
    </div>
  </div>

  {#if $serverStatus.running}
    <div class="offline-notice">
      <span>⚠</span> {$_('stopServerToEdit')}
    </div>
  {/if}

  {#if isLoading}
    <div class="config-loading">{$_('loading')}</div>
  {:else}
    <textarea
      class="compose-editor"
      bind:value={composeContent}
      oninput={handleInput}
      disabled={$serverStatus.running}
      spellcheck="false"
    ></textarea>
  {/if}

  <div class="config-footer">
    <span class="config-hint">{$_('editCompose')}</span>
    <button 
      class="mc-btn primary small"
      onclick={handleSave}
      disabled={$serverStatus.running || isSaving || !hasChanges}
    >
      {isSaving ? '...' : $_('save')}
    </button>
  </div>
</div>

<style>
  .config-section {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .config-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .config-header h3 {
    font-size: 14px;
    color: var(--hytale-orange);
    margin: 0;
  }

  .config-actions {
    display: flex;
    gap: 4px;
  }

  .config-loading {
    padding: 20px;
    text-align: center;
    color: var(--text-dim);
  }

  .compose-editor {
    flex: 1;
    min-height: 200px;
    background: var(--mc-darker);
    border: 2px solid var(--mc-border-light);
    color: var(--text);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    padding: 8px;
    resize: none;
    line-height: 1.4;
  }

  .compose-editor:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .config-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--mc-border-light);
  }

  .config-hint {
    font-size: 11px;
    color: var(--text-dim);
  }
</style>
