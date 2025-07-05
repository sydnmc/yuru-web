<script lang="ts">
    export let person: string;

    import * as osuColourize from 'osu-colourizer';
    import type { gd } from '../app';
    import AudioPlayer from './AudioPlayer.svelte';

    const endpoint = "https://api.yuru.ca"; //endpoint (backend)
    async function fetchFromApi(apiEndpoint: string) {
        let response = await fetch(`${endpoint}/${apiEndpoint}`);
        return await response.json();
    }

    let wipCount = 0;
    let collabCount = 0;
    let totalCount = 0;

    async function populateRow() { //only actually doing 1 sweep????
        let fetchPerson = person;
        if (person === "syd") { fetchPerson = 'sydney' }
        let mapStatus: gd[] = await fetchFromApi(`gds?person=${fetchPerson}`); //since we fetch mapdata in this function, it's best to populate everything we need for other parts of the page as well~

        for (let i = 0; i < mapStatus.length; i++) {
            if (mapStatus[i].mapStatus == "wip") {
                wipCount++;
            }
            if (mapStatus[i].amountsMapped[0] != "all") {
                collabCount++;
            }

            if (mapStatus[i].difficulties.length > 1) { //plurality check
                totalCount = totalCount+mapStatus[i].difficulties.length-1;
            }
        }
        totalCount = totalCount+mapStatus.length;

        /* done with updating the rest of the page, so now we focus on the gds themselves~ */
        for (let i = 0; i < mapStatus.length; i++) { //loops through every diff we have
            let bgLink = mapStatus[i].bgLink;
            if (!bgLink) {
                mapStatus[i].bgLink = "/common/tamate.jpg" //replaces backgrounds with no link with えっとですねぇ～　たまてって名前は玉手箱が由来でして
            }

            let plural = false; //if a map has more than one difficulty in it
            let plurality = 0; //number of diffs this diff has (defined if plural)

            if (mapStatus[i].difficulties.length > 1) {
                plural = true;
                plurality = mapStatus[i].difficulties.length;
            }

            switch(mapStatus[i].mapStatus) {
                case "deadge (pretty bad)":
                case "deadge (unfinished spread)":
                    mapStatus[i].statusColour = "#999999";
                    break;
                case "deadge":
                case "deadge (not for rank)":
                case "deadge (meme set)":
                    mapStatus[i].statusColour = "#b7b7b7";
                    break;
                case "deleted":
                    mapStatus[i].statusColour = "#666666";
                    break;
                case "set wip":
                    mapStatus[i].statusColour = "#f6b26b";
                    break;
                case "wip":
                    //not sure
                    break;
                case "pending":
                    mapStatus[i].statusColour = "#ffd966";
                    mapStatus[i].statusTextColour = "black"; //background too bright
                    break;
                case "qualified":
                    //not sure
                    break;
                case "ranked":
                    //not sure
                    break;
            }

            //adding difficulty colors + all plural info
            let blackish = "rgb(40, 40, 40)";
            if (plural) {
                mapStatus[i].plural = true;
                mapStatus[i].pluralInfo = [];
                for (let j = 0; j < plurality; j++) {
                    let info: pluralGd = {"songURL": mapStatus[i].songURLs[j], "diffname": mapStatus[i].difficulties[j], "sr": mapStatus[i].starRatings[j], "dateFinished": mapStatus[i].datesFinished[j], "amountMapped": mapStatus[i].amountsMapped[j]}
                    mapStatus[i].pluralInfo?.push(info);

                    let bgColor;
                    if (typeof mapStatus[i].starRatings[j] == "string") {
                        bgColor = "rgb(222, 224, 237)"; //makes it the wip color if its still wip but in a plural gd thats finished already
                    } else {
                        bgColor = osuColourize.colourize(mapStatus[i].starRatings[j]);
                    }
                    mapStatus[i].pluralInfo[j].diffColour = bgColor;

                    if (mapStatus[i].starRatings[j] < 4.4 || typeof mapStatus[i].starRatings[j] == "string") { //in cases where the map background text is too bright, or is wip (still too bright)
                        
                    }
                }
            } else {
                let bgColor = osuColourize.colourize(mapStatus[i].starRatings[0]);
                mapStatus[i].diffColour = bgColor;
                if (mapStatus[i].starRatings[0] < 4.4) {

                }
            }
        }
        return mapStatus;
    }

    function determineRowBg(status: string) {
        let statusClass = '';
        switch (status) {
            case "ranked":
                statusClass = "ranked";
                break;
            case "qualified":
                statusClass = "qualified";
                break;
            case "pending":
                statusClass = "pending";
                break;
            case "wip":
                statusClass = "wip";
                break;
        }
        return statusClass;
    }
