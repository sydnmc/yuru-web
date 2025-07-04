<svelte:head>
    <meta property="og:site_name" content="yurukyan△">
    <meta property="og:title" content="homepage">
    <meta property="og:description" content="yurukyan△ system's personal webpage">
    <meta name="theme-color" content="#FCE758">
    <title>yurukyan△</title>
</svelte:head>

<script lang="ts">
    import { onMount } from 'svelte';

    const endpoint = "https://api.yuru.ca"; //endpoint (backend)
    async function fetchFromApi(apiEndpoint: string) {
        let response = await fetch(`${endpoint}/${apiEndpoint}`);
        return await response.json();
    }

	let frontList: any = null;
	onMount(async () => {
		frontList = await fetchFromApi(`pkInfo?frontList=true&before=30`);
        processPkInfo(frontList);
	});

    function dateParser(frontLength: number, isFronting: boolean, jp: boolean, lastFrontTime: string) {
        let timeDisplay;
        let frontAgoTime = (Date.now() - Date.parse(lastFrontTime))/1000/60/60/24;
        if (frontAgoTime > 2) {
            let parsedTime = new Date(lastFrontTime);
            if (isFronting) {
                let days = Math.floor((frontLength/1000)/60/60/24);
                let hours = Math.round((frontLength/1000)/60/60) - days*24;
                if (jp) {
                    timeDisplay = `${days}日間${hours}時間`;
                } else {
                    timeDisplay = `for ${days} day(s), ${hours} hours`;
                }
            } else {
                if (jp) {
                    timeDisplay = `最新の目覚めは${parsedTime.getUTCFullYear()}年${parsedTime.getUTCMonth()+1}月${parsedTime.getUTCDate()}日でした`;
                } else {
                    timeDisplay = `❀ last fronted on ❀<br>${parsedTime.getUTCMonth()+1}/${parsedTime.getUTCDate()}/${parsedTime.getUTCFullYear()}`;
                }
            }
        } else {
            let hours = Math.floor((frontLength/1000)/60/60);
            let minutes = Math.round((frontLength/1000)/60) - hours*60;
            if (isFronting) {
                if (jp) {
                    timeDisplay = `${hours}時間${minutes}分`;
                } else {
                    timeDisplay = `for ${hours} hours, ${minutes} minutes`;
                }
            } else  {
                if (jp) {
                    timeDisplay = `意識時間は${hours}時間${minutes}分でした`;
                } else {
                    timeDisplay = `❀ last fronted for ❀<br>${hours} hours, ${minutes} minutes`;
                }
            }
        }
        return timeDisplay;
    }

    /* checking for page language */
    const jp = false;

    async function lastFmUpdate() {
        let songInfo = await fetchFromApi('songInfo');
        let preText;

        try {
            songInfo.recenttracks.track[0]['@attr'].nowplaying //will error since this doesn't exist when not playing
            if (jp) {
                preText = "今聞いているの曲";
            } else {
                preText = "currently listening to";
            }
        } catch {
            if (jp) {
                preText = "最後聞いたの曲";
            } else {
                preText = "last listened to";
            }
        }

        return {
            "songURL": songInfo.recenttracks.track[0].url,
            "songMeta": `• ${songInfo.recenttracks.track[0].artist['#text']} - ${songInfo.recenttracks.track[0].name}`,
            "songType": preText,
            "songImg": songInfo.recenttracks.track[0].image[3]['#text']
        };
    }

    let sysmembers: sysmember[] = [
        {name: "sydney", type: "secondary", img: "https://api.yuru.ca/images/sydneypfp.png", main: false},
        {name: "lilac", type: "primary", img: "https://api.yuru.ca/images/lilacpfp.png", main: true},
        {name: "hazel", type: "secondary", img: "https://api.yuru.ca/images/hazelpfp.jpg", main: false},
        {name: "may", type: "primary", img: "https://api.yuru.ca/images/maypfp.jpg", main: false}
    ];
    let main: sysmember;
    let sleepyAlters: sysmember[] = [];

    sysmembers.forEach(member => {
        if (member.main) {
            main = member;
        } else {
            sleepyAlters.push(member);
        }
    });

    function processPkInfo(frontList: any) {
        sleepyAlters = [];
        for (let i = 0; i < sysmembers.length; i++) {
            sysmembers[i].fronting = frontList[i].isFronting;
            sysmembers[i].percent = frontList[i].memberPercent;
        
            let days = Math.floor(frontList[i].memberTime/1000/60/60/24);
            let hours = Math.round((frontList[i].memberTime/1000/60/60)-days*24);
            sysmembers[i].tooltip = `${days} days, ${hours} hours | ${sysmembers[i].percent}%`;

            sysmembers[i].text = dateParser(frontList[i].lastFrontAmount, frontList[i].isFronting, jp, frontList[i].lastFrontTimestamp);
        
            if (frontList[i].isFronting) {
                main = sysmembers[i];
            } else {
                sleepyAlters.push(sysmembers[i]);
            }
        }
    }
