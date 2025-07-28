<script lang="ts">
  import { changeVolume, audioInfo } from "./audio";
  export let person: string;

  let display = false;
  let volume = 0.2;
  let error = false;

  audioInfo.subscribe((info) => {
    display = info.currentlyPlaying;
    error = info.error;
  });
</script>

{#if error}
<div style="background-color: var(--error);" class="main error">
    <span>song preview error &gt;_&lt;;;</span>
</div>
{:else}
<div class="main" style="background-color: var(--{person}-main);" class:slide-away={!display}>
    <span>volume: </span>
    <input type="range" min="0" max="1" step="0.01" bind:value={volume} oninput={() => changeVolume(volume)} style="background: linear-gradient(to right, #79b8d4 0%, #79b8d4 {volume*100}%, white {volume*100}%, white 100%);">
</div>
{/if}


<style>
:root {
    --error: #e35540;
}

.main {
    position: fixed;
    display: flex;
    align-items: center;
    bottom: 0;
    right: 0;
    width: 350px;
    height: 40px;
    border-top-left-radius: 15px;
    animation: slide-come 0.2s forwards;
}

.error {
    display: flex;
    justify-content: center;
}

.slide-away {
    animation: slide-away 0.2s forwards;
}

@keyframes slide-come {
    from {bottom: -100px; opacity: 0}
    to {bottom: 0; opacity: 1}
}

@keyframes slide-away {
    from {bottom: 0; opacity: 1}
    to {bottom: -100px; opacity: 0}
}

span {
    font-weight: bold;
    color: white;
    margin-left: 8px;
}

input[type=range] {
    margin-left: 10px;
    margin-right: 20px;
    width: 100%;

    height: 5px;
    border-radius: 5px;
    outline: none;
    appearance: none;
} input[type=range]:focus {
    outline: none;
}
</style>
