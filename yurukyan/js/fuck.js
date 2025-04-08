/* FUCK stands for:
* Front
* Updating
* Cool
* Kode
*
* it totally isnt me hating on js. i would never. */
//FUCK also includes code for updating the currently/last playing song displayed

const endpoint = "https://api.yuru.ca"; //endpoint (backend)

async function fetchFromApi(apiEndpoint) {
    let response;
    try {
        response = await fetch(`${endpoint}/${apiEndpoint}`);
    } catch (err) {
        console.log(`Failed to fetch from yuru.ca API: ${err.message}`);
    }
    return await response.json();
}

function dateParser(frontLength, isFronting, jp) { 
    let hours = parseInt((frontLength/1000)/60/60);
    let minutes = parseInt((frontLength/1000)/60) - hours*60;
    if (isFronting) {
        if (jp) {
            timeDisplay = `${hours}時間${minutes}分`;
        } else {
            timeDisplay = `for ${hours} hours, ${minutes} minutes`;
        }
    } else {
        if (jp) {
            timeDisplay = `意識時間は${hours}時間${minutes}分でした`;
        } else {
            timeDisplay = `last fronted for ${hours} hours, ${minutes} minutes`;
        }
    }
    return timeDisplay;
}

async function lastFmUpdate(jp, curSongInfo) {
    var curSongName = curSongInfo.recenttracks.track[0].name;
    var curSongArtist = curSongInfo.recenttracks.track[0].artist['#text'];
    var songURL = curSongInfo.recenttracks.track[0].url;
    var currentText = "currently listening to"
    var lastText = "last listened to"
    if (jp) {
        currentText = "今聞いているの曲";
        lastText = "最後聞いたの曲";
    }

    try {
        curSongInfo.recenttracks.track[0]['@attr'].nowplaying //will error since this doesn't exist when not playing
        document.getElementById("last-played").innerHTML = `${currentText} <a style="color: rgb(180 181 191); text-decoration: none;" href="${songURL}">• ${curSongArtist} - ${curSongName}</a>
        <img class="lastfm-album-img" src=${curSongInfo.recenttracks.track[0].image[3]['#text']}></img>`;
    } catch {
        console.log("Song is not currently being played, reverting to last played");
        document.getElementById("last-played").innerHTML = `${lastText} <a style="color: rgb(180 181 191); text-decoration: none;" href="${songURL}">• ${curSongArtist} - ${curSongName}</a>
        <img class="lastfm-album-img" src=${curSongInfo.recenttracks.track[0].image[3]['#text']}></img>`;
    }
}


var overlayActive = false;
var overlay = document.getElementById('settings-overlay');
document.getElementById('settings').addEventListener("click", () => {
    if (!overlayActive) {
        overlay.style.display = 'block';
        overlayActive = true;
    } else {
        overlay.style.display = 'none';
        overlayActive = false;
    }
});
document.getElementById('settings-overlay').addEventListener("click", () => {
    if (!overlayActive) {
        overlay.style.display = 'block';
        overlayActive = true;
    } else {
        overlay.style.display = 'none';
        overlayActive = false;
    }
});

(async () => {
    /* checking for page language */
    var jp = false;
    if (document.documentElement.lang == 'jp') {
        jp = true;
    }

    /* last.fm */
    var songInfo = await fetchFromApi('songInfo');
    lastFmUpdate(jp, songInfo);

    /* pluralkit */
    var frontLength = document.getElementById('front-input').value; //takes in the value from the settings page
    try {
        frontLength = parseInt(frontLength);
    } catch {
        document.getElementById('front-input').insertAdjacentHTML('afterend', `<span>meow</span>`); //displays an error on the webpage
    }
    
    const frontList = await fetchFromApi(`pkInfo?frontList=true&before=${frontLength}`);
    //hardcoded 2 members bc im not gonna have more than lilac in me. if so shit
    //i'm keeping this comment because it's really funny in hindsight ^
    //there shouldn't be more than 3 of us, so i'm still not making it automatically update (front display needs different colours too!!)
    //but, just in case, it should be easier now.

    document.getElementById('sydney-percent').style = `width: ${frontList[0].memberPercent}%`;
    document.getElementById('lilac-percent').style = `width: ${frontList[1].memberPercent}%`;
    document.getElementById('hazel-percent').style = `width: ${frontList[2].memberPercent}%`;

    for (let i = 0; i < frontList.length; i++) {
        let days = Math.floor(frontList[i].memberTime/1000/60/60/24);
        let hours = Math.round((frontList[i].memberTime/1000/60/60)-days*24);
        document.getElementById(`${frontList[i].name}-tooltip`).innerHTML = `${frontList[i].name}<br>${days} days, ${hours} hours | ${frontList[i].memberPercent}%`;
    }

    //should probably optimize all of this at some point, but i think this works for now...?
    if (frontList[1].isFronting || frontList[2].isFronting) { //update links at the bottom to lilac's socials if lilac or hazel is fronting
        document.getElementById('twitter').href = "https://twitter.com/yuiyamuu";
        document.getElementById('discord').href = "discord://-/users/245588170903781377";

        document.getElementById(`p2-wrapper`).classList = "person-shine hidden-link";
        document.getElementById(`img-1`).classList = "cur-fronter";
        if (frontList[2].isFronting) {
            if (!jp) {
                document.getElementById(`name-1`).textContent = 'hazel';
            } else {
                document.getElementById(`name-1`).textContent = 'ヘーゼル';
            }
            document.getElementById(`img-1`).classList = "cur-fronter";
            document.getElementById(`img-1`).src = 'https://api.yuru.ca/images/hazelpfp.jpg';
            document.getElementById('time-1').style.padding = `2px`; //also not a great solution, but it makes the text align properly for now
            document.getElementById("time-1").textContent = dateParser(frontList[2].lastFrontAmount, frontList[2].isFronting, jp);
        } else {
            document.getElementById("time-1").textContent = dateParser(frontList[1].lastFrontAmount, frontList[1].isFronting, jp);
        }
    } else {
        document.getElementById(`p1-wrapper`).classList = "person-shine hidden-link";
        document.getElementById(`img-0`).classList = "cur-fronter";
    }
    document.getElementById("time-0").textContent = dateParser(frontList[0].lastFrontAmount, frontList[0].isFronting, jp);
})();