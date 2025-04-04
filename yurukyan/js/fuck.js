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

function dateParser(fronterTime, prevTimestamp, isCurrent, isJapanese) { 
    if (prevTimestamp) {
        prevTimestamp = Date.parse(prevTimestamp);
    } else {
        prevTimestamp = Date.now();
    }

    fronterTime = Date.parse(fronterTime);
    let timeDiff = prevTimestamp - fronterTime;
    let timeDisplay;

    if (isCurrent) {
        let hours = parseInt((timeDiff/1000)/60/60);
        let minutes = parseInt((timeDiff/1000)/60) - hours*60;
        if (isJapanese) {
            timeDisplay = `${hours}時間${minutes}分`;
        } else {
            timeDisplay = `for ${hours} hours, ${minutes} minutes`;
        }
    } else {
        let hours = parseInt((timeDiff/1000)/60/60);
        let minutes = parseInt((timeDiff/1000)/60) - hours*60;
        if (isJapanese) {
            timeDisplay = `意識時間は${hours}時間${minutes}分でした`;
        } else {
            timeDisplay = `last fronted for ${hours} hours, ${minutes} minutes`;
        }
    }
    return timeDisplay;
}

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
        <img style="width: 4%; border-radius: 4px; vertical-align: middle;" src=${curSongInfo.recenttracks.track[0].image[3]['#text']}></img>`;
    } catch {
        console.log("Song is not currently being played, reverting to last played");
        document.getElementById("last-played").innerHTML = `${lastText} <a style="color: rgb(180 181 191); text-decoration: none;" href="${songURL}">• ${curSongArtist} - ${curSongName}</a>
        <img style="width: 4%; border-radius: 4px; vertical-align: middle;" src=${curSongInfo.recenttracks.track[0].image[3]['#text']}></img>`;
    }

    /* fronter */
    const frontList = await fetchFromApi(`pkInfo?frontList=true`);
    const sydneyInfo = await fetchFromApi(`pkInfo?user=tfprjx`);
    const lilacInfo = await fetchFromApi(`pkInfo?user=ckccgs`);
    const hazelInfo = await fetchFromApi(`pkInfo?user=yaangx`);
    //hardcoded 2 members bc im not gonna have more than lilac in me. if so shit
    //i'm keeping this comment because it's really funny in hindsight ^
    //there shouldn't be more than 3 of us, so i'm still not making it automatically update (front display needs different colours too!!)
    //but, just in case, it should be easier now.

    var members = [sydneyInfo, lilacInfo, hazelInfo];
    var fronter;

    document.getElementById('sydney-percent').style = `width: ${frontList.sydneyPercent}%`;
    document.getElementById('lilac-percent').style = `width: ${frontList.lilacPercent}%`;
    document.getElementById('hazel-percent').style = `width: ${frontList.hazelPercent}%`;

    var lastSydneyTimestamp;
    var lastLilacTimestamp;
    var lastHazelTimestamp;
    var leastCheck = 100;

    for (let i = 0; i < members.length; i++) {
        let curCheck = 0;
        let foundMatch = false;
        while (curCheck < frontList.frontHistory.length && !foundMatch) {
            if (members[i].id == frontList.frontHistory[curCheck].members[0]) {
                let isCurrent = false;
                let lastTimestamp;
                if (curCheck == 0) {
                    isCurrent = true;
                } else {
                    lastTimestamp = frontList.frontHistory[curCheck-1].timestamp;
                }
                let matchTimestamp = frontList.frontHistory[curCheck].timestamp;
                if (i == 0) {
                    lastSydneyTimestamp = dateParser(matchTimestamp, lastTimestamp, isCurrent, jp);
                    if (curCheck < leastCheck) {
                        fronter = 'sydney';
                        leastCheck = curCheck;
                    }
                } else if (i == 1) {
                    lastLilacTimestamp = dateParser(matchTimestamp, lastTimestamp, isCurrent, jp);;
                    if (curCheck < leastCheck) {
                        fronter = 'lilac';
                        leastCheck = curCheck;
                    }
                } else {
                    lastHazelTimestamp = dateParser(matchTimestamp, lastTimestamp, isCurrent, jp);;
                    if (curCheck < leastCheck) {
                        fronter = 'hazel';
                        leastCheck = curCheck;
                    }
                }
                foundMatch = true;
            }
            curCheck++;
        }
    }

    if (fronter == 'hazel' | fronter == 'lilac') { //update links at the bottom to lilac's socials if lilac or hazel is fronting
        document.getElementById('twitter').href = "https://twitter.com/yuiyamuu";
        document.getElementById('discord').href = "discord://-/users/245588170903781377";

        document.getElementById(`p2-wrapper`).classList = "person-shine";
        document.getElementById(`img-1`).classList = "cur-fronter";
        if (fronter == 'hazel') {
            document.getElementById(`name-1`).textContent = 'hazel';
            document.getElementById(`img-1`).classList = "cur-fronter";
            document.getElementById(`img-1`).src = './images/hazelpfp.jpg';
            document.getElementById('time-1').style.padding = `2px`; //also not a great solution, but it makes the text align properly for now
            document.getElementById("time-1").textContent = lastHazelTimestamp;
        } else {
            document.getElementById("time-1").textContent = lastLilacTimestamp;
        }
    } else {
        document.getElementById(`p1-wrapper`).classList = "person-shine";
        document.getElementById(`img-0`).classList = "cur-fronter";
    }
    document.getElementById("time-0").textContent = lastSydneyTimestamp;
})();