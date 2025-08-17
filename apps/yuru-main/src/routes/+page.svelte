<svelte:head>
    <meta property="og:title" content="yurukyan△">
    <meta property="og:description" content="yurukyan system • sydnmc, yuiyamu, kyatarii, and mayniaria">
    <title>yurukyan△</title>
</svelte:head>

<script lang="ts">
    import '@repo/yuru-static/assets/base.css';
    import twitter from '@repo/yuru-static/assets/twitter.png';
    import osu from '@repo/yuru-static/assets/osu.png';
    import discord from '@repo/yuru-static/assets/discord.png';
    import sydPfp from '@repo/yuru-static/assets/sydneypfp.png';
    import lilacPfp from '@repo/yuru-static/assets/lilacpfp.png';
    import hazelPfp from '@repo/yuru-static/assets/hazelpfp.jpg';
    import mayPfp from '@repo/yuru-static/assets/maypfp.png';

    import { getPageRoot, fetchFromApi } from '@repo/yuru-assets';
    import type { sysmember } from '@repo/yuru-assets';

    import { _, locale } from '@repo/i18n';
    import { onMount } from 'svelte';
    import { Locale } from '@repo/yuru-assets';

    import type { alter } from '@repo/yuru-server';

	onMount(async () => {
		const frontList = await fetchFromApi(`recentFronts`);
        processPkInfo(frontList as alter[]);

        locale.subscribe(() => {
            processPkInfo(frontList);
        });
	});

    function dateParser(frontLength: number, isFronting: boolean, lastFrontTime: string) {
        let timeDisplay;
        let frontAgoTime = (Date.now() - Date.parse(lastFrontTime))/1000/60/60/24;
        if (frontAgoTime > 2) { //if someone swapped more than 2 days ago
            if (isFronting) {
                let days = Math.floor((frontLength/1000)/60/60/24);
                let hours = Math.round((frontLength/1000)/60/60) - days*24;
                timeDisplay = $_('yurukyan.home.frontingLong', {values: {days, hours}});
            } else {
                let parsedTime = new Date(lastFrontTime);
                let month = parsedTime.getUTCMonth()+1;
                let day = parsedTime.getUTCDate();
                let year = parsedTime.getUTCFullYear();
                timeDisplay = $_('yurukyan.home.frontedOn', {values: {month, day, year}});
            }
        } else {
            let hours = Math.floor((frontLength/1000)/60/60);
            let minutes = Math.round((frontLength/1000)/60) - hours*60;
            if (isFronting) {
                timeDisplay = $_('yurukyan.home.fronting', {values: {hours, minutes}});
            } else  {
                timeDisplay = $_('yurukyan.home.frontedFor', {values: {hours, minutes}});
            }
        }
        return timeDisplay;
    }

    async function lastFmUpdate() {
        const songInfo = await fetchFromApi('lastfm');
        let isPlaying: boolean;

        try {
            songInfo.recenttracks.track[0]['@attr'].nowplaying //will error since this doesn't exist when not playing
            isPlaying = true;
        } catch {
            isPlaying = false;
        }

        return {
            isPlaying,
            "songURL": songInfo.recenttracks.track[0].url,
            "songMeta": `• ${songInfo.recenttracks.track[0].artist['#text']} - ${songInfo.recenttracks.track[0].name}`,
            "songImg": songInfo.recenttracks.track[0].image[3]['#text']
        };
    }

    let sysmembers: sysmember[] = $state([
        {name: 'sydney', type: "secondary", img: sydPfp, main: false, link: getPageRoot('syd')},
        {name: 'lilac', type: "primary", img: lilacPfp, main: true, link: getPageRoot('lilac')},
        {name: 'hazel', type: "secondary", img: hazelPfp, main: false, link: ''},
        {name: 'may', type: "primary", img: mayPfp, main: false, link: getPageRoot('may')}
    ]);
    let main: sysmember = $state({} as sysmember);
    let sleepyAlters: sysmember[] = $state([]);
    let noFronterAlter = $state({} as sysmember);

    sysmembers.forEach(member => {
        if (member.main) {
            main = member;
        } else {
            sleepyAlters.push(member);
        }
    });

    let pkInfoAru = $state(false);
    function processPkInfo(frontList: alter[]) {
        sleepyAlters = [];
        main = null; //default behavior is to wait for page load and have lilac show up - but in case nobody's fronting, this should be the value of main after
        console.log(frontList);
        for (let i = 0; i < frontList.length; i++) {
            let days = Math.floor(frontList[i].totalFrontTime/1000/60/60/24);
            let hours = Math.round((frontList[i].totalFrontTime/1000/60/60)-days*24);
            let tooltip = `${days} days, ${hours} hours | ${frontList[i].percent}%`;

            let sysdex = sysmembers.findIndex(e => e.name  === frontList[i].name);
            if (sysdex === -1) {
                noFronterAlter.percent = frontList[i].percent;
                noFronterAlter.tooltip = tooltip;
                continue;
            }

            sysmembers[sysdex].fronting = frontList[i].fronting;
            sysmembers[sysdex].percent = frontList[i].percent;
            sysmembers[sysdex].tooltip = tooltip;

            sysmembers[sysdex].text = dateParser(frontList[i].lastFrontTime, frontList[i].fronting, frontList[i].lastFrontTimestamp as string);
            if (frontList[i].fronting) {
                main = sysmembers[sysdex];
            } else {
                sleepyAlters.push(sysmembers[sysdex]);
            }
            console.log(noFronterAlter);
        }
        pkInfoAru = true;
    }

    let linkContainer = ["osugds.moe", "flanstore.yuru.ca", "api.yuru.ca", "jelly.yuru.ca"];
    let personLinkContainer = ["syd.yuru.ca", "lilac.yuru.ca", "may.yuru.ca"];

    let linkId = $state(-1);
    function displayLinkHover(id: number) {
      linkId = id;
    }
