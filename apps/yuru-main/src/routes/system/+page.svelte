<svelte:head>
    <meta property="og:title" content="system">
    <meta property="og:description" content="information about our system">
    <title>yurukyan△ | system</title>
</svelte:head>

<script lang="ts">
    import "@repo/yuru-static/assets/base.css";
    import { getPageRoot, fetchFromApi } from "@repo/yuru-assets";
    import type { alter, frontHistory } from "@repo/yuru-server";

    import sydneyPfp from '@repo/yuru-static/assets/sydneypfp.png';
    import lilacPfp from '@repo/yuru-static/assets/lilacpfp.png';
    import hazelPfp from '@repo/yuru-static/assets/hazelpfp.jpg';
    import mayPfp from '@repo/yuru-static/assets/maypfp.png';

    import { _, locale, time } from '@repo/i18n';

    const alters = ['sydney', 'lilac', 'hazel', 'may'];
    const startTime = 1728337870591; //when our system had its first recorded front :3
    const endTime = new Date().getTime(); //the end time will always be ima
    const margin = endTime - startTime;

    function makeDate(timestamp: Date) {
        let date = new Date(timestamp);
        let dateFormat = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };

        return date.toLocaleDateString(locale, dateFormat);
    }

    let pfpAlt = $state('');
    function assignPfp(alter: string) {
        switch (alter) {
            case "sydney":
                return sydneyPfp;
            case "lilac":
                return lilacPfp;
            case "hazel":
                return hazelPfp;
            case "may":
                return mayPfp;
        }
    }

    function getFrontLengthPercent(frontLen: string) {
        return `${(parseInt(frontLen)*100)/margin}%`; //*100 turns it into a percentage
    }

    function getPosition(timestamp: string) {
        let parsedTimestamp = parseInt(timestamp);
        let timeInRange = parsedTimestamp - startTime;

        return `${(timeInRange/margin)*100}%`;
    }
</script>

<div id="background"></div>
<div class="divider">
    <h1><a href={getPageRoot('yurukyan')}>yurukyan△</a></h1>
    <h2>system info ❀</h2>
</div>
{#await fetchFromApi(`frontData`)}
    <p>gathering front data...</p>
{:then frontData}
    <div id="front-history">
        {#each frontData as alter}
            {#if alter.name !== "(no fronter)"}
            <div class="alter-row">
                <div class="front-container">
                    {#each alter.frontHistory as front}
                        <div style="background-color: var(--{alter.name}-main); 
                        width: {getFrontLengthPercent(front.length)};
                        left: {getPosition(front.timestamp)}"></div>
                    {/each}
                </div>
                <div class="name-section">
                    <span>{alter.name}</span>
                    <img src={assignPfp(alter.name)} alt={pfpAlt} />
                </div>
            </div>
            {/if}
        {/each}
    </div>
    <p>{makeDate(startTime)}</p>
    <p>{makeDate(endTime)}</p>
{:catch}
    <p>an error occured!</p>
{/await}

<style>
    /* local variables */
    :root {
        --tent: #fce758;
        --main: #79b8d4;
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

    .divider {
        text-align: right;
        padding-top: 20px;
        padding-right: 20px;
        padding-bottom: 5px;
        background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0) 40%,
            rgba(0, 0, 0, 0.6) 100%
        );
    } .divider h1 {
        margin-top: 0;
        margin-bottom: 0;
    } .divider h1 a {
        font-family: Kyokasho, sans-serif;
        font-weight: normal;
        text-align: center;
        color: var(--tent);
        font-size: 52px;
        text-decoration: none;
    } .divider h2 {
        margin-top: 5px;
        font-weight: normal;
    }

    #front-history {
        display: flex;
        flex-direction: column;
        backdrop-filter: brightness(0.8);
    }

    .alter-row {
        display: flex;
        align-items: center;
        height: 100px;
        border-top: 1px solid white;
        border-bottom: 1px solid white;
    }

    .front-container {
        position: relative;
        height: 100%;
        width: 88%;
        border-right: 1px solid white;
    } .front-container div {
        position: absolute;
        height: 100%;
    }

    .name-section {
        margin-left: auto;
        margin-right: 10px;
    } .name-section span {
        font-family: Kyokasho, sans-serif;
        font-size: 30px;
        color: white;
        margin-right: 5px;
    } .name-section img {
        width: 70px;
        border-radius: 10px;
    }
</style>
