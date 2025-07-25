<svelte:head>
    <meta property="og:site_name" content="yurukyan△">
    <meta property="og:title" content="sydnmc△">
    <meta property="og:description" content="sydney's homepage~">
    <meta name="theme-color" content="#5a4969">
    <title>sydnmc△</title>
</svelte:head>

<script lang="ts">
    import { PUBLIC_API, PUBLIC_MUSIC_LINK } from "$env/static/public";
    import LegacyHeader from "$lib/LegacyHeader.svelte";
    import * as osuColourize from 'osu-colourizer';

    async function fetchFromApi(apiEndpoint: string) {
        let response = await fetch(`${PUBLIC_API}/${apiEndpoint}`);
        return await response.json();
    }

    let notableSets: beatmapset[] = [
        {
        "isIncomplete": false,
        "bgLink": "https://assets.ppy.sh/beatmaps/2009205/covers/cover.jpg",
        "title": "INTERNET ANGEL",
        "artist": "Aiobahn",
        "url": "https://osu.ppy.sh/beatmapsets/2009205",
        "mapId": "2009205",
        "creator": "bnmc",
        "dateFinished": "6/14/2023",
        "personCreator": "sydney",
        "status": "ranked"
        },
        {
        "isIncomplete": false,
        "bgLink": "https://assets.ppy.sh/beatmaps/1801304/covers/cover.jpg",
        "title": "Sun is Coming Up (Movie Edit)",
        "artist": "Asaka",
        "url": "https://osu.ppy.sh/beatmapsets/1801304",
        "mapId": "1801304",
        "creator": "bnmc",
        "dateFinished": "7/7/2022",
        "personCreator": "sydney",
        "status": "ranked"
        },
            {
        "isIncomplete": false,
        "bgLink": "https://assets.ppy.sh/beatmaps/2186078/covers/cover.jpg",
        "title": "Laid-Back Journey (TV Size)",
        "artist": "Kiminone",
        "url": "https://osu.ppy.sh/beatmapsets/2186078",
        "mapId": "2186078",
        "creator": "bnmc",
        "dateFinished": "5/24/2024",
        "personCreator": "sydney",
        "status": "ranked"
        },
    ];

    let notableGds: gd[] = [
        {
        "bgLink": "https://assets.ppy.sh/beatmaps/1638844/covers/cover.jpg",
        "title": "Saigetsu (Koko & Satsuki ga Tenkomori's Sagyou Bougai Remix)",
        "artist": "U2",
        "creator": "Bloxi",
        "mapId": "1638844",
        "status": "ranked",
        "isForRank": true,
        "bns":["Luscent", "Zelq"],
        "maps": [
            {
                "url": "https://osu.ppy.sh/beatmapsets/1638844#osu/3839993",
                "id": "3839993",
                "diffname": "bnmc's LUNATIC JAPANESE GOBLIN!",
                "amountMapped": "all",
                "sr": 4.8,
                "dateFinished": "6/3/2022"
            }
        ]
        },
        {
        "bgLink": "https://assets.ppy.sh/beatmaps/2263303/covers/cover.jpg",
        "title": "Why I hate you",
        "artist": "irohaRingo feat. flower",
        "creator": "Ryuusei Aika",
        "mapId": "2263303",
        "status": "ranked",
        "isForRank": true,
        "bns":["Riana", "Iceluin"],
        "maps": [
            {
                "url": "https://osu.ppy.sh/beatmapsets/2263303#osu/4826294",
                "id": "4826294",
                "diffname": "sydnmc's kuyashimagire//Ultra",
                "amountMapped": "all",
                "sr": 7.8,
                "dateFinished": "10/18/2024"
            }
        ]
        },
    ]

    async function getRecentGd() {
        let gds: gd[] = await fetchFromApi('gds?person=sydney');

        let latestRanked;

        let i = gds.length-1; //starting from the very top here
        let foundRanked = false;
        while (!foundRanked && i > 0) {
            if (gds[i].status === "ranked" || gds[i].status === "qualified") { //qualified should show up, since i basically treat it as being ranked :p
                latestRanked = gds[i];
                foundRanked = true;
            }
            i--;
        }
        return latestRanked;
    }
