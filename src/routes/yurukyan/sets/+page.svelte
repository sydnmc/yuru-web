<svelte:head>
    <meta property="og:site_name" content="yurukyan△">
    <meta property="og:title" content="yurukyan△ | sets">
    <meta property="og:description" content="a list of all of the sets we've made">
    <meta name="theme-color" content="#FCE758">
    <title>yurukyan△ | sets</title>
</svelte:head>
    
<script lang="ts">
    export let data;
    const { setInfo } = data; //loads setInfo before the page can completely load - useful since that's the main point of the page :p

    let completeSetsList: beatmapset[] = [];
    let incompleteSetsList: beatmapset[] = [];

    for (let i = 0; i < setInfo.length; i++) { //creating seperate set arrays
        if (setInfo[i].incomplete) {
            incompleteSetsList.push(setInfo[i]);
        } else {
            completeSetsList.push(setInfo[i]);
        }
    }

function findStatus(status: string) {
    let iconUrl = "https://i.ppy.sh/75dfe0bdfceeeed6a426c8db0234e4ef3300dc10/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f7374617475732f6772617665796172642e706e67"; //default to graved if nothing else
    switch (status) {
        case "graved":
            iconUrl = "https://i.ppy.sh/75dfe0bdfceeeed6a426c8db0234e4ef3300dc10/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f7374617475732f6772617665796172642e706e67";
            break;
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
</script>

    <h1 style="text-align: center;"><a class=title href="https://yuru.ca">yurukyan△</a></h1>
    <h1>complete spreads:</h1>
    <div class="set-container" id="set-container">
        {#each completeSetsList as set}
        <div class="set">
            <img alt={set.setTitle} src={set.setBackgroundLink}>
            <div class="text-container">
                <img class="status-icon" src={findStatus(set.setStatus)} alt="status icon">
                <a class="set-title" href={set.setUrl}>{set.setTitle}</a>
                <p>{@html set.setYapping}</p><br>
            </div>
        </div>
        {/each}
    </div>
    <div class="incomplete-warning">
      <div id="warning"><strong>! warning !</strong><br></div>
      <span>only read this if you have nothing to better to do<br>
      <span style="font-size: 12px;">or just wanna know what i think about a particular map or something idk im not judging</span><br>
       you have been warned...</span></div>
    <h1>incomplete spreads:</h1>
    <div class="set-container" id="incomplete-set-container">
        {#each incompleteSetsList as set}
        <div class="set">
            <img alt={set.setTitle} src={set.setBackgroundLink}>
            <div class="text-container">
                <img class="status-icon" src={findStatus(set.setStatus)} alt="status icon">
                <a class="set-title" href={set.setUrl}>{set.setTitle}</a>
                <p>{@html set.setYapping}</p><br>
            </div>
        </div>
        {/each}
    </div>

<style>
    /* local variables */
:root {
    --tent: #FCE758;
    --lighter-bg: rgb(55, 55, 55);
}

a.title {
    font-family: Kyokasho, sans-serif;
    color: var(--tent);
    font-size: 58px;
    text-decoration: none;
}

.set {
    display: flex;
    background-color: var(--lighter-bg);
    border: 3px solid var(--sydney-main);
    border-radius: 5px;
    min-height: 85px;
    margin-left: 2.5%;
    margin-right: 2.5%;
    margin-top: 20px;
}

h1 { /* this is needed for things other than the title (incomplete/complete sets text), makes it centered */
    font-family: Kyokasho, sans-serif;
    font-weight: normal;
    color: white;
    font-size: 36px;
    text-align: center;
}

.set img {
    max-width: 20%;
    object-fit: cover;
}

.text-container { /* container of text inside each set */
    width: 100%;
    padding-left: 10px;
    padding-top: 10px;
}

.set-title {
    font-family: Kyokasho, sans-serif;
    font-size: 32px;
    color: white;
    text-decoration: none;
}

.status-icon {
    width: 16px;
    padding-right: 5px;
    /* vertical-align: middle doesn't look quite right, but i'd want this centered in some way */
}

.incomplete-warning {
    color: var(--lilac-main);
    margin-top: 20px;
    text-align: center;
}

#warning {
    font-size: 22px;
    background-color: #f26376;
    border-radius: 5px;
    margin-bottom: 8px;
}
</style>