</script>

<div id="background"></div>
<header>
    <a class="fa fa-github hidden-link" style="color: white; font-size: 23px;" href="https://github.com/sydnmc/yuru-web" aria-label="github link"></a>
    <Locale mode="home" person="yurukyan" page="home"/>
</header>

<section id="page" class={$locale}>
    <div id="info-box">
    <div id="mobile-button-box">
        <a class="fa fa-github hidden-link" style="color: white; font-size: 23px;" href="https://github.com/sydnmc/yuru-web" aria-label="github link"></a>
        <Locale mode="home" person="yurukyan" page="home"/>
    </div>
    <h1><a id="title" href={getPageRoot('yurukyan')}>yurukyan△</a></h1>
    {#if main}
    <a class="fronter" href={main.link}>
        <div class="fronter-img">
            <img alt="{main.name}'s profile pic" src={main.img}>
        </div>
        <div class="fronter-text">
            <span>{$_(`yurukyan.home.${main.name}`)}</span>
            {#if pkInfoAru}
                <p>{main.text}</p>
            {:else}
                <p>{$_('yurukyan.home.loadingFront')}</p>
            {/if}
        </div>
    </a>
    {:else}
        <span id="nobody-text">{$_('yurukyan.home.noFronter')}</span>
    {/if}

    <div id="alter-container">
        {#each sleepyAlters as person}
        <a class="alter {!main? 'no-front-alter' : ''}" href={person.link}>
            <div class="alter-img">
              <img alt="{person.name}'s profile pic" src={person.img}>
            </div>
            <span class="alter-name">{$_(`yurukyan.home.${person.name}`)}</span>
            {#if pkInfoAru}
                <span class="alter-text">{@html person.text}</span>
            {:else}
                <span class="alter-text">{$_('yurukyan.home.loadingFront')}</span>
            {/if}
        </a>
        {/each}
      </div>

      <div id="front-percent-container">
        <div id="front-percentage">
            {#each sysmembers as person}
            <div class="front-percent-person" style="width: {person.percent}%; background-color: var(--{person.name}-main);">
                <span class="front-percent-hover">{person.name}<br>{person.tooltip}</span>
            </div>
            {/each}
            <div class="front-percent-person" style="width: {noFronterAlter.percent}%; background-color: grey;">
                <span class="front-percent-hover">(no fronter)<br>{noFronterAlter.tooltip}</span>
            </div>
        </div>
      </div>

      <div class="socials-bar socials-bar-big hidden-link">
        <strong>
            <a href="https://twitter.com/sydnmc_"><img src={twitter} alt="twitter logo"> twitter</a>
            <span class="social-divide">|</span>
            <a href="https://osu.ppy.sh/users/14829744"><img src={osu} alt="osu logo"> osu!</a>
            <span class="social-divide">|</span>
            <a href="discord://-/users/226885796739678229"><img src={discord} alt="discord logo"> discord</a>
        </strong>
      </div>

      <div id="lastfm">
        {#await lastFmUpdate()}
            <p class="dark-text">{$_('yurukyan.home.loadingSong')}</p>
        {:then lastFmData}
            <p class="dark-text">
                {#if lastFmData.isPlaying}
                {$_('yurukyan.home.lastFmListening')}
                {:else}
                {$_('yurukyan.home.lastFmListened')}
                {/if}
                <a class="hidden-link" href={lastFmData.songURL}>{lastFmData.songMeta}</a>
                <img class="lastfm-album-img" src={lastFmData.songImg} alt="lastfm album">
            </p>
        {/await}
      </div>
    <span>{$_('yurukyan.home.bio')}</span>
    <p style="margin-bottom: 0;">{$_('yurukyan.home.healing')}</p>
    </div>
    <div id="shima-img">
        <div id="link-container">
            {#each linkContainer as link, i}
                <div>
                    <div class="hover-dot" style="opacity: {linkId === i? 1 : 0}"></div>
                    <a href="https://{link}"
                        onmouseover={() => displayLinkHover(i)}
                        onmouseleave={() => displayLinkHover(-1)}
                        onfocus={() => displayLinkHover(i)}
                        onfocusout={() => displayLinkHover(-1)}>{link}</a>
                </div>
            {/each}
            <div id="link-divide"></div>
            {#each personLinkContainer as link, i}
                <div>
                    <div class="hover-dot" style="opacity: {linkId === i+4? 1 : 0}"></div>
                    <a href="https://{link}"
                        onmouseover={() => displayLinkHover(i+4)}
                        onmouseleave={() => displayLinkHover(-1)}
                        onfocus={() => displayLinkHover(i+4)}
                        onfocusout={() => displayLinkHover(-1)}>{link}</a>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    /* local variables */
    :root {
        --tent: #fce758;
        --shine: linear-gradient(
            90deg,
            rgba(73, 114, 133, 1) 0%,
            rgba(96, 191, 135, 1) 50%,
            rgba(133, 127, 102, 1) 100%
        );
        --accent: #497285;
    }

    #background {
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        background-image: url("/bg.jpg");
        background-size: cover;
        background-position: center;
        filter: blur(12.5px) brightness(0.9);
        z-index: -1;
    }

    .he-IL span {
        direction: rtl;
    }
    .he-IL p {
        direction: rtl;
    }

    /* body/header */
    h1 {
        font-size: 58px;
        padding-left: 15px;
        font-weight: normal;
    }

    header {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: end;
        align-items: center;
        height: 5vh;
        margin-bottom: 0px;
    }
    header a {
        padding-right: 2px; /* gives spacing to the icons */
    }

    #mobile-button-box {
        display: none;
    }

    #page {
        display: flex;
        flex-direction: column;
        text-align: center;
        height: 100vh;
        justify-content: center;
        margin-left: 16%;
        margin-right: 16%;
    }

    #info-box {
        padding: 0 40px 40px 40px;
        border: 3px solid #79b8d4;
        backdrop-filter: brightness(0.5);
        border-radius: 15px;
        font-size: 18px;
    }

    /* main content */
    #title {
        font-family: Kyokasho, sans-serif;
        color: var(--tent);
        font-size: 64px;
        text-decoration: none;
    }

    .fronter {
        display: flex;
        position: relative;
        cursor: pointer;
        width: 90%;
        margin-left: 5%;
        margin-right: 5%;
        height: 90px;
        box-shadow: -2px 8px 20px 6px rgba(0, 0, 0, 0.3);
        transition: 0.3s;
        text-decoration: none;
        color: var(--text);
    }
    .fronter::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 5px;
        padding: 3px;
        background: var(--shine);
        mask:
            linear-gradient(var(--transparent)) content-box,
            linear-gradient(var(--transparent));
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        background-size: 500% auto;
        animation: shine 5s ease-in-out infinite alternate;
    }
    .fronter:hover {
        box-shadow: -2px 8px 20px 16px rgba(0, 0, 0, 0.3); /* increases the spread when you hover over */
        transform: rotate(0.6deg) scale(1.03);
    }

    .he-IL .fronter {
        direction: rtl;
    }

    @keyframes shine {
        0% {
            background-position: 0% 50%;
        }
        100% {
            background-position: 100% 50%;
        }
    }

    .fronter .fronter-img {
        margin: 3px; /* adds back in the 3px padding from the border */
    }

    .fronter-img {
        padding: 3px;
        height: 78px; /* not sure why this is the case, might have to look into it */
    }
    .fronter-img img {
        max-height: 100%; /* limits height growth of fronter imgs */
        border-radius: 5px;
    }

    .fronter-text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        margin-left: 5px;
    }

    .fronter-text span {
        font-family: Kyokasho, sans-serif;
        font-size: 38px;
        color: white;
    }

    .fronter-text p {
        margin: 0px;
    }

    #nobody-text {
        font-size: 17px;
    }

    #alter-container {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
        margin-left: 25px;
        margin-right: 25px;
    }

    .alter {
        display: flex;
        align-items: center;
        position: relative;
        border: 2px solid var(--accent);
        border-radius: 5px;
        cursor: pointer;
        height: 50px;
        width: 32%;
        text-decoration: none;
        color: var(--text);
        box-shadow: -2px 8px 20px 6px rgba(0, 0, 0, 0.3);
        transition: 0.3s;
    }
    .alter:hover {
        box-shadow: -2px 8px 20px 16px rgba(0, 0, 0, 0.3); /* increases the spread when you hover over */
        transform: rotate(2deg) scale(1.03);
    } .no-front-alter {
        width: 24%;
    }

    .alter-img {
        padding: 3px;
        height: 44px; /* not sure why this is the case, might have to look into it */
    }
    .alter-img img {
        max-height: 100%; /* limits height growth of fronter imgs */
        border-radius: 5px;
    }

    .he-IL .alter {
        direction: rtl;
    }

    .alter-name {
        font-family: Kyokasho, sans-serif;
        font-size: 32px;
        color: white;
        margin-right: 12px;
        margin-left: 2px;
    }
    .ja-JP .no-front-alter .alter-name {
        font-size: 20px;
    }
    .de-DE .no-front-alter .alter-name {
        font-size: 24px;
    }

    .alter-text {
        font-size: 14px;
        text-align: left;
    }
    .he-IL .alter-text {
        text-align: right;
        margin-right: 10px;
    }
    .no-front-alter .alter-text {
        font-size: 12px;
    }

    #front-percent-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #front-percentage {
        display: flex;
        width: 90%;
        height: 20px;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .front-percent-hover {
        position: absolute;
        font-family: "Zen Kaku Gothic New", sans-serif;
        font-size: 14px;
        visibility: hidden;
        width: 150px;
        left: calc(
            50% - (150px / 2)
        ); /* position is exactly halfway across the bar */
        bottom: calc(
            20px + 5px + 2px
        ); /* bar is 20px wide, plus 5 for the arrow and 2 for extra spacing~ */
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        text-align: center;
        padding-top: 4px;
        padding-bottom: 4px;
        border-radius: 4px;
        z-index: 1;
    }
    .front-percent-person {
        position: relative;
    }
    .front-percent-person:hover .front-percent-hover {
        /* new class for each bar, just used to make hovers work properly */
        visibility: visible;
    }
    .front-percent-hover::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: black transparent transparent transparent; /* whatever this magic is makes a triangle ehe */
    }

    /* would be nice to align images to some baseline, but nothing seemed to really work */

    .he-IL #lastfm {
        direction: rtl;
    }

    .socials-bar-big a {
        font-size: 30px;
        color: white;
    }
    .socials-bar-big span {
        font-size: 30px;
        color: white;
    }

    .socials-bar img {
        max-width: 16px;
    }

    .socials-bar-big img {
        max-width: 28px;
    }

    .social-divide {
        margin-left: 5px;
        margin-right: 5px;
    }

    .lastfm-album-img {
        width: 35px;
        border-radius: 4px;
        vertical-align: middle;
    }

    #link-container div a {
        text-decoration: none;
    }

    .hover-dot {
        display: inline-block;
        opacity: 0;
        height: 10px;
        width: 10px;
        margin-right: 5px;
        background: radial-gradient(circle,rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
        filter: blur(4px);
        border-radius: 50%;
        transition: opacity 0.15s ease-in;
        vertical-align: middle;
    }

    #shima-img {
        background-image: url("/shima.png");
        height: 230px;
        margin-top: 20px;
        border: 3px solid #79b8d4;
        border-radius: 15px;
    }

    #link-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-right: 55%;
        height: 100%;
    }

    #link-divide {
        height: 3px;
        width: 35%;
        background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.15) 15%,
            rgba(0, 0, 0, 0.15) 85%,
            rgba(0, 0, 0, 0) 100%
        );
        margin-top: 5px;
        margin-bottom: 5px;
    }

    @media only screen and (max-device-width: 1600px) {
        /* alter text breaks around here */
        #page {
            height: auto;
            margin-top: 10px;
        }

        #background {
            height: 127%; /* this is AWFUL but it's the easiest solution */
        }

        #alter-container {
            justify-content: center;
            margin-left: 27px; /* makes it offset other margin */
        }

        .alter {
            margin-right: 2px;
        }

        .alter-text {
            font-size: 11px;
        }
    }

    @media only screen and (max-device-width: 1450px) {
        /* need to bring alters closer now */
        #alter-container {
            flex-direction: column;
            margin-left: 0;
            margin-right: 0;
            align-items: center;
        }

        .alter {
            width: 80%;
            margin-bottom: 4px;
        }

        .alter-text {
            font-size: 14px;
        }

        #shima-img {
            background-position: 43%;
        }
    }

    @media only screen and (max-device-width: 700px) {
        #page {
            margin-left: 3%;
            margin-right: 3%;
            margin-top: 3%;
            margin-bottom: 3%;
        }

        #info-box {
            font-size: 16px;
        }

        #mobile-button-box {
            /* copied from header */
            position: absolute;
            top: 0;
            left: 0;
            width: 101%; /* absolutely horrid disgusting solution LOL */
            display: flex;
            justify-content: end;
            align-items: center;
            height: 30px;
            margin-bottom: 0px;
        }

        header {
            display: none;
        }

        h1 {
            padding-left: 0px;
        }

        #title {
            font-size: 54px;
        }

        .fronter {
            width: 100%;
            margin-left: 0;
            margin-right: 0;
        }

        .fronter-text {
            font-size: 16px;
        }

        .alter {
            width: 100%;
        }

        .alter-text {
            font-size: 11px;
        }

        .ja-JP .alter-name {
            /* tiny bit too big in japanese */
            font-size: 22px;
        }

        .socials-bar-big a {
            font-size: 26px;
        }

        .socials-bar-big img {
            max-width: 20px;
        }
    }
</style>
