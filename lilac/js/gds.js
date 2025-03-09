import { colorate } from './osucolorator.js';
import { generatePageHeader } from './header.js';

const endpoint = "http://localhost:3333"; //endpoint (backend)

function createRows(num) {
    const container = document.getElementById('gdtab-start');
    var rowElement = "";

    for (let i = 0; i < num; i++) {
        rowElement = rowElement+`<tr id=gdtab-element-${i}>
            <td id="gdtab-element-img-${i}">
                <div class="play-button-container" id="play-container-${i}">
                    <span class="play-button" id="tab-player-${i}"><i class="fa fa-play" style="font-size: 40px"></i></span>
                </div>
            </td>
            <td class="gdtab-element"><a id="tab-title-${i}"></a></td>
            <td class="gdtab-element" id="tab-mapper-${i}"></td>
            <td class="gdtab-diff-box" id="tab-diffname-wrapper-${i}"><a id="tab-diffname-${i}"></a></td>
            <td class="gdtab-diff-box" id="tab-sr-wrapper-${i}"><span id="tab-sr-${i}"></span></td>
            <td class="gdtab-element" id="tab-amount-wrapper-${i}"><span id="tab-amount-mapped-${i}"></td>
            <td class="gdtab-element" id="tab-date-${i}"></td>
            <td class="gdtab-element" id="tab-bn1-${i}"></td>
            <td class="gdtab-element" id="tab-bn2-${i}"></td>
            <td class="gdtab-element" id="tab-status-${i}"></td>
        </tr>`;
        container.innerHTML = rowElement;
    }
}

async function getMapStatus() {
    var mapStatus;
    try {
        var response;
        response = await fetch(`${endpoint}/gds?person=lilac`);
        if (!response.ok) {
            throw new Error(`Response: ${response.status}`);
        }
        mapStatus = await response.json();
    } catch (error) {
        console.log(error.message);
    }

    return await mapStatus;
}

