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

/* checking for page language */
var jp = false;
if (document.documentElement.lang == 'jp') {
    jp = true;
}

function dateParser(frontLength, isFronting, jp, lastFrontTime) {
    let timeDisplay;
    let frontAgoTime = (Date.now() - Date.parse(lastFrontTime))/1000/60/60/24;
    if (frontAgoTime > 2) {
      let parsedTime = new Date(lastFrontTime);
      if (isFronting) {
        let days = parseInt((frontLength/1000)/60/60/24);
        let hours = parseInt((frontLength/1000)/60/60) - days*24;
        if (jp) {
            timeDisplay = `${days}日間${hours}時間`;
        } else {
            timeDisplay = `for ${days} day(s), ${hours} hours`;
        }
      } else {
        if (jp) {
            timeDisplay = `最新の目覚めは${parsedTime.getUTCFullYear()}年${parsedTime.getUTCMonth()+1}月${parsedTime.getUTCDate()}日でした`;
        } else {
            timeDisplay = `last fronted on ${parsedTime.getUTCMonth()+1}/${parsedTime.getUTCDate()}/${parsedTime.getUTCFullYear()}`;
        }
      }
    } else {
        let hours = parseInt((frontLength/1000)/60/60);
        let minutes = parseInt((frontLength/1000)/60) - hours*60;
        if (isFronting) {
            if (jp) {
                timeDisplay = `${hours}時間${minutes}分`;
            } else {
                timeDisplay = `for ${hours} hours, ${minutes} minutes`;
            }
        } else  {
            if (jp) {
                timeDisplay = `意識時間は${hours}時間${minutes}分でした`;
            } else {
                timeDisplay = `last fronted for ${hours} hours, ${minutes} minutes`;
            }
        }
    }
    return timeDisplay;
}

async function lastFmUpdate() {
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
}   

var lilacDropdownOpen = false;
var lilacDropdown = document.getElementById('lilac-dropdown');
lilacDropdown.addEventListener("click", e => {
    e.stopPropagation(); //stops the link from working on the p2-wrapper :3
    let dropdown = document.getElementById('hazel-info');
    if (!lilacDropdownOpen) {
        dropdown.style.visibility = 'visible';
        lilacDropdownOpen = true;
    } else {
        dropdown.style.visibility = 'hidden';
        lilacDropdownOpen = false;
    }
});

var sydneyDropdownOpen = false;
var sydneyDropdown = document.getElementById('sydney-dropdown');
sydneyDropdown.addEventListener("click", e => {
    e.stopPropagation();
    let dropdown = document.getElementById('may-info');
    if (!sydneyDropdownOpen) {
        dropdown.style.visibility = 'visible';
        sydneyDropdownOpen = true;
    } else {
        dropdown.style.visibility = 'hidden';
        sydneyDropdownOpen = false;
    }
});

//handling the links in js because of the dropdown arrow, this is the best solution for it unfortunately >_<;;
document.getElementById('p1-wrapper').addEventListener("click", () => {
    location.href = 'https://syd.yuru.ca';
});
document.getElementById('p2-wrapper').addEventListener("click", () => {
    location.href = 'https://lilac.yuru.ca';
});

