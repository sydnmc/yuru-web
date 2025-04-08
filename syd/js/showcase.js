//basically kinda like gds.js but not really :3
import {} from '../https://api.yuru.ca/js/header.js'; //even though we're importing nothing, it still runs all the header generating code here
import { colorate } from '../https://api.yuru.ca/js/osucolorator.js';

const endpoint = "https://api.yuru.ca"; //endpoint (backend)

/* checking for page language */
var jp = false;
if (document.documentElement.lang == 'jp') {
    jp = true;
}

async function fetchFromApi(apiEndpoint) {
    let response;
    try {
        response = await fetch(`${endpoint}/${apiEndpoint}`);
    } catch (err) {
        console.log(`Failed to fetch from yuru.ca API: ${err.message}`);
    }
    return await response.json();
}

function generateDisplay(mapDb, isGd) {
    var latestRanked = new Object();
    var notableGds = [];
    var notableSets = [];

    if (isGd) {
        let curMap = mapDb.length-1; //starting from the very top here
        let foundRanked = false;
        while (!foundRanked && curMap > 0) {
            if (mapDb[curMap].mapStatus == "ranked" || mapDb[curMap].mapStatus == "qualified") { //qualified should show up, since i basically treat it as being ranked :p
                latestRanked = mapDb[curMap];
                foundRanked = true;
            }
            curMap--;
        }

        for (let i = 0; i < mapDb.length; i++) { //searching for these maps
            if (mapDb[i].songName == "U2 - Saigetsu (Koko & Satsuki ga Tenkomori's Sagyou Bougai Remix)" || mapDb[i].songName == "irohaRingo feat. flower - Why I hate you") { 
                notableGds.push(mapDb[i]);
            }
        }
    } else {
        for (let i = 0; i < mapDb.length; i++) {
            if (mapDb[i].setTitle == "Aiobahn - INTERNET ANGEL") { //makes sure internet angel is at the top, just a temp measure
                notableSets.unshift(mapDb[i]);
            } else if (mapDb[i].setTitle == "Asaka - Sun is Coming Up (Movie Edit)" || mapDb[i].setTitle == "Yuuni - NUCiFERA") {
                notableSets.push(mapDb[i]);
            }
        }
    }

    if (isGd) {
        let title = latestRanked.songName;
        document.getElementById('gd-thumb-0').style = `background-image: linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%), url(${latestRanked.bgLink})`
        document.getElementById('gd-link-0'). href = latestRanked.songURLs[0];
        document.getElementById('gd-link-0').textContent = title.substr(title.indexOf("-")+2);
        document.getElementById('latest-ranked-artist').textContent = title.substring(0, title.indexOf("-"));
        document.getElementById('diff-text-0').style = `color: ${colorate(latestRanked.starRatings[0])}`;
        document.getElementById('diff-text-0').textContent = `${latestRanked.difficulties[0]} | ${latestRanked.starRatings[0]}☆`;

        notableGds.reverse(); //needed now at least to make sure that the order is correct - swaps japanese goblin and sunday

        for (let i = 0; i < 2; i++) {
            let url = notableGds[i].songURLs[0];
            let bg = notableGds[i].bgLink;

            document.getElementById('gd-thumb-'+(i+1)).style = `background-image: linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%), url(${bg})`;
            document.getElementById('gd-link-'+(i+1)).href = url;
            document.getElementById('diff-text-'+(i+1)).style = `color: ${colorate(notableGds[i].starRatings[0])}`;
            document.getElementById('diff-text-'+(i+1)).textContent = `${notableGds[i].difficulties[0]} | ${notableGds[i].starRatings[0]}☆`;
        }
    } else {
        for (let i = 0; i < 3; i++) {
            let url = notableSets[i].setUrl;
            let bg = notableSets[i].setBackgroundLink;

            document.getElementById('set-thumb-'+i).style = `background-image: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.8) 100%), url(${bg})`
        }
    }
}

(async () => {
    var mapDb = await fetchFromApi(`gds?person=sydney`);
    generateDisplay(mapDb, true);

    var setDb = await fetchFromApi(`sets`);
    generateDisplay(setDb, false);

    document.getElementById('gd-display-wrapper').addEventListener("click", () => {
        window.location.href = 'gds.html';
    });

    document.getElementById('maps-showcase-wrapper').addEventListener("click", () => {
        window.location.href = 'sets.html';
    });

    document.getElementById('songs-image').addEventListener("click", () => {
        window.location.href = 'music.html';
    });
})();