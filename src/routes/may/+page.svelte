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

<div id="background"></div>
<Header person="may" page="home"/>
<audio src="/may/nene.ogg" bind:paused={nenePaused} bind:currentTime={neneProgress}></audio>
<h1>{$_('may.home.hi')}</h1>
<p style="margin-bottom: 5px;">{@html $_('may.home.intro')}</p>
<p style="margin-top: 0">{@html $_('may.home.intro1')}</p>
<div style="display: flex; justify-content: center">
    <div class="divider"></div>
</div>
<div id="socials">
    <a href="discord://-/users/1181855270809370775">
        <img src="/common/discord.png" alt="discord"/>
        <span>discord</span>
    </a>
    <span>{$_('may.home.platform')}</span>
</div>
<img id="nene" src="/may/cute ass nene.png" alt="nene chibi" on:click={() => playNene()} />

<style>
#background {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-image: url('/may/mmj sekai.webp');
    background-size: cover;
    background-position: center;
    filter: brightness(0.15);
    z-index: -1;
}

h1 {
    text-align: center;
    font-size: 28px;
}

p {
    font-size: 18px;
    text-align: center;
}

.divider {
    height: 3px;
    width: 35%;
    background: linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 15%, rgba(255, 255, 255, 0.4) 85%, rgba(255, 255, 255, 0) 100%);
    margin-top: 10px;
    margin-bottom: 20px;
}

#socials {
    text-align: center;
} #socials a {
    text-decoration: none;
} #socials a img {
    width: 24px;
} #socials a span {
    color: white;
    font-size: 24px;
    margin-left: 3px;
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
