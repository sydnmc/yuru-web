import { colorate } from './osucolorator.js';
import { generatePageHeader } from './header.js';

function createRows(num) {
    const container = document.getElementById('gdtab-start');
    var rowElement = "";

    for (let i = 0; i < num; i++) {
        var rowElement = rowElement+`<tr id=gdtab-element-${i}>
            <td id="gdtab-element-img-${i}"></td>
            <td class="gdtab-element"><a id="tab-title-${i}"></a></td>
            <td class="gdtab-element" id="tab-mapper-${i}"></td>
            <td class="gdtab-diff-box" id="tab-diffname-wrapper-${i}"><a id="tab-diffname-${i}"></a></td>
            <td class="gdtab-diff-box" id="tab-sr-wrapper-${i}"><span id="tab-sr-${i}"></span></td>
            <td class="gdtab-element" id="tab-date-${i}"></td>
            <td class="gdtab-element" id="tab-bn1-${i}"></td>
            <td class="gdtab-element" id="tab-bn2-${i}"></td>
            <td class="gdtab-element" id="tab-status-${i}"></td>
            <td class="gdtab-element" id="tab-touhou-${i}"></td>
        </tr>`;
        container.innerHTML = rowElement;
    }
}

async function getMapStatus(isJapanese) {
    var mapStatus;

    try {
        var response
        if (isJapanese) {
            response = await fetch("mapstatus-jp.json");
        } else {
            response = await fetch("mapstatus.json");
        }
        if (!response.ok) {
            throw new Error(`Response: ${response.status}`);
        }
        mapStatus = await response.json();
    } catch (error) {
        console.log(error.message);
    }

    return await mapStatus;
}

