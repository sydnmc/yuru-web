import { generatePageHeader } from './header.js';

function createSetRows(num) {
    const container = document.getElementById('set-container');
    var rowElement = "";

    for (let i = 0; i < num; i++) {
        var rowElement = rowElement+`<div class="set">
            <img class="set-content" id="set-img-${i}">
            <div class="text-container">
                <img class="status-icon" id="status-icon-${i}"></img>
                <a class="set-content" id="set-title-${i}"></a>
                <p class="set-content" id="set-yapping-${i}"><br>
            </div>
        </div>`;
        container.innerHTML = rowElement;
    }
}

function createIncompleteSetRows(num, offsetNum) {
    const container = document.getElementById('incomplete-set-container');
    var rowElement = "";

    for (let i = 0; i < num; i++) {
        var rowElement = rowElement+`<div class="set">
            <img class="set-content" id="set-img-${i+offsetNum}">
            <div class="text-container">
                <a class="set-content" id="set-title-${i+offsetNum}"></a>
                <p class="set-content" id="set-yapping-${i+offsetNum}"><br>
            </div>
        </div>`;
        container.innerHTML = rowElement;
    }
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

function populateRows(setInfo, incomplete, offsetNum) {
    for (let i = 0; i < setInfo.length; i++) {
        var rowNum = i+offsetNum;

        var setImg = document.getElementById('set-img-'+rowNum);
        var statusIcon;
        var title = document.getElementById('set-title-'+rowNum);
        var content = document.getElementById('set-yapping-'+rowNum);

        if (!incomplete) {
            statusIcon = document.getElementById('status-icon-'+rowNum);
        }

        if (setInfo[i].setBackgroundLink == "") { //if bg doesn't exist, tamatize it.
            setImg.src = "images/tamate.jpg";
        } else {
            console.log(statusIcon);
            setImg.src = setInfo[i].setBackgroundLink;
        }

        var iconUrl;
        if (!incomplete) {
            switch (setInfo[i].setStatus) {
                case "graved":
                    iconUrl = "https://i.ppy.sh/75dfe0bdfceeeed6a426c8db0234e4ef3300dc10/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f7374617475732f6772617665796172642e706e67";
                    break;
                case "ranked":
                    iconUrl = "https://i.ppy.sh/7f116c7b5f20a0f1b9b38d35b521f5bd070d864a/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f7374617475732f72616e6b65642e706e67";
                    statusIcon.style.width = "1.9%";
                    break;
                case "qualified":
                    iconUrl = "https://i.ppy.sh/dd2c44bf7db9f2e33f670205df7df3d028101888/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f7374617475732f7175616c69666965642e706e67";
                    break;
                case "loved":
                    iconUrl = "https://i.ppy.sh/2d6ca47d8e93f21d1bf09ce1c3c9661442092e57/68747470733a2f2f6f73752e7070792e73682f77696b692f696d616765732f7368617265642f7374617475732f6c6f7665642e706e67";
                    break;
            }
            statusIcon.src = iconUrl;
        }

        title.textContent = setInfo[i].setTitle;
        title.setAttribute('href', setInfo[i].setUrl);
        content.innerHTML = setInfo[i].setYapping;

        try { //if there exists urls to fill, fill them~ otherwise, don't do anything
            content.querySelector("a").setAttribute('href', setInfo[i].urls[i]);
            content.querySelector("a").classList.add("normal-text");
        } catch { }
    }
}

(async () => {
    generatePageHeader(false, "sets");
    var setInfo = await getSetInfo();

    var completeSetsList = [];
    var incompleteSetsList = [];

    for (let i = 0; i < setInfo.length; i++) { //creating temp set arrays
        if (setInfo[i].incomplete) {
            incompleteSetsList.push(setInfo[i]);
        } else {
            completeSetsList.push(setInfo[i]);
        }
    }

    createSetRows(completeSetsList.length);
    createIncompleteSetRows(incompleteSetsList.length, completeSetsList.length);
    
    populateRows(completeSetsList, false, 0);
    populateRows(incompleteSetsList, true, completeSetsList.length);
})();