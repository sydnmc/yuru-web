<svelte:head>
    <meta property="og:title" content="sets">
    <meta property="og:description" content="all osu! sets done by us">
    <title>yurukyan△ | sets</title>
</svelte:head>

<script lang="ts">
    import "@repo/yuru-static/assets/base.css";
    import { getPageRoot, fetchFromApi } from "@repo/yuru-assets";
    import { AudioPlayer, AudioVolume } from "@repo/yuru-assets";

    //since setInfo can change now, we wanna load it in here~
    async function loadSetData(search?: string) {
        let setInfo: beatmapset[];
        if (search) {
            setInfo = await fetchFromApi(`sets?search=${search}`);
        } else {
            setInfo = await fetchFromApi('sets');
        }
        
        let curId = 0;
        for (let i = 0; i < setInfo.length; i++) {
            for (let j = 0; j < setInfo[i].description!.length; j++) {
                if (setInfo[i].description![j].type === "hover") {
                    setInfo[i].description![j].content.id = curId;
                    curId++;
                }
            }
        }

        return setInfo;
    }

    let reachedUnfinishedSets = false;
    function setUnfinished() {
        reachedUnfinishedSets = true;
    }

    function findStatus(status: string) {
        let iconUrl = "https://i.ppy.sh/75dfe0bdfceeeed6a426c8db0234e4ef3300dc10/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f7374617475732f6772617665796172642e706e67"; //default to graved if nothing else
        switch (status) {
            case "ranked":
                iconUrl = "https://i.ppy.sh/7f116c7b5f20a0f1b9b38d35b521f5bd070d864a/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f7374617475732f72616e6b65642e706e67";
                break;
            case "qualified":
                iconUrl = "https://i.ppy.sh/dd2c44bf7db9f2e33f670205df7df3d028101888/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f7374617475732f7175616c69666965642e706e67";
                break;
            case "loved":
                iconUrl = "https://i.ppy.sh/2d6ca47d8e93f21d1bf09ce1c3c9661442092e57/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f7374617475732f6c6f7665642e706e67";
                break;
        }
        return iconUrl;
    }

    let curUserHover: number;
    function showHover(hover: number) {
        curUserHover = hover;
    }
    function removeHover() {
        curUserHover = -1;
    }

    let searchInput: HTMLInputElement;
    let searchTerm = ''; //need to convert this to runes mode Lowkey
    function search(keyPressed: string) {
        if (keyPressed === 'Enter') {
            searchTerm = searchInput.value;
        }
    }
</script>

<div id="background"></div>
<div class="divider">
    <h1><a href={getPageRoot('yurukyan')}>yurukyan△</a></h1>
    <h2>finished sets ❀</h2>
    <div id="search-bar">
        <i class="fa fa-search"></i>
        <input type="text" bind:this={searchInput} onkeydown={keyType => search(keyType.key)}>
    </div>
