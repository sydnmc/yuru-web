import fs from 'node:fs';
import { colourizeHex } from 'osu-colourizer';
import dotenv from 'dotenv';

dotenv.config();

const osuURL = "https://osu.ppy.sh/api/get_beatmaps";

function findWipCount(mapStatus: gd[]) {
  let wipCount = 0;
  for (let i = 0; i < mapStatus.length; i++) {
    if (mapStatus[i].status === "wip") {
      wipCount++;
    }
  }
  return wipCount;
}

function findStatus(statusNum: string) {
  let status;
  switch (statusNum) {
    case "-2":
      status = "graved";
      break;
    case "-1":
      status = "set wip";
      break;
    case "0":
      status = "pending";
      break;
    case "1":
      status = "ranked";
      break;
    case "3": //case 2 should never be used as none of my maps can get approved now :p
      status = "qualified";
      break;
    case "4":
      status = "loved"; //if this ever happens ill shit myself
      break;
  }

  return status;
}

export async function grabSongInfo(id: number, type: string) {
  let apiResponse;
  let mapInfo: any = {};
  let apiUrl;
  if (type === "beatmapset") {
    apiUrl = osuURL+`?k=${process.env.OSU_KEY}&s=${id}`
  } else if (type === "beatmap" || type === "updateBeatmap") {
    apiUrl = osuURL+`?k=${process.env.OSU_KEY}&b=${id}`;
  }

  let response = await fetch(apiUrl); //looks up the beatmap (diff) using osu apiv1 (not oauth, but lets us do things without having to deal with any logging in~)
  if (!response.ok) {
    throw new Error(`Response from osu API: ${response.status}`);
  }
  apiResponse = await response.json();

  if (type === "updateBeatmap") {
    return apiResponse;
  }

  //mrrpbot stuff
  mapInfo.status = findStatus(apiResponse[0].approved)
  mapInfo.title_unicode = apiResponse[0].title_unicode;
  mapInfo.artist_unicode = apiResponse[0].artist_unicode;
  mapInfo.title = apiResponse[0].title;
  mapInfo.artist = apiResponse[0].artist;
  mapInfo.bgLink = `https://assets.ppy.sh/beatmaps/${apiResponse[0].beatmapset_id}/covers/raw.jpg`;
  mapInfo.mapper = apiResponse[0].creator;

  if (type === "beatmap") {
    mapInfo.diffname = apiResponse[0].version;
    mapInfo.sr = Math.round(apiResponse[0].difficultyrating * 100) / 100;
    mapInfo.colour = colourizeHex(mapInfo.sr);
  }

  return mapInfo;
}

export async function updateAllMaps(person: string, mapStatus: gd[]) {
    let wipCount = findWipCount(mapStatus);
    console.log(`\x1b[32mexcluding \x1b[33m${wipCount}\x1b[0m\x1b[32m wip maps from update >w<\x1b[0m`);

    let updateLast = process.env.UPDATE_LAST? parseInt(process.env.UPDATE_LAST) : 10;
    for (let i = mapStatus.length - updateLast - wipCount; i < mapStatus.length - wipCount; i++) { //only updating the last n number of rows, excluding wip maps
        if (!mapStatus[i].mapId) { //if there is no map id (we can't find the url~)
            continue;
        }

        for (let j = 0; j < mapStatus[i].maps.length; j++) {
            console.log(`updating \x1b[36m${mapStatus[i].artist} - ${mapStatus[i].title} | [${mapStatus[i].maps[j].diffname}]\x1b[0m`);
            let curSongInfo = await grabSongInfo(parseInt(mapStatus[i].maps[j].id), 'updateBeatmap');

            if (j === 0) { //just doing it on the first pass so we don't waste resources reassigning it each time~
                Object.assign(mapStatus[i], {
                    title: curSongInfo[0].title,
                    titleUnicode: curSongInfo[0].title_unicode,
                    artist: curSongInfo[0].artist,
                    artistUnicode: curSongInfo[0].artist_unicode,
                    status: findStatus(curSongInfo[0].approved),
                    creator: curSongInfo[0].creator,
                });
            }

            Object.assign(mapStatus[i].maps[j], {
                sr: Math.round(curSongInfo[0].difficultyrating * 100) / 100
            });
        }
    }

    let filename = `${person}gds.json`;
    fs.writeFileSync(filename, JSON.stringify(mapStatus, null, 2));
    console.log(`succesfully wrote to ${filename}~! :D`);
}