async function populateRow(i, mapStatus, isJapanese) { //i = row number
    var bgLink;
    var imgSheetLink = mapStatus[i].bgLink;
    if (imgSheetLink == "") {
        bgLink = "images/tamate.jpg" //replaces backgrounds with no link with えっとですねぇ～　たまてって名前は玉手箱が由来でして
    } else {
        bgLink = imgSheetLink;
    }

    var plural = false; //if a map has more than one difficulty by me in it
    var plurality; //number of diffs a map has

    if (mapStatus[i].difficulties.length > 1) {
        plural = true;
        plurality = mapStatus[i].difficulties.length;
    }
    var wrapper = document.getElementById("gdtab-element-"+i);

    var playContainer = document.getElementById('play-container-'+i);

    var img = document.getElementById('gdtab-element-img-'+i);
    var title = document.getElementById('tab-title-'+i)
    var mapper = document.getElementById('tab-mapper-'+i);
    var diffname = document.getElementById('tab-diffname-'+i);
    var diffnameWrapper = document.getElementById('tab-diffname-wrapper-'+i);
    var sr = document.getElementById('tab-sr-'+i);
    var srWrapper = document.getElementById('tab-sr-wrapper-'+i);
    var amount = document.getElementById('tab-amount-mapped-'+i);
    var amountWrapper = document.getElementById('tab-amount-wrapper-'+i);
    var date = document.getElementById('tab-date-'+i);
    var bn1 = document.getElementById('tab-bn1-'+i);
    var bn2 = document.getElementById('tab-bn2-'+i);
    var status = document.getElementById('tab-status-'+i);

    var regularTextElements = [title, mapper, date, bn1, bn2, status];
    var allTextElements = [title, mapper, date, diffname, sr, bn1, bn2, status];
    //allMultipleElements = [diffname, sr, date]; - just a note ^_^ all these elements can be plural (just like lilac and i omg)

    img.style = `background-image: url('${bgLink}');
    padding: 0px 0px; 
    background-size: cover;
    background-position: center;`;
    if (!isJapanese) {
        title.textContent = mapStatus[i].songName;
    } else {
        title.textContent = mapStatus[i].songNameUnicode;
    }

    var beatmapsetUrl = mapStatus[i].songURLs[0].substr(0, mapStatus[i].songURLs[0].indexOf("#osu/")); //KILLS the beatmap url and makes it the set

    if (plural) { //writing text for pluralized beatmaps
        diffnameWrapper.style = "padding: 0";
        amountWrapper.style = "padding: 0";
        srWrapper.style = "padding: 0"; //removes padding, since for plural beatmaps we'll handle that ourselves
        
        var additionalDiffText = "";
        var additionalSrText = "";
        var additionalAmountText = "";
        for (let j = 0; j < plurality; j++) {
            additionalDiffText = additionalDiffText+`<div id="tab-plural-diff-${i}-${j}" class="plural-padding"><a id="tab-diffname-${i}-${j}"></a></div>
            `;
            additionalSrText = additionalSrText+`<div id="tab-plural-sr-${i}-${j}" class="plural-padding"><span id="tab-sr-${i}-${j}"></span></div>
            `;
            additionalAmountText = additionalAmountText+`<div id="tab-plural-amount-${i}-${j}" class="plural-padding"><span id="tab-amount-${i}-${j}"></span></div>
            `;
        }
        diffnameWrapper.innerHTML = additionalDiffText; //writing the additional text inputs needed
        srWrapper.innerHTML = additionalSrText;
        amountWrapper.innerHTML = additionalAmountText;

        for (let j = 0; j < plurality; j++) {
            document.getElementById(`tab-diffname-${i}-${j}`).textContent = mapStatus[i].difficulties[j];
            document.getElementById(`tab-sr-${i}-${j}`).textContent = mapStatus[i].starRatings[j];
            document.getElementById(`tab-amount-${i}-${j}`).textContent = mapStatus[i].amountsMapped[j];
            document.getElementById(`tab-diffname-${i}-${j}`).setAttribute('href', mapStatus[i].songURLs[j]); //assuming that plural diffs will always have a link
        }
    } else {
        if (beatmapsetUrl != "") {
            title.setAttribute('href', beatmapsetUrl); //if the stupid baka url exists, use it. otherwise not
            diffname.setAttribute('href', mapStatus[i].songURLs[0]);
        }
            diffname.textContent = mapStatus[i].difficulties[0];
            sr.textContent = mapStatus[i].starRatings[0];
            status.textContent = mapStatus[i].mapStatus;
            diffname.style = ``;
            sr.style = ``;
            status.style = ``;
    }

    /* adjusting heights */
    amount.textContent = mapStatus[i].amountsMapped[0];
    mapper.textContent = mapStatus[i].mapper;
    date.textContent = mapStatus[i].datesFinished[0];

    bn1.textContent = mapStatus[i].bns[0];
    bn2.textContent = mapStatus[i].bns[1]; //maps should have 2 bn strings always, even if they're blank

    switch(mapStatus[i].mapStatus) {
        case "deadge (pretty bad)":
        case "deadge (unfinished spread)":
            status.style.backgroundColor = "#999999";
            break;
        case "deadge":
        case "deadge (not for rank)":
        case "deadge (meme set)":
            status.style.backgroundColor = "#b7b7b7";
            break;
        case "deleted":
            status.style.backgroundColor = "#666666";
            break;
        case "set wip":
            status.style.backgroundColor = "#f6b26b";
            break;
        case "wip":
            wrapper.classList.add("wip");
            break;
        case "pending":
            wrapper.style.backgroundColor = "#ffd966";
            wrapper.style.color = "black"; //background too bright
            break;
        case "qualified":
            wrapper.classList.add("qualified");
            break;
        case "ranked":
            wrapper.classList.add("ranked");
            break;
    }

    //adding difficulty colors
    if (plural) {
        for (let j = 0; j < plurality; j++) {
            let bgColor;
            if (typeof mapStatus[i].starRatings[j] == "string") {
                bgColor = "rgb(222, 224, 237)"; //makes it the wip color if its still wip but in a plural gd thats finished already
            } else {
                bgColor = colorate(mapStatus[i].starRatings[j]);
            }
            document.getElementById(`tab-plural-diff-${i}-${j}`).style = `background-color: ${bgColor}`;
            document.getElementById(`tab-plural-sr-${i}-${j}`).style = `background-color: ${bgColor}`;
            document.getElementById(`tab-plural-amount-${i}-${j}`).style = `background-color: ${bgColor}`;
        }
    } else {
        let bgColor = colorate(mapStatus[i].starRatings[0]);
        diffnameWrapper.style.backgroundColor = bgColor;
        srWrapper.style.backgroundColor = bgColor;
        amountWrapper.style.backgroundColor = bgColor;
    }

    //fixing difficulty text colors
    var blackish = "rgb(40, 40, 40)";
    if (plural) {
        for (let j = 0; j < plurality; j++) {
            if (mapStatus[i].starRatings[j] < 4.4 || typeof mapStatus[i].starRatings[j] == "string") { //in cases where the map background text is too bright, or is wip (still too bright)
                document.getElementById(`tab-diffname-${i}-${j}`).style.color = blackish;
                document.getElementById(`tab-sr-${i}-${j}`).style.color = blackish;
                document.getElementById(`tab-amount-${i}-${j}`).style.color = blackish;
            }
        }
    } else {
        if (mapStatus[i].starRatings[0] < 4.4) { //same, but for non plural
            diffname.style.color = blackish;
            sr.style.color = blackish;
            amount.style.color = blackish;
        }
    }

    switch (mapStatus[i].mapStatus) {
        case "pending":
            for (let j = 0; j < regularTextElements.length; j++) {
                regularTextElements[j].style.color = blackish;
            }
            break;
        case "ranked":
        case "qualified":
            for (let j = 0; j < regularTextElements.length; j++) {
                regularTextElements[j].classList.add("ranked-text");
            }
            break;
        case "wip":
            for (let j = 0; j < allTextElements.length; j++) {
                allTextElements[j].style.color = blackish;
            }
            break;
    }

    requestAnimationFrame(() => {
        playContainer.style.height = (wrapper.getBoundingClientRect().height)+"px";
    });

    if (plural) {
        for (let j = 0; j < plurality; j++) {
            requestAnimationFrame(() => { //waits for everything to be properly updated before actually messing with it
                let curHeight = document.getElementById(`tab-plural-diff-${i}-${j}`).getBoundingClientRect().height - 15;
                document.getElementById(`tab-plural-sr-${i}-${j}`).style.height = curHeight+"px"; //automatically adjusting height
                document.getElementById(`tab-plural-amount-${i}-${j}`).style.height = curHeight+"px"; 
            });
        }
    } 
}

