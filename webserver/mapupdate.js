const fs = require('fs');
const osuColourizer = require('osu-colourizer');

const osuURL = "https://osu.ppy.sh/api/get_beatmaps";
const options = JSON.parse(fs.readFileSync('servoptions.json', 'utf8'));

function findWipCount(mapStatus) {
  let wipCount = 0;
  for (let i = 0; i < mapStatus.length; i++) {
    if (mapStatus[i].mapStatus == "wip") {
      wipCount++;
    }
  }

  return wipCount;
}

async function grabSongInfo(id, type) {
  let apiResponse;
  let mapInfo = {};
  let apiUrl;
  if (type === "beatmapset") {
    apiUrl = osuURL+`?k=${options.osuKey}&s=${id}`
  } else if (type === "beatmap") {
    apiUrl = osuURL+`?k=${options.osuKey}&b=${id}`;
  }

  let response = await fetch(apiUrl); //looks up the beatmap (diff) using osu apiv1 (not oauth, but lets us do things without having to deal with any logging in~)
  if (!response.ok) {
    throw new Error(`Response from osu API: ${response.status}`);
  }
  apiResponse = await response.json();

  switch (apiResponse[0].approved) {
    case "-2":
      mapInfo.status = "graved";
      break;
    case "-1":
      mapInfo.status = "set wip";
      break;
    case "0":
      mapInfo.status = "pending";
      break;
    case "1":
      mapInfo.status = "ranked";
      break;
    case "3": //case 2 should never be used as none of my maps can get approved now :p
      mapInfo.status = "qualified";
      break;
    case "4":
      mapInfo.status = "loved"; //if this ever happens ill shit myself
      break;
  }

  mapInfo.title_unicode = apiResponse[0].title_unicode;
  mapInfo.artist_unicode = apiResponse[0].artist_unicode;
  mapInfo.title = apiResponse[0].title;
  mapInfo.artist = apiResponse[0].artist;
  mapInfo.bgLink = `https://assets.ppy.sh/beatmaps/${apiResponse[0].beatmapset_id}/covers/raw.jpg`;
  mapInfo.mapper = apiResponse[0].creator;

  if (type === "beatmap") {
    mapInfo.diffname = apiResponse[0].version;
    mapInfo.sr = Math.round(apiResponse[0].difficultyrating * 100) / 100;
    mapInfo.colour = osuColourizer.colourizeHex(mapInfo.sr);
  }

  return mapInfo;
}

async function updateAllMaps(sydney, mapStatus) {
    let wipCount = findWipCount(mapStatus);
    console.log(`\x1b[32mThere are currently \x1b[33m${wipCount}\x1b[0m\x1b[32m wip maps, excluding those from update.\x1b[0m`);

    if (options.onlyUpdateLast != -1) {
        for (let i = mapStatus.length-options.onlyUpdateLast-wipCount; i < mapStatus.length-wipCount; i++) { //only updating the last n number of rows, excluding wip maps
            if (mapStatus[i].songURLs[0] == "") { //if there is no song url
                console.log(`-- no song url associated with #${i+1}, skipping`);
                i++; //skip the current entry
            }
            console.log(`Updating map \x1b[36m${mapStatus[i].songName}\x1b[0m - ${i+1} of ${mapStatus.length-wipCount+1}`);
            let beatmapID = mapStatus[i].songURLs[0].substr(mapStatus[i].songURLs[0].indexOf("#osu/")+5); //only works in std
            let beatmapsetId = mapStatus[i].songURLs[0].substring(mapStatus[i].songURLs[0].indexOf('beatmapsets/')+12, mapStatus[i].songURLs[0].indexOf("#osu/")); //terrible abomination
            let curSongInfo = await grabSongInfo(beatmapID);

            //writing to local mapStatus.json
            mapStatus[i].bgLink = `https://assets.ppy.sh/beatmaps/${beatmapsetId}/covers/raw.jpg`;
            mapStatus[i].songName = `${curSongInfo[0].artist} - ${curSongInfo[0].title}`;
            mapStatus[i].songNameUnicode = `${curSongInfo[0].artist_unicode} - ${curSongInfo[0].title_unicode}`;
            mapStatus[i].difficulties[0] = curSongInfo[0].diffname;
            mapStatus[i].mapper = curSongInfo[0].mapper;
            mapStatus[i].starRatings[0] = curSongInfo[0].sr;
            mapStatus[i].mapStatus = curSongInfo[0].status;
        }

        if (sydney) {
            filename = 'syd-mapstatus.json'
            mapStatusSydney = mapStatus;
        } else {
            filename = 'lilac-mapstatus.json';
            mapStatusLilac = mapStatus;
        }
        fs.writeFileSync(filename, JSON.stringify(mapStatus, null, 2));
        console.log(`Succesfully wrote to ${filename}!`);
    }
}

module.exports = { grabSongInfo, updateAllMaps };