</script>

<LegacyHeader person="syd" page="home"/>
    <audio controls id="tab-player-source">
      <source type="audio/mpeg">
    </audio>
    <h2 id="welcome-text">o/ welcome to my little place on the internet.</h2>
    <p class="under-title-text">hi! if you're here, you likely know a bit about who i am already, but regardless, i'm <strong>sydney</strong> / <strong>sydnmc</strong>.</p>
    <div id="showcase">
      <div id="osu-showcase-wrapper">
        <p class="centered" style="font-size: 14px;">i make maps (charts) for a rhythm game called osu!, as well as doing a few other things within the community. <br>here are some of my mostly recently ranked maps, along with some of maps that i'm known for~</p>
        <h3>˖⁺‧₊˚ notable gds ˚₊‧⁺˖</h3>
        <div id="gd-display-wrapper">
        {#await getRecentGd()}
            <div class="gd-thumb">
                <p class="upper-ranked-text">❀ latest ranked gd ❀</p>
                <h2 class="gd-title"><a class="gd-link" id="gd-link-0">Loading</a></h2>
                <p class="gd-artist"><span class="artist-text">by</span><span id="latest-ranked-artist">loading</span></p>
                <p class="gd-text" id="diff-text-0">☆ loading sr ☆</p>
            </div>
            {:then gd}
            <div class="gd-thumb" style="background-image: linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%), url({gd?.bgLink}">
                <p class="upper-ranked-text">❀ latest ranked gd ❀</p>
                <h2 class="gd-title"><a class="gd-link" href="https://osu.ppy.sh/beatmapsets/{gd?.mapId}">{gd?.title}</a></h2>
                <p class="gd-artist"><span class="artist-text">by</span><span id="latest-ranked-artist">{gd?.artist}</span></p>
                <p class="gd-text" style="color: {osuColourize.colourize(gd?.maps[0].sr)}">{gd?.maps[0].diffname} | {gd?.maps[0].sr} ☆</p>
            </div>
            {/await}
          <div id="divider"></div>
          {#each notableGds as gd}
            <div class="gd-thumb" style="background-image: linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%), url({gd.bgLink}">
                <h2 class="gd-title"><a class="gd-link" style="font-size: 22px" href="https://osu.ppy.sh/beatmapsets/{gd.mapId}">{gd.title}</a></h2>
                <p class="gd-artist"><span class="artist-text">by</span>{gd.artist}</p>
                <p class="gd-text" style="color: {osuColourize.colourize(gd.maps[0].sr)}">{gd.maps[0].diffname} | {gd.maps[0].sr} ☆</p>
            </div>
          {/each}
        </div>
        <h3>˖⁺‧₊˚ notable maps ˚₊‧⁺˖</h3>
        <div id="maps-showcase-wrapper">
        {#each notableSets as set}
            <div class="set-thumb" style="background-image: linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%), url({set.bgLink})">
            <h2 class="gd-title push-text"><a class="gd-link" href={set.url}>{set.title}</a></h2>
            <p class="gd-artist push-text"><span class="artist-text">by</span>{set.artist}</p>
          </div>
        {/each}
        </div>
      </div>
      <div id="right-side">
        <div id="songs-preview" onclick={() => location.href = PUBLIC_MUSIC_LINK}>
          <h2>also, check out some of my music here!!</h2>
          <p class="under-title-text">because yeah ^^ i do make music just a little bit~</p>
          <img src="/sydney/music preview.jpg" alt="music preview" id="songs-image">
        </div>
        <div>
          <h2>i also code too!</h2>
          <p class="under-title-text">well, clearly if i made this whole website by hand...</p>
          <p class="centered larger-text">but!! you can check out my github <a href="https://github.com/sydnmc" class="link">here</a> for some of my other projects.<br>
          <span style="font-size: 14px;">i'm currently working on both this website and <a href="https://osugds.moe" style="color: white">osugds.moe </a><img src="https://osugds.moe/images/sakura.png" alt="sakura logo" id="osugds-logo"> !!</span></p>
          <p></p>
          <p class="centered">(*ᴗ͈ˬᴗ͈)ꕤ*.ﾟ</p>
        </div>
      </div>
    </div>

<style>
h2 {
    color: white;
    text-align: center;
    margin-bottom: 0px;
}

.under-title-text {
    text-align: center;
    margin-top: 5px;
}

h3 { 
    color: white;
    text-align: center;
}

#showcase {
    position: relative; /* needed to position the right side properly */
}

#osu-showcase-wrapper {
    border: 4px solid var(--sydney-main);
    border-radius: 15px;
    padding-left: 10px;
    padding-right: 10px;
    width: 60%;
}

#songs-preview {
    border: 4px solid var(--sydney-main);
    border-radius: 15px;
    padding: 10px;
}

