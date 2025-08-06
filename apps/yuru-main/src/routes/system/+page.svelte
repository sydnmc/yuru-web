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
    let startTime = endTime;
    async function getAlterInfo() {
        let data;
        if (!systemId) {
            data = await fetchFromApi(`frontData`);
            //data.sort((a, b) => a.localeCompare(b));
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
                earliestAppearance = info[i].firstAppearance;
            }
        }
        startTime = earliestAppearance;
    }

    function makeDate(timestamp: number) {
        let date = new Date(timestamp);
        let dateFormat = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };

        return date.toLocaleDateString(locale, dateFormat);
    }

    let pfpAlt = $state('');
    let yurukyanMembers = ['sydney', 'lilac', 'hazel', 'may'];
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
        
        console.log(alter);
        console.log(alter.pfpLink);
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
</script>

<div id="background"></div>
<div class="divider">
    <h1><a href={getPageRoot('yurukyan')}>yurukyan△</a></h1>
    <h2>system info ❀</h2>
    <div id="system-input">
        <select>

        </select>
        <span>system id: </span>
        <input type="text" bind:this={systemIdInput} onkeydown={keyType => changeSystem(keyType.key)}/>
    </div>
</div>
{#await alterInfo}
    <p>gathering front data...</p>
{:then frontData}
    <div id="front-history">
        {#each frontData as alter}
            {#if alter.name !== "(no fronter)"}
            <div class="alter-row">
                <div class="front-container">
                    {#each alter.frontHistory as front}
                        <div style="background-color: {systemId? '#ffffff' : `var(--${alter.name}-main)`}; 
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

    #front-history {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 20px;
        border: 3px solid var(--main);
        border-radius: 15px;
        backdrop-filter: brightness(0.6);
    }

    .alter-row {
        display: flex;
        align-items: center;
        height: 120px;
    }

    .front-container {
        position: relative;
        height: 100%;
        width: 100%;
    } .front-container div {
        position: absolute;
        height: 100%;
    }

    .name-section {
        display: flex;
        align-items: flex-end;
        justify-content: right;
        width: 120px;
        height: 100%;
        background-position: center;
        background-size: cover;
    } .name-section span {
        font-size: 28px;
        color: white;
        margin-right: 5px;
    } .name-section img {
        width: 70px;
        border-radius: 10px;
    }
</style>
