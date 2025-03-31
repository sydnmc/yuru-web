/* FUCK stands for:
* Front
* Updating
* Cool
* Kode
*
* it totally isnt me hating on js. i would never. */
//FUCK also includes code for updating the currently/last playing song displayed

const endpoint = "http://localhost:3333"; //endpoint (backend)

async function fetchFromApi(apiEndpoint) {
    let response;
    try {
        response = await fetch(`${endpoint}/${apiEndpoint}`);
    } catch (err) {
        console.log(`Failed to fetch from yuru.ca API: ${err.message}`);
    }
    return await response.json();
}

async function getUser(front, frontList) {
    let userID;

    if (front) {
        userID = frontList[0].members[0];
    } else {
        userID = frontList[1].members[0];
    }

    return await fetchFromApi(`pkInfo?user=${userID}`);
}

function dateParser(time, isCurrent, fronterTime, isJapanese) { 
    time = Date.parse(time);
    fronterTime = Date.parse(fronterTime);
    var currentTime = Date.now();
    var timeDiff = currentTime - time;
    var timeDisplay;

    if (isCurrent) {
        var hours = parseInt((timeDiff/1000)/60/60);
        var minutes = parseInt((timeDiff/1000)/60) - hours*60;
        if (isJapanese) {
            timeDisplay = `${hours}時間${minutes}分`;
            console.log('the fuck');
        } else {
            timeDisplay = `for ${hours} hours, ${minutes} minutes`;
        }
    } else {
        timeDiff = currentTime - fronterTime - timeDiff;

        var hours = parseInt((timeDiff/1000)/60/60);
        var minutes = parseInt((timeDiff/1000)/60) - hours*60;
        if (isJapanese) {
            timeDisplay = `意識時間は${hours}時間${minutes}分でした`;
            console.log('the fuck');
        } else {
            timeDisplay = `last fronted for ${hours} hours, ${minutes} minutes`;
        }
    }
    return timeDisplay;
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
    try {
        document.getElementById('jp-page').innerHTML = "";
        jp = true;
    } catch { }

    /* last.fm */
    var curSongInfo = await fetchFromApi('songInfo');
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

    /* fronter */
    var frontLength = document.getElementById('front-input').value;
    try {
        frontLength = parseInt(frontLength);
    } catch {
        document.getElementById('front-input').insertAdjacentHTML('afterend', `<span>meow</span>`);
    }

    const frontList = await fetchFromApi(`pkInfo?frontList=true?before=${frontLength}`);
    const p1 = await getUser(true, frontList.frontHistory); //true = fronter
    const p2 = await getUser(false, frontList.frontHistory);
    //var members = [p1, p2]; //hardcoded 2 members bc im not gonna have more than lilac in me. if so shit
    //good morning, petal. i have to write code to account for you, cutie

    if (members[0].name != "sydney") { //whenever lilac is fronting
        let lilac = p1;
        let sydney = p2;
        members = [sydney, lilac];
    }

    document.getElementById('sydney-percent').style = `width: ${frontList.sydneyPercent}%`;
    document.getElementById('lilac-percent').style = `width: ${frontList.lilacPercent}%`;

    for (let i = 0; i < members.length; i++) {
        let personTime;
        let personName = members[i].name;

        if (frontList.frontHistory[0].members[0] == members[i].id) { //long way to check if current user is fronting or not
            personTime = dateParser(frontList.frontHistory[0].timestamp, true, null, jp);
            document.getElementById(`p${i+1}-wrapper`).classList = "person-shine hidden-link";
            document.getElementById(`img-${i}`).classList = "cur-fronter";

            //update links at the bottom depending on whos fronting
            if (personName != "sydney") {
                document.getElementById('twitter').href = "https://twitter.com/yuiyamuu";
                document.getElementById('discord').href = "discord://-/users/245588170903781377";
            }
        } else {
            personTime = dateParser(frontList.frontHistory[0].timestamp, false, frontList.frontHistory[1].timestamp, jp);
        }
        document.getElementById("time-"+i).textContent = personTime;
    }
})();