#right-side { /* this does come before in the html, but the width calculation is easier to understand this way~ */
    position: absolute;
    right: 0px;
    top: 0px;
    width: calc(40% - 24px - 18px); /* gives a 18px gap between the left and right side, each have 10px padding and 4px border*/
}

#songs-image {
    width: 100%;
    cursor: pointer;
    margin-top: 15px;
}

#gd-display-wrapper {
    display: flex;
}

#maps-showcase-wrapper {
    display: flex;
    flex-direction: column;
}

.gd-thumb {
    display: flex;
    flex-direction: column;
    height: 135px;
    overflow: hidden;
    text-overflow: hidden;
    text-wrap: nowrap;
    width: 100%;
    background-size: cover;
    background-position: center center;
    text-align: right;
    justify-content: center;
    padding-right: 10px;
}

.set-thumb {
    display: flex;
    flex-direction: column;
    min-height: 94px;
    width: 100%;
    background-size: cover;
    background-position: center center;
    text-align: right;
    justify-content: center;
    margin-right: 10px;
}

.gd-title {
    text-align: inherit;
    color: white;
    font-weight: normal;
    font-size: 28px;
    margin-bottom: 0px;
    margin-top: 0px;
}

.gd-link {
    color: inherit;
    text-decoration: none;
}

.gd-artist {
    font-size: 16px;
    margin: 0
}

.gd-text {
    font-family: "Open Sans", sans-serif;
    margin-top: 15px;
    margin-bottom: 0px;
    text-shadow: black 1px 0 5px;
}

.artist-text {
    font-size: 13px;
    margin-right: 4px;
}

.push-text {
    margin-right: 10px;
}

#divider {
    border-left: 4px solid var(--sydney-main);
    height: inherit;
    margin-left: 2%;
    margin-right: 2%;
}

.upper-ranked-text {
    position: absolute; /* only shows up when the relative position is the showcase wrapper */
    color: white;
    font-size: 14px;
    top: calc(15% - 10px);
    width: calc(((33% * 0.6) - 4px)); /* close enough for now, but i wanna find a better solution with js, probably? */
    text-align: center;
    /* should add this to the common folder when i can >_< */
    background: var(--shine);
    -webkit-background-clip: text;
    background-clip: text;
    background-color: #93c47d;
    -webkit-text-fill-color: transparent;
    background-size: 500% auto;
    animation: textShine 5s ease-in-out infinite alternate;
} @keyframes textShine {
    0% {
        background-position: 0% 50%;
    }
    100% {
        background-position: 100% 50%;
    }
}

.larger-text {
    font-size: 16px;
}

#osugds-logo {
    width: 1.75%;
}

/* mobile */
@media only screen and (max-device-width: 768px)
{  
    #right-side {
        position: relative;
        width: 100%;
    }

    #osu-showcase-wrapper {
        width: calc(100% - 30px); /* apparently this gets the spacing right, not sure why at all :sob: */
        margin-bottom: 15px;
    }

    #gd-display-wrapper {
        flex-direction: column;
    }

    #osugds-logo {
        width: 2.5%;
    }

    .gd-title {
        margin-right: 10px;
    }

    .gd-artist {
        margin-right: 10px;
    }

    .gd-text {
        margin-right: 10px;
    }

    .gd-thumb {
        margin-right: 10px;
        padding-right: 0px;
    }

    .larger-text {
        font-size: 14px;
    }

    .upper-ranked-text {
        font-size: 12px;
        width: calc(100% - 30px);
        top: 137.5px; /* this is based on nothing and really sucks :3 */
    }
}
</style>
