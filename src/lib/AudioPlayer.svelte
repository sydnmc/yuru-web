<script lang="ts">
  import { addToPageAudioController, playFromAudioController, pauseFromAudioController, currentAudioInfo } from "./audio";
  export let gdInfo: gd;

  let buttonType = "play";
  let audioPlaying = false; //both of these are used for keeping track of audio status locally
  addToPageAudioController(gdInfo); //each map we get, we wanna add it to here, so when one audio plays, the currently playing one gets paused

  let audioProgress = 0;

  let unsubscribeFromAudio;
  function updateAudio() {
    if (audioPlaying) {
      pauseFromAudioController(gdInfo.mapId);
      unsubscribeFromAudio(); //frees up some subscriptions when pausing and unpausing the same song
      audioPlaying = false;
      buttonType = "play";
    } else {
        playFromAudioController(gdInfo.mapId);
        unsubscribeFromAudio = currentAudioInfo.subscribe((audioInfo) => {
        let id = audioInfo.id;
        if ((id !== gdInfo.mapId) && (id > -1)) {  //when id updates, we want to change the button to a play button again >.<
            audioPlaying = false;
            buttonType = "play";
            unsubscribeFromAudio();
        }
        audioProgress = audioInfo.progress;
      });
      audioPlaying = true;
      buttonType = "pause"; //pause button comes on when we're playing :3
    }
  }
</script>

<main class="play-button-side-panel">
    <audio bind:this={audio} src="https://b.ppy.sh/preview/{gdInfo.mapId}.mp3"></audio>
    <div class="play-button-container">
        <i class="fa fa-{buttonType} button"
            style="font-size: 56px;"
            onclick={() => updateAudio()}></i>
            <div class="play-button-ring" style="background: conic-gradient(var(--accent-green) {audioProgress}%, transparent {audioProgress}%)"></div>
    </div>
</main>

<style>
    audio {
        display: none;
    }

    /* play button controller */
    .play-button-side-panel {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.0) 100%);
    }

    .play-button-container {
        position: relative;
        height: 65px;
        width: 65px;
    }

    .play-button-ring {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        /* the background gets continually updated by js, but just to have it here as well:
        * background: conic-gradient(var(--accent-green) 0%, transparent 0%);
        * where both of the percentages are updated to how far along we are~ */
        mask: radial-gradient(circle 40px at center, transparent 34px, black 40px);
        -webkit-mask: radial-gradient(circle 29px at center, transparent 29px, black 29px);
        pointer-events: none; /* makes it so mouse clicks can pass through it */
    }

    .button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%); /* positions it actually in the centre */
        color: var(--accent-green);
        cursor: pointer;
    }
</style>
