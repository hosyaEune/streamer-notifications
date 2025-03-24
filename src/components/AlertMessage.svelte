<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import type { Alert } from '../types/index';
    import { onMount } from 'svelte';
    import { AudioManager } from '../core/AudioManager';

    export let alert: Alert;
    
    const animations = {
        donation: { y: -50 },
        subscription: { x: 100 },
        follow: { y: 50 }
    } ;

    onMount(() => {
        const audioManager = AudioManager.getInstance();

        if (alert.soundPath) {
            console.log('zdec 1')
            audioManager.playSound(alert.soundPath).then(() => {
                console.log('zdec 2')
                if (alert.type === 'donation') {
                audioManager.playSound(alert.voicePath).then(() => {
                    console.log('Voice played');
                });
                }
            });
        }
  });
</script>

<div 
    class="alert"
    class:donation={alert.type === 'donation'}
    class:subscription={alert.type === 'subscription'}
    class:follow={alert.type === 'follow'}
    in:fly={animations[alert.type]}
    out:fade
>
    <div class="content">
        <img src={alert.imagePath} alt="alert image" />

        <h2>{alert.username}</h2>
        {#if alert.type === 'donation'}
            <p class="amount">{alert.amount} RUB</p>
            <p class="message">{alert.message}</p>
        {/if}
    </div>
</div>

<style>
    .alert {
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 10px;
    }
    
    .donation {
        border: 2px solid #ff4444;
    }
    
    .subscription {
        border: 2px solid #44ff44;
    }
    
    .follow {
        border: 2px solid #4444ff;
    }
    
    .content {
        text-align: center;
    }
    
    h2 {
        margin: 0;
        font-size: 24px;
    }
    
    .amount {
        font-size: 20px;
        color: #ff4444;
    }
    
    .message {
        font-style: italic;
    }
</style>