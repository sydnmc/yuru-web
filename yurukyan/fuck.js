/* FUCK stands for:
* Front
* Updating
* Cool
* Kode
*
* it totally isnt me hating on js. i would never. */

const systemURL = "https://api.pluralkit.me/v2/"; //ytcvss is my AWESOME SYSTEM YAY
const lastFmURL = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=bnmc_&api_key=f2eed0b71c94d900942a954c37a0d0ec&format=json&limit=1";

async function getLastSong() {
    var songInfo;

    try {
        const response = await fetch(lastFmURL);
        if (!response.ok) {
            throw new Error(`Response: ${response.status}`);
        }
        songInfo = await response.json();
    } catch (error) {
        console.log(error.message);
    }

    return await songInfo;
}

async function getFrontList() {
    var systemSwitches;

    try {
        const response = await fetch(systemURL+"systems/ytcvss/switches");
        if (!response.ok) {
            throw new Error(`Response: ${response.status}`);
        }
        systemSwitches = await response.json();
    } catch (error) {
        console.log(error.message);
    }

    return await systemSwitches;
}

async function getUser(front) {
    var systemSwitches = await getFrontList();
    var systemMember;
    var userID;

    if (front) {
        var userID = systemSwitches[0].members[0];
    } else {
        var userID = systemSwitches[1].members[0];
    }

    try {
        const response = await fetch(systemURL+"members/"+userID);
        if (!response.ok) {
            throw new Error(`Response: ${response.status}`);
        }
        systemMember = await response.json();
    } catch (error) {
        console.log(error.message);
    }

    return await systemMember;
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

(async () => {
    /* checking for page language */
    var jp = false;
    try {
        document.getElementById('jp-page').innerHTML = "";
        jp = true;
    } catch { }

    /* last.fm */
    var curSongInfo = await getLastSong();
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

    const frontList = await getFrontList();
    const p1 = await getUser(true); //true = fronter
    const p2 = await getUser(false);
    var members = [p1, p2]; //hardcoded 2 members bc im not gonna have more than lilac in me. if so shit

    if (members[0].name != "sydney") { //whenever lilac is fronting
        var lilac = p1;
        var sydney = p2;
        members = [sydney, lilac];
    }

    for (let i = 0; i < members.length; i++) {
        var personTime;
        var personName = members[i].name;

        if (frontList[0].members[0] == members[i].id) { //long way to check if current user is fronting or not
            personTime = dateParser(frontList[0].timestamp, true, null, jp);
            document.getElementById(`p${i+1}-wrapper`).classList = "person-shine";
            document.getElementById(`img-${i}`).classList = "cur-fronter";

            //update links at the bottom depending on whos fronting
            if (personName != "sydney") {
                document.getElementById('twitter').href = "https://twitter.com/yuiyamuu";
                document.getElementById('discord').href = "discord://-/users/245588170903781377";
            }
        } else {
            personTime = dateParser(frontList[0].timestamp, false, frontList[1].timestamp, jp);
        }
        document.getElementById("time-"+i).textContent = personTime;
    }
})();