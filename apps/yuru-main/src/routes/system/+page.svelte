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

    import { _, locale } from '@repo/i18n';

    let systemId = $state();

    let systemIdInput: HTMLInputElement;
    function changeSystem(keyPressed: string) {
        if (keyPressed === 'Enter') {
            systemId = systemIdInput.value;
            alterInfo = getAlterInfo();
        }
    }

    const endTime = new Date().getTime(); //the end time will always be ima
    let alterInfo = $state(getAlterInfo());
    let startTime = $state(endTime);
    async function getAlterInfo() {
        let data;
        if (!systemId) {
            data = await fetchFromApi(`frontData`);
        } else {
            data = await fetchFromApi(`frontData?id=${systemId}`);
        }

        setStartTime(data);
        return data;
    }

    function setStartTime(info: alter[]) {
        let earliestAppearance = endTime;
        for (let i = 0; i < info.length; i++) {
            if (earliestAppearance > info[i].firstAppearance!) {
                earliestAppearance = info[i].firstAppearance!;
            }
        }
        startTime = earliestAppearance;
    }

    function makeDate(timestamp: number, requiresFullDate: boolean) {
        let date = new Date(timestamp);
        let dateFormat;
        if (requiresFullDate) {
            dateFormat = {
                year: "numeric",
                month: "long",
                day: "numeric",
            };
        } else if (new Date(timestamp).getUTCMonth() === 0) {
            dateFormat = { year: "numeric" }
        } else {
            dateFormat = { month: "long" }
        }

        return date.toLocaleDateString(locale, dateFormat);
    }

    function assignPfp(alter: alter) {
        switch (alter.name) {
            case "sydney":
                return sydneyPfp;
            case "lilac":
                return lilacPfp;
            case "hazel":
                return hazelPfp;
            case "may":
                return mayPfp;
        }
        
        return alter.pfpLink;
    }

    function getFrontLengthPercent(frontLen: string) {
        let margin = endTime - startTime;
        return `${(parseInt(frontLen)*100)/margin}%`;
    }
    function getPosition(timestamp: string) {
        let margin = endTime - startTime;
        return `${((parseInt(timestamp)-startTime)/margin)*100}%`;
    }

    function createSensibleDateIntverals(startTime: number) {
        let intervals = [];
        let margin = endTime - startTime;
        let startTimestamp = new Date(startTime);

        let nextFullMonth =  new Date(startTimestamp.getUTCFullYear(), startTimestamp.getUTCMonth()+1, 1).getTime();
        let position = (((nextFullMonth - startTime)/margin) * 100) * 0.94; //actual timeline is only 94%;
        intervals.push({timestamp: nextFullMonth, position, importance: 'full'});

        let curMonthTimestamp = nextFullMonth;
        while (curMonthTimestamp < endTime) {
            let currentTimestamp = new Date(intervals[intervals.length-1].timestamp);
            curMonthTimestamp = new Date(currentTimestamp.getUTCFullYear(), currentTimestamp.getUTCMonth()+1, 1).getTime();
            position = ((((curMonthTimestamp - startTime)/margin) * 100) * 0.94);
            let importance = 'month';
            if (currentTimestamp.getUTCMonth() === 11) {
                importance = 'year';
            }

            intervals.push({timestamp: curMonthTimestamp, position, importance});
        }

        intervals.pop(); //cannot be bothered :p just removes the last one since we already have a current date
        return intervals;
    }
</script>

<div id="background"></div>
<div class="divider">
    <h1><a href={getPageRoot('yurukyan')}>yurukyan△</a></h1>
    <h2>system info ❀</h2>
    <div id="system-input">
        <span>system id: </span>
        <input type="text" bind:this={systemIdInput} onkeydown={keyType => changeSystem(keyType.key)}/>
    </div>
</div>
<div id="info-box">
    <h2>o/ welcome to our system page~!</h2>
    <p>we made the historical graph below to give a much better visual picture of what things our like in our system - how long each of us usually front, who's considered our "main" alters, etc.</p>
    <p>if you're part of a system that uses pluralkit, there's also an option to see this for your own system! input your system id in the box above and wait for it to load~ it may take a while if you have a lot of switches.. (,,&gt;﹏&lt;,,)</p>
    <p>if you're confused about all of this system talk, then feel free to read up on anything you may be confused about <a href={getPageRoot('lilac')+"whoami"}>here</a>.</p>
    <p>(˵ •̀ ᴗ - ˵ ) ✧</p>
