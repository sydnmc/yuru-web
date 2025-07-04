<svelte:head>
    <meta property="og:site_name" content="yurukyan△">
    <meta property="og:title" content="yuiyamu△">
    <meta property="og:description" content="lilac's homepage~">
    <meta name="theme-color" content="#dee0ed">
    <title>yuiyamu△</title>
</svelte:head>

<script lang="ts">
    import Header from "$lib/Header.svelte";
</script>

<Header person="lilac" page="home"/>
    <p class="page-top-text">o/ welcome to lilac.yuru.ca! o/</p>
      <p>hello!! if you don't know who i am, i'm <span style="color: white; font-weight: bold;">lilac</span> / <span style="color: white; font-weight: bold;">yuiyamu</span>.
      <br><br>
        i haven't done a whole ton that i can show off like sydney, but i've <a href="https://lilac.yuru.ca/gds" class="normal-text">mapped a few things on osu</a> and have helped with this website, and other programming projects that sydney is working on.
        if you're curious about what exactly my relation to sydney is, <a href="whoami.html" class="normal-text">click here!</a> it's a bit complicated, so it's okay to not understand too much at first if you aren't used to systems. if you aren't too interested in all the details but don't know me, then basically: if you get along with sydney, you'll probably get along fine with me too~
      <br>
      <br>
    </p>
    <div style="text-align: right; margin-right: 10px;">
      <p>this subdomain will probably a be a bit more personal compared to sydney's, like with this~</p>
      <a href="./whoami.html"><button class="smaller-button">who am i?</button></a>
    </div>
    <div style="padding-bottom: 25px;"></div>
    <div class="socials-bar-big">
      <a href="https://bsky.app/profile/lilac.yuru.ca"><img src="https://api.yuru.ca/images/bluesky.png" alt="bluesky logo"> bluesky</a><span> | </span>
      <a href="https://twitter.com/yuiyamuu"><img src="https://api.yuru.ca/images/twitter.png" alt="twitter logo"> twitter</a><span> | </span>
      <a href="discord://-/users/245588170903781377"><img src="https://api.yuru.ca/images/discord.png" alt="discord logo"> discord</a>
    </div>
    <p style="text-align: center;">^ these are some socials that are specifically mine, if you ever need to get into contact with me ^<br>
      <span style="font-size: 13px">(sydney and i share a few accounts, but these are only mine~)</span></p>


<style>
    /* only used for a few rules defining how the index page should act */
.page-top-text {
    text-align: center;
    font-size: 24px;
    color: white;
    margin-bottom: 0;
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