async function populateRow(i, mapStatus) { //i = row number
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
    var pluralPercent = parseInt(100/plurality);

    var wrapper = document.getElementById("gdtab-element-"+i);

    var img = document.getElementById('gdtab-element-img-'+i);
    var title = document.getElementById('tab-title-'+i)
    var mapper = document.getElementById('tab-mapper-'+i);
    var diffname = document.getElementById('tab-diffname-'+i);
    var diffnameWrapper = document.getElementById('tab-diffname-wrapper-'+i);
    var sr = document.getElementById('tab-sr-'+i);
    var srWrapper = document.getElementById('tab-sr-wrapper-'+i);
    var date = document.getElementById('tab-date-'+i);
    var bn1 = document.getElementById('tab-bn1-'+i);
    var bn2 = document.getElementById('tab-bn2-'+i);
    var status = document.getElementById('tab-status-'+i);
    var touhou = document.getElementById('tab-touhou-'+i);

    var regularTextElements = [title, mapper, date, bn1, bn2, status];
    var allTextElements = [title, mapper, date, diffname, sr, bn1, bn2, status];
    //allMultipleElements = [diffname, sr, date]; - just a note ^_^ all these elements can be plural (just like lilac and i omg)

    img.style = `background-image: url('${bgLink}');
    style: padding: 0px 0px; 
    background-size: cover;
    background-position: center;
    image-rendering: pixelated;`;
    title.textContent = mapStatus[i].songName;

    var beatmapsetUrl = mapStatus[i].songURLs[0].substr(0, mapStatus[i].songURLs[0].indexOf("#osu/")); //KILLS the beatmap url and makes it the set

    if (plural) { //writing text for pluralized beatmaps
        var additionalDiffText = "";
        var additionalSrText = "";
        for (let j = 0; j < plurality; j++) {
            additionalDiffText = additionalDiffText+`<a id="tab-diffname-${i}-${j}" style='padding-bottom: 10px;'></a><br>
            `; //top applies the lost spacing around the element
            additionalSrText = additionalSrText+`<span id="tab-sr-${i}-${j}"></span><br>
            `;
        }
        diffnameWrapper.innerHTML = additionalDiffText; //writing the additional text inputs needed
        srWrapper.innerHTML = additionalSrText;

        for (let j = 0; j < plurality; j++) {
            document.getElementById(`tab-diffname-${i}-${j}`).textContent = mapStatus[i].difficulties[j];
            document.getElementById(`tab-sr-${i}-${j}`).textContent = mapStatus[i].starRatings[j];
            document.getElementById(`tab-diffname-${i}-${j}`).setAttribute('href', mapStatus[i].songURLs[j]); //assuming that plural diffs will always have a link
            
            document.getElementById(`tab-diffname-${i}-${j}`).style = 'padding-bottom: 10px;';
            document.getElementById(`tab-sr-${i}-${j}`).style = ``;
        }
    } else {
        if (beatmapsetUrl != "") {
            title.setAttribute('href', beatmapsetUrl); //if the stupid baka url exists, use it. otherwise not
            diffname.setAttribute('href', mapStatus[i].songURLs[0]);
        }
            diffname.textContent = mapStatus[i].difficulties[0];
            sr.textContent = mapStatus[i].starRatings[0];
            diffname.style = ``;
            sr.style = ``;
    }
    
    mapper.textContent = mapStatus[i].mapper;
    date.textContent = mapStatus[i].datesFinished[0];

    bn1.textContent = mapStatus[i].bns[0];
    bn2.textContent = mapStatus[i].bns[1]; //maps should have 2 bn strings always, even if they're blank

    document.getElementById('tab-status-'+i).textContent = mapStatus[i].mapStatus;

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

    if (mapStatus[i].touhou) { //touhou check has to happen after, in order to overwrite other colors
        touhou.textContent = "yes";
        touhou.style.backgroundColor = "#93c47d";
    } else {
        touhou.textContent = "no"; 
        touhou.style.backgroundColor = "#e06666";
    }

    //adding difficulty colors
    if (plural) {
        var gradient = `linear-gradient(to bottom, `
        for (let j = 0; j < plurality; j++) {
            if (j == 0) {
                gradient = gradient+colorate(mapStatus[i].starRatings[j])+' 0%,';
                gradient = gradient+colorate(mapStatus[i].starRatings[j])+' '+pluralPercent+'%,';
            }
            gradient = gradient+colorate(mapStatus[i].starRatings[j])+' '+pluralPercent*(j)+'%,';
            gradient = gradient+colorate(mapStatus[i].starRatings[j])+' '+pluralPercent*(j+1)+'%,';
        }

        gradient = gradient.substring(0, gradient.length-1)+")"; //formatting things
        diffnameWrapper.style.backgroundImage = gradient;
        srWrapper.style.backgroundImage = gradient;
    } else {
        diffnameWrapper.style.backgroundColor = colorate(mapStatus[i].starRatings[0]);
        srWrapper.style.backgroundColor = colorate(mapStatus[i].starRatings[0]);
    }
    
    var blackish = "rgb(40, 40, 40)";
    if (plural) {
        for (let j = 0; j < plurality; j++) {
            if (mapStatus[i].starRatings[j] < 4.4) { //in cases where the map background text is too bright
                document.getElementById(`tab-diffname-${i}-${j}`).style.color = blackish;
                document.getElementById(`tab-sr-${i}-${j}`).style.color = blackish;
            }
        }
    } else {
        if (mapStatus[i].starRatings[0] < 4.4) { //same, but for non plural
            diffname.style.color = blackish;
            sr.style.color = blackish;
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
}

(async () => {
    /* checking for page language */
    var jp = false;
    try {
        document.getElementById('jp-page').innerHTML = "";
        jp = true;
    } catch { }

    generatePageHeader(jp, "gds");

    var curMapStatus = await getMapStatus(jp);
    var wipCount = 0;
    var additionalPluralMaps = 0;

    document.body.onload = createRows(curMapStatus.length);

    for (let i = 0; i < curMapStatus.length; i++) {
        await populateRow(i, curMapStatus);
        if (curMapStatus[i].mapStatus == "wip") {
            wipCount++;
        }

        if (curMapStatus[i].difficulties.length > 1) { //plurality check
            additionalPluralMaps = additionalPluralMaps+curMapStatus[i].difficulties.length-1;
        }
    }

    document.getElementById('num-gds').textContent = curMapStatus.length - wipCount + additionalPluralMaps;
    document.getElementById('num-wip-gds').textContent = wipCount;
})();