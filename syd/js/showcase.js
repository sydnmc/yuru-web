//basically kinda like gds.js but not really :3

import { generatePageHeader } from './header.js';
import { colorate } from './osucolorator.js';

/* checking for page language */
var jp = false;
try {
    document.getElementById('jp-page').innerHTML = "";
    jp = true;
} catch { }

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

async function getSetInfo() {
    var mapStatus;

    try {
        var response
        response = await fetch("setinfo.json");
        if (!response.ok) {
            throw new Error(`Response: ${response.status}`);
        }
        mapStatus = await response.json();
    } catch (error) {
        console.log(error.message);
    }

    return await mapStatus;
}

function generateDisplay(mapDb, isGd) {
    var latestRanked = [];
    var additions = [];
    if (isGd) {
        let curMap = mapDb.length-1;
        while (latestRanked.length < 1) { //kinda silly to do this for 1, but there used to be more okay ;w;
            if (mapDb[curMap].mapStatus == "ranked" || mapDb[curMap].mapStatus == "qualified") {
                latestRanked.push(mapDb[curMap]);
            }
            curMap--;
        }

        for (let i = 0; i < mapDb.length; i++) {
            if (mapDb[i].songName == "U2 - Saigetsu (Koko & Satsuki ga Tenkomori's Sagyou Bougai Remix)" || mapDb[i].songName == "Snail's House - Sunday") { 
                additions.push(mapDb[i]);
            }
        }
    } else {
        for (let i = 0; i < mapDb.length; i++) {
            if (mapDb[i].setTitle == "Aiobahn - INTERNET ANGEL" || mapDb[i].setTitle == "Asaka - Sun is Coming Up (Movie Edit)" || mapDb[i].setTitle == "Yuuni - NUCiFERA") { //picking these 3 out for now
                latestRanked.push(mapDb[i]);
                if (latestRanked.length == 2) {
                    latestRanked.reverse(); //i want internet angel to be on top LMAO
                }
            }
        }
    }
    console.log(additions);

    let title = '';
    let url = '';
    let bottomText = '';
    let bg = '';
    let className = 'gd-thumb';

    var elements = '';
    var additionElements = '';
    for (let i = 0; i < 3; i++) {
        if (isGd) {
            if (i >= 1) {
                title = additions[i-1].songName;
                url = additions[i-1].songURLs[0];
                bottomText = `<p class="gd-text" style="color: ${colorate(additions[i-1].starRatings[0])}">${additions[i-1].difficulties[0]} | ${additions[i-1].starRatings[0]}☆</p>`;
                bg = additions[i-1].bgLink;
            } else {
                title = latestRanked[i].songName;
                url = latestRanked[i].songURLs[0];
                bottomText = `<p class="gd-text" style="color: ${colorate(latestRanked[i].starRatings[0])}">${latestRanked[i].difficulties[0]} | ${latestRanked[i].starRatings[0]}☆</p>`;
                bg = latestRanked[i].bgLink;
            }
        } else {
            title = latestRanked[i].setTitle;
            url = latestRanked[i].setUrl;
            bg = latestRanked[i].setBackgroundLink;
            className = 'set-thumb';
        }
        if (i >= 1 && isGd) {
            additionElements = additionElements+`<div class="${className}" style="background-image: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.8) 100%), url(${bg});">
            <h2 class="gd-title"><a class="gd-link" href=${url}>${title.substr(title.indexOf("-")+2)}</a></h2>
            <p class="gd-artist"><span style="font-size: 13px">by </span> ${title.substring(0, title.indexOf("-"))}</p>
            ${bottomText}
          </div>`;
        } else if (i == 0 && isGd) {
            elements = elements+`<div class="${className}" style="background-image: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.8) 100%), url(${bg});">
            <p class="upper-ranked-text ranked-text">❀ latest ranked gd ❀</p>
            <h2 class="gd-title"><a class="gd-link" href=${url}>${title.substr(title.indexOf("-")+2)}</a></h2>
            <p class="gd-artist"><span style="font-size: 13px">by </span> ${title.substring(0, title.indexOf("-"))}</p>
            ${bottomText}
          </div>`;
        } else {
            elements = elements+`<div class="${className}" style="background-image: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.8) 100%), url(${bg});">
            <h2 class="gd-title"><a class="gd-link" href=${url}>${title.substr(title.indexOf("-")+2)}</a></h2>
            <p class="gd-artist"><span style="font-size: 13px">by </span> ${title.substring(0, title.indexOf("-"))}</p>
            ${bottomText}
          </div>`;
        }
        
    }
    if (isGd) {
        document.getElementById('gd-display-wrapper').innerHTML = elements;
        document.getElementById('gd-display-wrapper').insertAdjacentHTML("beforeend", `<div id="divider"></div>`);
        document.getElementById('gd-display-wrapper').insertAdjacentHTML("beforeend", additionElements);

    } else {
        document.getElementById('maps-showcase-wrapper').innerHTML = elements;
    }
}

(async () => {
    generatePageHeader(jp, "index");

    var mapDb = await getMapStatus(jp);
    generateDisplay(mapDb, true);

    var setDb = await getSetInfo();
    generateDisplay(setDb, false);

    document.getElementById('gd-display-wrapper').addEventListener("click", () => {
        window.location.replace('gds.html');
    });

    document.getElementById('maps-showcase-wrapper').addEventListener("click", () => {
        window.location.replace('sets.html');
    });

    document.getElementById('songs-image').addEventListener("click", () => {
        window.location.replace('music.html');
    });
})();