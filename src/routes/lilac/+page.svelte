<svelte:head>
    <meta property="og:site_name" content="yurukyan△">
    <meta property="og:title" content="yuiyamu△">
    <meta property="og:description" content="lilac's homepage~">
    <meta name="theme-color" content="#dee0ed">
    <title>yuiyamu△</title>
</svelte:head>

<script lang="ts">
    import Header from "$lib/Header.svelte";
    import { _ } from 'svelte-i18n';
</script>

<Header person="lilac" page="home"/>
<p class="page-top-text">o/ welcome to lilac.yuru.ca! o/</p>
<div id="page">
    <p>{@html $_('lilac.home.intro', {values: {lilac: `<span style="font-weight: bold; color: white">${$_('yurukyan.home.lilac')}</span>`, yuiyamu: `<span style="font-weight: bold; color: white">yuiyamu</span>`}})}</p>
    <p>{@html $_('lilac.home.intro1', {values: {intro1Link: `<a href="https://lilac.yuru.ca/gds" class="normal-text">${$_('lilac.home.intro1Link')}</a>`}})}</p>
    <p>{@html $_('lilac.home.intro2', {values: {intro2Link: `<a href="whoami.html" class="normal-text">${$_('lilac.home.intro2Link')}</a>`}})}</p>

    <div class="socials-bar-big">
      <a href="https://bsky.app/profile/lilac.yuru.ca"><img src="https://api.yuru.ca/images/bluesky.png" alt="bluesky logo"> bluesky</a><span> | </span>
      <a href="https://twitter.com/yuiyamuu"><img src="https://api.yuru.ca/images/twitter.png" alt="twitter logo"> twitter</a><span> | </span>
      <a href="discord://-/users/245588170903781377"><img src="https://api.yuru.ca/images/discord.png" alt="discord logo"> discord</a>
    </div>
    <p style="text-align: center;">{$_('lilac.home.socials')}</p>
    <p style="font-size: 13px">{$_('lilac.home.accountSharing')}</p>
</div>


<style>
#page {
    margin-left: 15%;
    margin-right: 15%;
}

p {
    text-align: center;
}

.page-top-text {
    font-size: 24px;
    color: white;
}

.socials-bar-big {
    text-align: center;
}

.socials-bar-big a {
    font-size: 30px;
    color: white;
    text-decoration: none;
} .socials-bar-big span {
    font-size: 30px;
    color: white;
}

.socials-bar-big img {
    max-width: 28px;
}

@media only screen and (max-device-width: 1000px) {
    img.socials-bar {
        max-width: 5%;
    }
}
</style>