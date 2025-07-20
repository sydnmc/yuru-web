<svelte:head>
    <meta property="og:site_name" content="yurukyan△">
    <meta property="og:title" content="anemone_△">
    <meta property="og:description" content="may's homepage >.<">
    <meta name="theme-color" content="#dee0ed">
    <title>anemone_△</title>
</svelte:head>

<script lang="ts">
    import Header from "$lib/Header.svelte";
    import { _ } from 'svelte-i18n';

    let neneProgress = 0;
    let nenePaused = true;
    function playNene() {
        if (!nenePaused) {
            neneProgress = 0; //lets us spam her, which is really funny
        } else {
            nenePaused = false;
        }
    }
</script>

<Header person="may" page="home"/>
<audio src="/may/nene.ogg" bind:paused={nenePaused} bind:currentTime={neneProgress}></audio>
<h1>hi! o/</h1>
<p style="margin-bottom: 5px;">{@html $_('may.home.intro')}</p>
<p style="margin-top: 0">{@html $_('may.home.intro1')}</p>
<img id="nene" src="/may/cute ass nene.png" alt="nene chibi" on:click={() => playNene()}>

<style>
h1 {
    text-align: center;
    font-size: 28px;
}

p {
    font-size: 18px;
    text-align: center;
}

#nene {
    position: absolute;
    bottom: 0;
    right: 15px;
    animation: nene-jump 1.8s ease-in-out infinite;
    transform-origin: bottom center; /* makes her squishy from the bottom */
}

@keyframes nene-jump {
  0%   { transform: translateY(0) scaleY(1) scaleX(1) }
  20%  { transform: translateY(0) scaleY(0.94) scaleX(1.06) }
  40%  { transform: translateY(-60px) scaleY(1.04) scaleX(0.98)}
  60%  { transform: translateY(0) scaleY(0.9) scaleX(1.1) }
  75%  { transform: translateY(0) scaleY(1.02) scaleX(0.98) }
  100% { transform: translateY(0) scaleY(1) scaleX(1) }
}

</style>