</script>


      <p id="top-gd-text">below is a list of all <strong>{totalCount}</strong> gds i've done to date, including <strong>{wipCount}</strong> work in progress gds.</p>
      <p class="below-text" style="font-size: 20px;">this also includes all <strong>{collabCount}</strong> collabs that i've done so far~<br></p>
      <p class="below-text" style="font-size: 14px;">note that some may no longer have links associated with them (have been deleted).</p>
      <div class="gd-table-container">
        <audio controls id="tab-player-source">
          <source type="audio/mpeg">
        </audio>
        <table id="gdtab-kvEUP" class="gdtab">
            <colgroup>
                <col style="width: 18%;"/>
            </colgroup>
            <thead>
                <tr>
                    <th class="gdtab-top">background</th>
                    <th class="gdtab-top">title - artist</th>
                    <th class="gdtab-top">mapper</th>
                    <th class="gdtab-top">my diff</th>
                    <th class="gdtab-top">sr</th>
                    <th class="gdtab-top">mapped?</th>
                    <th class="gdtab-top">date finished</th>
                    <th class="gdtab-top">1st bn</th>
                    <th class="gdtab-top">2nd bn</th>
                    <th class="gdtab-top">status</th>
                </tr>
            </thead>
            <tbody id="gdtab-start">
                {#await populateRow()}
                    <tr><td>loading maps...</td></tr>
                {:then maps}
                    {#each maps as map}
                    <tr class="{determineRowBg(map.mapStatus)}">
                        <td style="background-image: url({map.bgLink}); padding: 0px 0px; background-size: cover; background-position: center;">
                            <!-- AudioPlayer here -->
                        </td>
                        <td class="gdtab-element"><a href={map.songURLs[0]}>{map.songName}</a></td>
                        <td class="gdtab-element"><span>{map.mapper}</span></td>
                        {#if map.plural}
                            <td class="gdtab-diff-box" style="padding: 0;">
                                {#each map.pluralInfo! as plural}
                                <div class="plural-padding" style="background-color: {plural.diffColour}"><span>{plural.diffname}</span></div>
                                {/each}
                            </td>
                            <td class="gdtab-diff-box" style="padding: 0;">
                                {#each map.pluralInfo! as plural}
                                <div class="plural-padding" style="background-color: {plural.diffColour}"><span>{plural.sr}</span></div>
                                {/each}
                            </td>
                            <td class="gdtab-element" style="padding: 0;">
                                {#each map.pluralInfo! as plural}
                                <div class="plural-padding" style="background-color: {plural.diffColour}"><span>{plural.amountMapped}</span></div>
                                {/each}
                            </td>
                        {:else}
                        <td class="gdtab-diff-box" style="background-color: {map.diffColour}">
                            <a href={map.songURLs[0]}>{map.difficulties[0]}</a>
                        </td>
                        <td class="gdtab-diff-box" style="background-color: {map.diffColour}">
                            <span>{map.starRatings[0]}</span>
                        </td>
                        <td class="gdtab-element" style="background-color: {map.diffColour}">
                            <span>{map.amountsMapped[0]}</span>
                        </td>
                        {/if}
                        <td class="gdtab-element"><span>{map.datesFinished[0]}</span></td>
                        <td class="gdtab-element"><span>{map.bns[0]}</span></td>
                        <td class="gdtab-element"><span>{map.bns[1]}</span></td>
                        <td class="gdtab-element" style="background-color: {map.statusColour}"><span>{map.mapStatus}</span></td>
                    </tr>
                    {/each}
                {/await}
            </tbody>
        </table>
    </div>

    <style>
      #top-gd-text {
    font-size: 24px;
    text-align: center;
    margin-bottom: 0;
}

.below-text {
    text-align: center;
    margin: 3px;
}

.gdtab {
    font-family: "Open Sans", sans-serif;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: auto; 
    width: 100%;
}

.gdtab td {
    border-color: rgb(100, 101, 112);
    padding: 10px 5px;
    word-break: normal;
}

.gdtab th {
    border-color: rgb(100, 101, 112);
    border-bottom: 1px solid;
    overflow: hidden;
    padding: 10px 5px;
    word-break: normal;
}

.gdtab .gdtab-top {
    color: white;
    font-family: "Open Sans", sans-serif;
    font-size: 14px;
    font-weight: normal;
    text-align: left;
    top: -1px;
    vertical-align: top;
}

.gdtab .gdtab-element {
    height: 80px;
    text-align: left;
    vertical-align: top;
}

.gdtab .gdtab-element-img {
    background-color: #6d9eeb;
}

.gdtab a {
    text-decoration: none;
    text-align: left;
    vertical-align: top;
}

.gdtab .gdtab-diff-box {
    vertical-align: top;
    padding-top: 10px;
}

.ranked {
    background-color: #93c47d;
    color: white;
} .ranked a {
    background: var(--shine);
    -webkit-background-clip: text;
    background-clip: text;
    background-color: #93c47d;
    -webkit-text-fill-color: transparent;
    background-size: 500% auto;
    animation: textShine 5s ease-in-out infinite alternate;
} .ranked span {
    background: var(--shine);
    -webkit-background-clip: text;
    background-clip: text;
    background-color: #93c47d;
    -webkit-text-fill-color: transparent;
    background-size: 500% auto;
    animation: textShine 5s ease-in-out infinite alternate;
}

.qualified {
    background-color: #6d9eeb;
} .qualified a {
    background: var(--shine);
    -webkit-background-clip: text;
    background-clip: text;
    background-color: #93c47d;
    -webkit-text-fill-color: transparent;
    background-size: 500% auto;
    animation: textShine 5s ease-in-out infinite alternate;
} .qualified span {
    background: var(--shine);
    -webkit-background-clip: text;
    background-clip: text;
    background-color: #93c47d;
    -webkit-text-fill-color: transparent;
    background-size: 500% auto;
    animation: textShine 5s ease-in-out infinite alternate;
}

@keyframes textShine {
    0% {
        background-position: 0% 50%;
    }
    100% {
        background-position: 100% 50%;
    }
}

.wip {
    background-color: #DEE0ED;
} .qualified a {
    color: var(--text);
} .qualified span {
    color: var(--text);
}

.plural-padding {
    padding: 7.5px 0 7.5px 5px;
    min-height: 35px;
}

@media screen and (max-width: 767px) {
    .gdtab {
        width: auto !important;
    }
    .gdtab col {
        width: auto !important;
    }
    .gd-table-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
}
</style>