(async () => {
    /* checking for page language */
    var jp = false;
    try {
        document.getElementById('jp-page').innerHTML = "";
        jp = true;
    } catch { }

    generatePageHeader(jp, "gds");

    /* populating rows */
    var curMapStatus = await getMapStatus(jp);
    var wipCount = 0;
    var collabCount = 0;
    var additionalPluralMaps = 0;

    document.body.onload = createRows(curMapStatus.length);

    for (let i = 0; i < curMapStatus.length; i++) {
        await populateRow(i, curMapStatus, jp);
        if (curMapStatus[i].mapStatus == "wip") {
            wipCount++;
        }
        if (curMapStatus[i].amountsMapped[0] != "all") {
            collabCount++;
        }

        if (curMapStatus[i].difficulties.length > 1) { //plurality check
            additionalPluralMaps = additionalPluralMaps+curMapStatus[i].difficulties.length-1;
        }
    }

    document.getElementById('num-gds').textContent = curMapStatus.length - wipCount + additionalPluralMaps;
    document.getElementById('num-wip-gds').textContent = wipCount;
    document.getElementById('num-collabs').textContent = collabCount;

    /* preview buttons */
    var audio = document.getElementById('tab-player-source');
    var setIDs = [];

    for (let i = 0; i < curMapStatus.length; i++) {
        var curSongUrl = curMapStatus[i].songURLs[0];
        var setID = curSongUrl.substr(curSongUrl.indexOf("/beatmapsets/")+13, curSongUrl.length); //gets the beatmap id
        if (setID.includes("#osu")) { //again, will only work for std so be careful
            setID = setID.substring(0, setID.indexOf("#osu"));
        }
        setIDs.push(setID);
    }

    var mapIsPlaying = new Array(setIDs.length).fill(false);

    for (let i = 0; i < curMapStatus.length; i++) {
        var curButton = document.getElementById('tab-player-'+i);

        curButton.addEventListener("click", () => {
            var clickedButton = document.getElementById('tab-player-'+i);
            audio.src = `https://b.ppy.sh/preview/${setIDs[i]}.mp3`;
            audio.volume = 0.2; //doesnt make your ears DIE

            if (!mapIsPlaying[i]) {
                audio.play();
                clickedButton.innerHTML = `<i class="fa fa-pause" style="font-size: 40px"></i>`; //pause button
                mapIsPlaying[i] = true;
            } else {
                audio.pause();
            }

            if (audio.paused || audio.ended) {
                mapIsPlaying[i] = false;
                clickedButton.innerHTML = `<i class="fa fa-play" style="font-size: 40px"></i>`; //makes it a play button again if paused
            }
            if (mapIsPlaying.filter(Boolean).length > 1) { //checks for if it's paused or ended, but also if more than 1 value is true (if another button is clicked instead)
                for (let check = 0; check < mapIsPlaying.length; check++) {
                    if (mapIsPlaying[check] && check != i) {
                        mapIsPlaying[check] = false;
                        document.getElementById('tab-player-'+check).innerHTML = `<i class="fa fa-play" style="font-size: 40px"></i>`; //makes it a play button again if paused
                    }
                }
            }
        });
    }
})();