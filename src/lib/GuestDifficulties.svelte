<script lang="ts">
    export let person: string;

    import * as osuColourize from 'osu-colourizer';
    import type { gd } from '../app';
    import AudioPlayer from './AudioPlayer.svelte';
    import { PUBLIC_API } from '$env/static/public';

    async function fetchFromApi(apiEndpoint: string) {
        let response = await fetch(`${PUBLIC_API}/${apiEndpoint}`);
        return await response.json();
    }

    let wipCount = 0;
    let collabCount = 0;
    let totalCount = 0;

    let showUnserious = false;

    async function populateRow() {
        let fetchPerson = person;
        if (person === "syd") { fetchPerson = 'sydney' }
        let mapStatus: gd[] = await fetchFromApi(`gds?person=${fetchPerson}`); //since we fetch mapdata in this function, it's best to populate everything we need for other parts of the page as well~

        for (let i = 0; i < mapStatus.length; i++) {
            let set: gd = mapStatus[i];
            for (let j = 0; j < mapStatus[i].maps.length; j++) {
                let diff: beatmap = mapStatus[i].maps[j];
                if (set.status === "wip") {
                    wipCount++;
                } else {
                    totalCount++;
                }
                if (diff.amountMapped !== "all") {
                    collabCount++;
                }
            }
        }

        /* done with updating the rest of the page, so now we focus on the gds themselves~ */
        for (let i = 0; i < mapStatus.length; i++) { //loops through every diff we have
            let bgLink = mapStatus[i].bgLink;
            if (!bgLink) {
                mapStatus[i].bgLink = "/common/tamate.jpg" //replaces backgrounds with no link with えっとですねぇ～　たまてって名前は玉手箱が由来でして
            }

            //adding difficulty colour
            let blackish = "rgb(40, 40, 40)";
            for (let j = 0; j < mapStatus[i].maps.length; j++) {
                let diff = mapStatus[i].maps[j];
                let bgColour;
                if (typeof diff.sr === "string") {
                    bgColour = "rgb(222, 224, 237)"; //makes it the wip colour if its still wip but in a plural gd thats finished already
                } else {
                    bgColour = osuColourize.colourizeHex(diff.sr);
                    bgColour = bgColour+"4d"; //30% brightness in hex
                }
                diff.diffColour = bgColour;

                if (diff.sr < 4.4 || typeof diff.sr === "string") { //in cases where the map background text is too bright, or is wip (still too bright)
                    mapStatus[i].maps[j];
                }
            }
        }
        return mapStatus;
    }

    function determineRowColour(status: string) {
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

<div class="divider">
    <div id="rank-checkbox-container">
        <input type="checkbox" bind:checked={showUnserious}/>
        <span>show not for rank gds</span>
    </div>
    <h2>guest difficulties ❀</h2>
    <p>total finished <span>{totalCount}</span></p>
    <p>collabs <span>{collabCount}</span></p>
    <p>wip <span>{wipCount}</span></p>
</div>
<div>
    {#await populateRow()}
        <h1 class="loading-text">now loading gds...</h1>
    {:then maps}
        {#each maps as gd}
            {#if (gd.isForRank && !showUnserious) || showUnserious}
            <div class="gd {determineRowColour(gd.status)}" style="linear-gradient(90deg,rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.6) 100%);">
                <div class="audio-container" style="background-image: url({gd.bgLink});">
                    <AudioPlayer gdInfo={gd} />
                </div>
                <div class="gd-text">
                    <h2><a href="https://osu.ppy.sh/beatmapsets/{gd.mapId}">{gd.artist} - {gd.title}</a></h2>
                    <p>status <span>{gd.status}</span></p>
                    <p>host <span>{gd.creator}</span></p>
                    {#if gd.bns.length > 0}
                    <p>bns
                        {#each gd.bns as bn}
                        <span>{bn}⠀</span> <!-- uses a stupid fucking unicode space since svelte cuts off normal spaces, best solution i could think of -->
                        {/each}
                    </p>
                    {/if}
                    <div class="diff-container">
                        {#each gd.maps as diff}
                        <div class="diff" style="background-color: {diff.diffColour}">
                            <h3><a href="https://osu.ppy.sh/beatmapsets/{gd.mapId}#osu/{diff.id}">{diff.diffname}</a></h3>
                            <p>stars <span>{diff.sr}</span></p>
                            <p>mapped <span>{diff.amountMapped}</span></p>
                            <p>date finished <span>{diff.dateFinished}</span></p>
                        </div>
                        {/each}
                    </div>
                </div>
            </div>
            {/if}
        {/each}
    {:catch}
        <h1 class="loading-text">something went wrong! :c</h1>
    {/await}
</div>


<style>
.divider {
    position: relative;
    text-align: right;
    padding-top: 20px;
    padding-right: 20px;
    padding-bottom: 5px;
    background: linear-gradient(90deg,rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.6) 100%);
} .divider h2 {
    margin-top: 5px;
    font-weight: normal;
}

.loading-text {
    text-align: center;
}

#rank-checkbox-container {
    position: absolute;
    bottom: 15px;
    left: 15px;
}

.gd {
    display: flex;
    min-height: 120px;
    margin-left: 15px;
    margin-right: 15px;
}

.audio-container {
    width: 22%;
    object-fit: cover;
}

.gd-text {
    display: flex;
    flex-direction: column;
    width: 78%;
    padding-left: 10px;
    padding-top: 10px;
} .gd-text h2 {
    font-family: Kyokasho, sans-serif;
    font-weight: normal;
    display: inline;
    margin: 0;
} .gd-text h2 a {
    color: white;
    text-decoration: none;
} .gd-text p {
    margin: 0;
} .gd-text p span {
    color: white;
}

.diff-container {
    display: flex;
    margin-left: -10px;
    margin-top: 10px;
}

.diff {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 10px;
    padding-top: 8px;
    padding-bottom: 8px;
    width: 100%;
} .diff h3 {
    margin: 0;
} .diff h3 a {
    text-decoration: none;
    color: white;
} .diff p {
    margin: 0;
} .diff p span {
    color: white;
}

.ranked {
    background: linear-gradient(90deg,rgba(147, 196, 125, 0.8) 0%, rgba(147, 196, 125, 0.0) 100%);
}

.qualified {
    background: linear-gradient(90deg,rgba(109, 158, 235, 0.8) 0%, rgba(109, 158, 235, 0.0) 100%);

}

.wip {
    background-color: #DEE0ED;
} .wip div h2 a {
    color: black;
} .wip div span {
    color: black;
}

.pending {
    background: linear-gradient(90deg,rgba(255, 217, 102, 0.8) 0%, rgba(255, 217, 102, 0.0) 100%);
}

@media screen and (max-width: 767px) {

}
</style>