</script>

<div id="background"></div>
<header>
    <a class="fa fa-github hidden-link" style="color: white; font-size: 22px;" href="https://github.com/sydnmc/yuru-web" aria-label="github link"></a>
    <a class="fa fa-globe hidden-link" style="color: white; font-size: 22px;" href="index-ja_jp.html" aria-label="translate page to japanese"></a>
</header>
<section id="page">
    <div id="info-box">
    <div id="mobile-button-box">
        <a class="fa fa-github hidden-link" style="color: white; font-size: 22px;" href="https://github.com/sydnmc/yuru-web" aria-label="github link"></a>
        <a class="fa fa-globe hidden-link" style="color: white; font-size: 22px;" href="index-ja_jp.html" aria-label="translate page to japanese"></a>
    </div>
    <h1><a id="title" href="https://yuru.ca">yurukyan△</a></h1>
    <a class="fronter" href="https://{main.name}.yuru.ca/">
        <div class="fronter-img">
            <img alt="{main.name}'s profile pic" src={main.img}>
        </div>
        <div class="fronter-text">
            <span>{main.name}</span>
            {#if frontList}
                <p>{main.text}</p>
            {:else}
                <p>loading front info...</p>
            {/if}
        </div>
    </a>

    <div id="alter-container">
        {#each sleepyAlters as person}
        <a class="alter" href="https://{person.name}.yuru.ca">
            <div class="alter-img">
              <img alt="{person.name}'s profile pic" src={person.img}>
            </div>
            <span class="alter-name">{person.name}</span>
            {#if frontList}
                <span class="alter-text">{@html person.text}</span>
            {:else}
                <span class="alter-text">loading front info...</span>
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
        </div>
      </div>
      
      <div class="socials-bar socials-bar-big hidden-link">
        <strong>
            <a href="https://twitter.com/sydnmc_"><img src="/common/twitter.png" alt="twitter logo"> twitter</a>
            <span class="social-divide">|</span>
            <a href="https://osu.ppy.sh/users/14829744"><img src="/common/osu.png" alt="osu logo"> osu!</a>
            <span class="social-divide">|</span>
            <a href="discord://-/users/226885796739678229"><img src="/common/discord.png" alt="discord logo"> discord</a>
        </strong>
      </div>
      
      <div>
        {#await lastFmUpdate()}
            <p class="dark-text">retrieving song info...</p>
        {:then lastFmData}
            <p class="dark-text">{lastFmData.songType}
                <a style="color: rgb(180 181 191); text-decoration: none;" href={lastFmData.songURL}>{lastFmData.songMeta}</a>
                <img class="lastfm-album-img" src={lastFmData.songImg} alt="lastfm album">
            </p>
        {/await}
      </div>
    <span>19 | she/her | 日本語もOK | 🍁</span>
    <p style="margin-bottom: 0;">۶ৎ˗ˏˋ ♡ ˎˊ˗.ᐟ doing our best to heal together</p>
    </div>
    <div id="shima-img">
        <div id="link-container">
                <a href="https://osugds.moe">osugds.moe</a>
                <a href="https://flanstore.yuru.ca">flanstore.yuru.ca</a>
                <a href="https://api.yuru.ca">api.yuru.ca</a>
                <a href="https://jelly.yuru.ca">jelly.yuru.ca</a>

                <div id="link-divide"></div>
                <a href="https://syd.yuru.ca">syd.yuru.ca</a>
                <a href="https://lilac.yuru.ca">lilac.yuru.ca</a>
                <a href="https://may.yuru.ca">may.yuru.ca</a>
        </div>
    </div>
</section>

<style>
/* local variables */
:root {
    --tent: #FCE758;
    --shine: linear-gradient(90deg,rgba(73, 114, 133, 1) 0%, rgba(96, 191, 135, 1) 50%, rgba(133, 127, 102, 1) 100%);
    --accent: #497285;
}

#background {
    position: absolute;
    height: 100%;
    min-height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-image: url('/yurukyan/bg.jpg');
    background-size: cover;
    background-position: center;
    z-index: -1;
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
    padding-right: 8px; /* gives spacing to the icons */
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
    backdrop-filter: blur(5px) brightness(0.5);
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
    box-shadow: -2px 8px 20px 6px rgba(0,0,0,0.3);
    transition: 0.3s;
    text-decoration: none;
    color: var(--text);
} .fronter::before {
    content: '';
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
} .fronter:hover {
    box-shadow: -2px 8px 20px 16px rgba(0,0,0,0.3); /* increases the spread when you hover over */
    transform: rotate(0.6deg) scale(1.03);
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
} .fronter-img img {
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
    box-shadow: -2px 8px 20px 6px rgba(0,0,0,0.3);
    transition: 0.3s;
} .alter:hover {
    box-shadow: -2px 8px 20px 16px rgba(0,0,0,0.3); /* increases the spread when you hover over */
    transform: rotate(2deg) scale(1.03);
}

.alter-img {
    padding: 3px;
    height: 44px; /* not sure why this is the case, might have to look into it */
} .alter-img img {
    max-height: 100%; /* limits height growth of fronter imgs */
    border-radius: 5px;
}

.alter-name {
    font-family: Kyokasho, sans-serif;
    font-size: 32px;
    color: white;
    margin-right: 12px;
    margin-left: 2px;
}

.alter-text {
    font-size: 14px;
    text-align: left;
}

#alter-container {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    margin-left: 25px;
    margin-right: 25px;
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
    left: calc(50% - (150px/2)); /* position is exactly halfway across the bar */
    bottom: calc(20px + 5px + 2px); /* bar is 20px wide, plus 5 for the arrow and 2 for extra spacing~ */
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    text-align: center;
    padding-top: 4px;
    padding-bottom: 4px;
    border-radius: 4px;
    z-index: 1;
} .front-percent-person {
    position: relative;
} .front-percent-person:hover .front-percent-hover { /* new class for each bar, just used to make hovers work properly */
    visibility: visible;
} .front-percent-hover::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent; /* whatever this magic is makes a triangle ehe */
  }

/* would be nice to align images to some baseline, but nothing seemed to really work */

.socials-bar-big a {
    font-size: 30px;
    color: white;
} .socials-bar-big span {
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

#link-container a {
    text-decoration: none;
}

#shima-img {
    background-image: url('/yurukyan/shima.png');
    width: 100%;
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
    background: linear-gradient(90deg,rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.15) 15%, rgba(0, 0, 0, 0.15) 85%, rgba(0, 0, 0, 0) 100%);
    margin-top: 5px;
    margin-bottom: 5px;
}

@media only screen and (max-device-width: 1600px) { /* alter text breaks around here */
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

@media only screen and (max-device-width: 1450px) { /* need to bring alters closer now */
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

@media only screen and (max-device-width: 700px)
{
    #page {
        margin-left: 3%;
        margin-right: 3%;
        margin-top: 3%;
        margin-bottom: 3%;
    }
    
    #info-box {
        font-size: 16px;
    }

    #mobile-button-box { /* copied from header */
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: end;
        align-items: center;
        height: 30px;
        margin-bottom: 0px;
    }

    #mobile-button-box a {
        padding-right: 8px; /* gives spacing to the icons */
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

    .socials-bar-big a {
        font-size: 26px;
    }

    .socials-bar-big img {
        max-width: 20px;
    }
}
</style>