(async () => {
    lastFmUpdate(); //runs async since it doesn't depend on anything else first

    /* pluralkit */
    var frontList = await fetchFromApi(`pkInfo?frontList=true&before=30`);
    //hardcoded 2 members bc im not gonna have more than lilac in me. if so shit
    //i'm keeping this comment because it's really funny in hindsight ^
    //there shouldn't be more than 3 of us, so i'm still not making it automatically update (front display needs different colours too!!)
    //but, just in case, it should be easier now.

    //may here - thank you so much lilac <3 it is really much easier now~

    document.getElementById('sydney-percent').style = `width: ${frontList[0].memberPercent}%`;
    document.getElementById('lilac-percent').style = `width: ${frontList[1].memberPercent}%`;
    document.getElementById('hazel-percent').style = `width: ${frontList[2].memberPercent}%`;
    document.getElementById('may-percent').style = `width: ${frontList[3].memberPercent}%`;

    var curFronter;
    frontList.forEach(sysmember => {
        if (sysmember.isFronting) {
            curFronter = sysmember.name;
        }
    });

    for (let i = 0; i < frontList.length; i++) {
        let sysmember = frontList[i];
        if (sysmember.isFronting) {
            curFronter = sysmember.name;
        }

        let date = dateParser(sysmember.lastFrontAmount, sysmember.isFronting, jp, sysmember.lastFrontTimestamp);
        document.getElementById(`time-${i}`).textContent = date;
        frontList[i].siteText = date;

        let days = Math.floor(sysmember.memberTime/1000/60/60/24);
        let hours = Math.round((sysmember.memberTime/1000/60/60)-days*24);
        document.getElementById(`${sysmember.name}-tooltip`).innerHTML = `${sysmember.name}<br>${days} days, ${hours} hours | ${sysmember.memberPercent}%`;
    }

    var altWidth = 'calc((50% - 3%) - 3px)';
    if (window.innerWidth > 1000) { //same for in the css
        altWidth = '100%';
    }

    switch(curFronter) {
        case "sydney":
            document.getElementById(`p1-wrapper`).classList = "person-shine hidden-link";
            document.getElementById(`img-0`).classList = "cur-fronter";
            document.getElementById(`hazel-info`).style.width = altWidth;
            break; //js doesn't seem to support fallthrough like this? and it's kinda dangerous, but yeah c:
        case "may":
            document.getElementById(`p1-wrapper`).classList = "person-shine hidden-link";
            document.getElementById(`img-0`).classList = "cur-fronter";
            document.getElementById(`hazel-info`).style.width = altWidth;
            let mayImg = document.getElementById(`img-0`);
            let sydneyImg = document.getElementById(`img-3`);

            /* swapping sydney/may */
            mayImg.src = `https://api.yuru.ca/images/maypfp.jpg`;
            sydneyImg.src = `https://api.yuru.ca/images/sydneypfp.png`;

            if (!jp) {
                document.getElementById(`name-0`).textContent = "may";
                document.getElementById(`name-3`).textContent = "sydney";
                mayImg.alt = `may's profile pic`;
                sydneyImg.alt = `sydney's profile pic`;
            } else {
                document.getElementById(`name-0`).textContent = "メイ";
                document.getElementById(`name-3`).textContent = "シド二ー";
                mayImg.alt = `メイのプロフィール画像`;
                sydneyImg.alt = `シド二ーのプロフィール画像`;
            }

            document.getElementById(`time-0`).textContent = frontList[3].siteText;
            document.getElementById(`time-3`).textContent = frontList[0].siteText;
            break;
        case "lilac":
            document.getElementById(`p2-wrapper`).classList = "person-shine hidden-link";
            document.getElementById(`img-1`).classList = "cur-fronter";

            document.getElementById('twitter').href = "https://twitter.com/yuiyamuu";
            document.getElementById('discord').href = "discord://-/users/245588170903781377";

            document.getElementById(`may-info`).style.width = altWidth;
            break;
        case "hazel":
            document.getElementById(`p2-wrapper`).classList = "person-shine hidden-link";
            document.getElementById(`img-1`).classList = "cur-fronter";

            document.getElementById('twitter').href = "https://twitter.com/yuiyamuu";
            document.getElementById('discord').href = "discord://-/users/245588170903781377";
            document.getElementById(`may-info`).style.width = altWidth;
            let lilacImg = document.getElementById(`img-1`);
            let hazelImg = document.getElementById(`img-2`);

            /* swapping lilac/hazel */
            hazelImg.src = `https://api.yuru.ca/images/lilacpfp.png`;
            lilacImg.src = `https://api.yuru.ca/images/hazelpfp.jpg`;

            if (!jp) {
                document.getElementById(`name-1`).textContent = "hazel";
                document.getElementById(`name-2`).textContent = "lilac";
                lilacImg.alt = `may's profile pic`;
                hazelImg.alt = `sydney's profile pic`;
            } else {
                document.getElementById(`name-1`).textContent = "ヘイズル";
                document.getElementById(`name-2`).textContent = "らいらっく";
                lilacImg.alt = `らいらっくのプロフィール画像`;
                hazelImg.alt = `ヘイズルのプロフィール画像`;
            }

            document.getElementById(`time-1`).textContent = frontList[2].siteText;
            document.getElementById(`time-2`).textContent = frontList[1].siteText;
            break;
    }
})();