</div>
{#await alterInfo}
    <h1 class="loading-text">ꕤ gathering front data...</h1>
{:then frontData}
<div id="front-history-container">
    <div id="front-history">
        {#each frontData as alter}
            {#if alter.name !== "(no fronter)"}
            <div class="alter-row">
                <div class="front-container">
                    {#each alter.frontHistory as front}
                        <div style="background-color: {systemId? `#${alter.colour}` : `var(--${alter.name}-main)`}; 
                        width: {getFrontLengthPercent(front.length)};
                        left: {getPosition(front.timestamp)}"></div>
                    {/each}
                </div>
                <div class="name-section" style="background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url({assignPfp(alter)});">
                    <span>{alter.name}</span>
                </div>
            </div>
            {/if}
        {/each}
    </div>
    <div id="time-row">
        <span class="full-date-timestamp">{makeDate(startTime, true)}</span>
        {#each createSensibleDateIntverals(startTime) as interval}
        <div style="left: {interval.position}%" class="date-line-container">
            <div class={interval.importance === 'year'? 'date-divider-major' : 'date-divider'}></div>
            <span class={interval.importance === 'year'? 'major-date' : ''}>{makeDate(interval.timestamp, false)}</span>
        </div>
        {/each}
    </div>
</div>
{:catch}
    <h1 class="loading-text">ꕤ an error occured! &gt;_&lt;;;</h1>
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
        filter: blur(12.5px) brightness(0.8);
        z-index: -1;
    }

    .divider {
        position: relative;
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

    #system-input {
        position: absolute;
        text-align: left;
        bottom: 10px;
        left: 5px;
    } #system-input input {
        background: transparent;
        color: white;
        border: 2px solid var(--main);
        border-radius: 5px;
    }  #system-input input:focus {
        outline: 2px solid var(--accent);
    }

    #info-box {
        text-align: center;
        margin-top: 30px;
        margin-bottom: 40px;
    } #info-box h2 {
        color: white;
        font-size: 22px;
    } #info-box p {
        margin-top: 5px;
        margin-bottom: 0;
    }

    a {
        color: white;
        text-decoration: none;
    }

    .loading-text {
        text-align: center;
    }

    #front-history-container {
        position: relative;
        margin-left: 10px;
        margin-right: 10px;
    }

    #front-history {
        display: flex;
        flex-direction: column;
        border: 3px solid var(--main);
        border-radius: 15px;
        backdrop-filter: brightness(0.6);
        overflow: clip;
    }

    .alter-row {
        display: flex;
        align-items: center;
        height: 120px;
    }

    .front-container {
        position: relative;
        height: 100%;
        width: 94%;
    } .front-container div {
        position: absolute;
        height: 100%;
    }

    .name-section {
        display: flex;
        align-items: flex-end;
        justify-content: right;
        width: 6%;
        height: 100%;
        background-position: center;
        background-size: cover;
    } .name-section span {
        font-size: 28px;
        color: white;
        margin-right: 5px;
    }

    .date-divider-major {
        height: 100%;
        margin-left: 50%;
        margin-right: 50%;
        background-color: white;
        width: 1px;
    } .date-divider {
        height: 100%;
        margin-left: 50%;
        margin-right: 50%;
        background-color: grey;
        width: 1px;
    }

    .date-line-container {
        top: 0;
        position: absolute;
        height: 100%;
    }

    .full-date-timestamp {
        position: absolute;
        font-size: 12px;
    }

    .major-date {
        color: white;
        font-size: 18px;
    }

    @media only screen and (max-device-width: 768px) {
        #system-input {
            position: relative;
            margin-left: auto;
            width: auto;
        } #system-input span {
            margin-left: auto;
        }

        #front-history-container {
            overflow-x: scroll;
            overflow-y: visible;
            width: 300%;
        }
    }
</style>