</div>
{#await loadSetData(searchTerm)}
{:then setInfo} 
<div class="set-container" id="set-container">
    {#each setInfo as set}
    {#if !reachedUnfinishedSets && set.isIncomplete}
    {setUnfinished()} <!-- i don't think it's good to just do this directly in svlete, but it's the cleanest solution i can think of with the existing code :p -->
    <div class="divider" style="margin-top: 40px; margin-bottom: 40px;">
        <h2>unfinished sets ❀</h2>
    </div>
    {/if}
    <div class="set" style="border-color: var(--{set.personCreator}-main)">
        <div class="set-img" style="background-image: url({set.bgLink})">
            <AudioPlayer mapId={parseInt(set.mapId)} person={set.personCreator}/>
        </div>
        <div class="set-text-container">
            <img class="status-icon" src={findStatus(set.status)} alt={set.status} />
            <a class="set-link" href={set.url}>{set.artist} - {set.title}</a>
            <p class="creator-text">creator <span style="color: white;">{set.creator}</span></p>
            <p class="finished-text">finished <span style="color: white;">{set.dateFinished}</span></p>
            {#each set.description as desc}
                {#if desc.type === 'description'}
                <span >{@html desc.content}</span>
                {:else if desc.type === 'hover'}
                <a class="osu-user" href="https://osu.ppy.sh/users/{desc.content.userID}"
                onmouseover={() => showHover(desc.content.id)}
                onfocus={() => showHover(desc.content.id)}
                onmouseleave={() => removeHover()}
                onfocusout={() => removeHover()}>{desc.content.username}
                    <div class="osu-hover"
                    onclick={() => location.href = "https://osu.ppy.sh/users/{desc.content.userID}"}
                    style="display: {curUserHover === desc.content.id ? 'flex' : 'none'};
                    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url({desc.content.bannerUrl});">
                        <img src="https://a.ppy.sh/{desc.content.userID}" class="hover-pfp" alt="{desc.content.userID}'s pfp"/>
                            <div class="osu-hover-text-container">
                                <div class="osu-hover-flagtext-container">
                                    <div class="flaguser-container">
                                        <img src="https://osu.ppy.sh/assets/images/flags/{desc.content.flag}" class="osu-flag" alt={desc.content.flagCode}/>
                                        <span class="hover-username">{desc.content.username}</span>
                                    </div>
                                    <div>
                                        <span>click to go to profile!</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </a>
                    {/if}
                {/each}
            </div>
        </div>
        {/each}
</div>
{/await}
<AudioVolume person={'sydney'}/>

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

    #search-bar {
        position: absolute;
        bottom: 0;
        left: 10px;
        display: flex;
        align-items: center;
    } input[type="text"] {
        background-color: transparent;
        color: white;
        border: transparent;
        font-size: 20px;
        margin-left: 15px;
        border-bottom: 1px solid var(--text);
    } input[type="text"]:focus {
        outline: none;
    }

    .fa-search {
        font-size: 20px;
        color: white;
        margin-left: 4px;
    }

    .set {
        display: flex;
        border: 3px solid var(--main);
        border-radius: 5px;
        min-height: 180px;
        margin-left: 2.5%;
        margin-right: 2.5%;
        margin-top: 20px;
        background-color: rgba(0, 0, 0, 0.4);
    }

    .set-img {
        width: 24%;
        background-size: cover;
        background-position: center;
    }

    .set-text-container {
        /* container of text inside each set */
        width: 76%;
        padding-left: 10px;
        padding-top: 10px;
        padding-bottom: 20px;
    }

    .status-icon {
        height: 28px;
        padding-right: 5px;
    }

    .set-link {
        font-family: "Raleway", sans-serif;
        font-size: 32px;
        color: white;
        text-decoration: none;
    }

    .creator-text {
        font-size: 18px;
        margin-top: 0;
        margin-bottom: 0;
    }

    .finished-text {
        font-size: 18px;
        margin-top: 0;
    }

    /* osu hover stuff */
    .osu-user {
        position: relative;
        color: white;
        font-weight: bold;
        text-decoration: none;
    }

    .osu-hover {
        display: none;
        position: absolute;
        left: 0; /* need to set a position for it to spawn right under the text */
        z-index: 2;
        text-decoration: none;
        font-weight: normal;
        color: white;
        height: 80px;
        width: 300px;
        border-radius: 15px;
        background-size: cover;
        background-origin: padding-box, padding-box;
        background-clip: border-box, border-box;
    }

    .hover-pfp {
        height: 70px;
        border-radius: 15px;
        margin-left: 5px;
        margin-top: 5px;
    }

    .osu-hover-flagtext-container {
        margin-left: 10px;
        margin-top: 5px;
    }

    .hover-username {
        font-weight: bold;
        font-size: 26px;
    }

    .flaguser-container {
        display: flex;
        align-items: center;
    }

    .osu-flag {
        height: 35px;
        margin-right: 5px;
    }
</style>
