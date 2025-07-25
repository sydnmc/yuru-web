<script lang="ts">
  import { addToPageAudioController, playFromAudioController, pauseFromAudioController, audioInfo } from "./audio";
  import { onMount } from 'svelte'; //makes sure we account for SSR pages too
  export let mapId: number;
  export let person: string;

  let showPanel = false;
  function openPanel() {
    showPanel = true;
  } 
  function closePanel() {
    showPanel = false;
  }

  onMount(() => {
    let audio = new Audio(`https://b.ppy.sh/preview/${mapId}.mp3`); //creates audio html elements for each audio we have
    addToPageAudioController(mapId, audio); //each map is added to here so when one audio plays, the currently playing one gets paused
  });

  let buttonType = "play";
  let audioProgress = 0;
  let audioPlaying = false; //all of these are used for keeping track of audio status locally

  let unsub: (() => void) | undefined;
  function startWatchingProgress() {
    unsub = audioInfo.subscribe((info) => {
      audioProgress = info.progress;
      showPanel = true; //constantly forces the panel open while playing
      if (info.id !== mapId) {
        buttonType = "play";
        audioPlaying = false;
        showPanel = false;
        unsub?.();
      }
    });
  }

  function updateAudio() {
    if (audioPlaying) {
        unsub?.();
        pauseFromAudioController(mapId);
        buttonType = "play";
        audioPlaying = false;
    } else {
        startWatchingProgress();
        playFromAudioController(mapId);
        buttonType = "pause";
        audioPlaying = true;
    }
  }
</script>

<main class="play-button-side-panel" onmouseover={() => openPanel()} onmouseleave={() => closePanel()} onfocus={() => openPanel} onfocusout={() => closePanel()} style="opacity: {showPanel? '1' : '0'}">
  <div class="play-button-container">
    <i class="fa fa-{buttonType} button" style="font-size: 56px; color: var(--{person}-main)" onclick={() => updateAudio()}></i>
    <div class="play-button-ring" style="background: conic-gradient(var(--{person}-main) {audioProgress}%, transparent {audioProgress}%)"></div>
  </div>
</main>

<style>
.play-button-side-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%);
  transition: opacity 0.1s ease-in-out; 
}

.play-button-container {
  position: relative;
  height: 100px;
  width: 100px;
}

.play-button-ring {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  mask: radial-gradient(circle 1px at center, transparent 42px, black 1px);
  -webkit-mask: radial-gradient(circle 1px at center, transparent 42px, black 1px);
  pointer-events: none; /* makes it so mouse clicks can pass through it */
}

.button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* positions it actually in the centre */
  color: var(--lilac-main); /* mainly as a failsafe, since it actually gets set above */
  cursor: pointer;
}
</style>
