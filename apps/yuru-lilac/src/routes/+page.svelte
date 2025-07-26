<svelte:head>
    <meta property="og:site_name" content="yurukyan△">
    <meta property="og:title" content="yuiyamu△">
    <meta property="og:description" content="lilac's homepage~">
    <meta name="theme-color" content="#dee0ed">
    <title>yuiyamu△</title>
</svelte:head>

<script lang="ts">
    import Header from "@yuru-web/yuru-assets";
    import type { beatmapset } from "@yuru-web/yuru-assets";
    import { _ } from 'svelte-i18n';

    let mochi: beatmapset = {
        "isIncomplete": false,
        "bgLink": "https://assets.ppy.sh/beatmaps/2340358/covers/cover.jpg",
        "title": "mochi",
        "artist": "momone chinoi",
        "url": "https://osu.ppy.sh/beatmapsets/2340358",
        "mapId": "2340358",
        "description": [
            {
                "type": "description",
                "content": ""
            }
        ],
        "creator": "yuiyamu",
        "dateFinished": "3/16/2025",
        "personCreator": "lilac",
        "status": "ranked"
    }
</script>

<Header person="lilac" page="home"/>
<div id="background"></div>
<div id="page">
    <h1>(˶◜ᵕ◝˶)</h1>
    <div id="project-container">
        <div class="project">
            <h2>‧₊˚❀ osugds.moe</h2>
            <p>{$_('lilac.home.osugdsDescTop')}</p>
            <a href="https://osugds.moe" id="osugds">
                <h2>osugds.moe</h2>
                <img src="/common/osugds.png" alt="osugds logo" />
            </a>
            <p style="margin-bottom: 0">{$_('lilac.home.osugdsDescMiddle')}</p>
            <p class="smaller-text" style="margin-top: 8px;">{$_('lilac.home.osugdsDescBottom')}</p>
        </div>
        <div class="project middle">
            <h2>{$_('lilac.home.osuMapping')}</h2>
            <p>{$_('lilac.home.osuMappingDescTop')}</p>
            <a class="map" href={mochi.url} style="background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%), url('{mochi.bgLink}');">
                <h2>{$_('lilac.home.mochi')}</h2>
                <p>{$_('lilac.home.mochiCreator')}</p>
            </a>
            <p>{$_('lilac.home.osuMappingDescBottom')}</p>
            <p>ꕤ(˶˃ ᵕ ˂˶*)ꕤ</p>
        </div>
        <div class="project">
            <h2>{$_('lilac.home.whoAmI')}</h2>
            <p>{$_('lilac.home.whoAmIDesc')}</p>
            <div style="display: flex; justify-content: center;">
                <a href="/whoami" id="whoami">{$_('lilac.header.whoAmI')}</a>
            </div>
            <img id="non" src="/lilac/non.png" alt="momone chinoi"/>
        </div>
    </div>
</div>


<style>
h1 {
    color: white;
}

#background {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-image: url('/lilac/bg.jpg');
    background-size: cover;
    background-position: center;
    filter: blur(15px) brightness(0.5);
    z-index: -1;
}

#page {
    text-align: center;
    margin-left: 6%;
    margin-right: 6%;
}

#project-container {
    display: flex;
    border: 3px solid var(--lilac-main);
    border-radius: 10px;
}

.project {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 20px;
} .project h2 {
    color: var(--offwhite);
}

.smaller-text {
    font-size: 15px;
}

.middle {
    border-left: 2px solid var(--offwhite);
    border-right: 2px solid var(--offwhite);
}

.map {
    text-align: right;
    padding-right: 10px;
    text-decoration: none;
} .map h2 {
    font-family: 'Raleway', sans-serif;
    color: white;
    font-weight: normal;
    margin-bottom: 5px;
} .map p {
    color: var(--text);
    margin-top: 0;
}

#osugds {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: #e3748c;
    text-decoration: none;
} #osugds h2 {
    font-family: 'Raleway', sans-serif;
    color: white;
    font-weight: normal;
} #osugds img {
    margin-right: 8px;
    margin-left: 8px;
    height: 70%;
}

#whoami {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    width: 50%;
    height: 40px;
    font-size: 18px;
    border-radius: 10px;
    backdrop-filter: brightness(0.8);
}

#non {
    position: absolute;
    bottom: -125px;
    right: -70px;
    width: 150px;
    transform: rotate(10deg);
}

@media only screen and (max-device-width: 768px) {
    #project-container {
        flex-direction: column;
    }

    .project {
        width: auto;
    }

    .middle {
        border-left: none;
        border-right: none;
        border-bottom: 2px solid var(--offwhite);
        border-top: 2px solid var(--offwhite);
    }

    #non {
        width: 80px;
        bottom: -65px;
        right: -10px;
    }
}
</style>
