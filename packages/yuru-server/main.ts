import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket, { WebSocketServer } from 'ws';

import { grabSongInfo, updateAllMaps } from './mapupdate';

dotenv.config();

const app = express();

app.listen(3333, () => {
    console.log(`\x1b[45myuru.ca server\x1b[0m - currently listening on port 3333~`);
    initialize();
});
app.use(cors());
app.use(express.json());
app.use(express.static('page/assets/')); //serves the assets for the api page ^-^
app.use(express.urlencoded({ extended: true }));

const wsPort = 7676;
const yurubridge = new WebSocketServer({ host: '127.0.0.1', port: wsPort }); //binds the ws connection to localhost, since everything is run locally on yuyuko~

yurubridge.on('error: ', console.error);

yurubridge.on('connection', connection => { //this connection information is needed for communication~
  console.log(`looks like mrrpbot connected on port ${wsPort}, how lovely~`);

  connection.on('message', async(message) => {
    let mapInfo = JSON.parse(message);
    let data;
    switch (mapInfo.type) {
      case "diff":
        /* https://osu.ppy.sh/beatmapsets/beatmapsetId#mode/beatmapId */
        let beatmapId = mapInfo.link.split('/')[5]; //gives us the beatmap id if it exists
        if (!beatmapId) { //if we don't have a beatmapId, then we go to the set instead
          let beatmapsetId = mapInfo.link.split('/')[4].split('#')[0]; //we probably won't have a #mode after, but this just makes absolute certain :3
          data = await grabSongInfo(beatmapsetId, "beatmapset");
        } else {
          data = await grabSongInfo(beatmapId, "beatmap");
        }
        break;
      case "set":
        break;
      case "acceptMap":
        break;
      case "editDiff":
        break;
      case "editSet":
        break;
    }
    connection.send(JSON.stringify(data));
  });
});

var mapStatusSydney;
var mapStatusLilac;
function refreshMapStatuses() {
    mapStatusSydney = JSON.parse(fs.readFileSync('sydneygds.json', 'utf8'));
    mapStatusLilac = JSON.parse(fs.readFileSync('lilacgds.json', 'utf8'));
}

refreshMapStatuses(); //initializes map statuses, in this case~

let refreshInterval = process.env.UPDATE_EVERY? parseInt(process.env.UPDATE_EVERY) : 12;
async function initialize() {
    setInterval(async () => {
        console.log(`Automatically updating all maps...`);
        await updateAllMaps('sydney', mapStatusSydney);
        await updateAllMaps('lilac', mapStatusLilac);
    }, refreshInterval*1000*60*60); //autoupdateEvery is in hours, so we're converting to ms for setInterval to be happy
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get('/', (req, res) => { //serves the basic api webpage~
    res.sendFile(__dirname+'/page/index.html');
});

app.get('/gds', (req, res) => { //sends back the gd info we have stored
    let person = req.query.person;

    if (person === 'sydney' || person === 'syd') {
        res.send(fs.readFileSync('./sydneygds.json', 'utf-8'));
    } else if (person === 'lilac') {
        res.send(fs.readFileSync('./lilacgds.json', 'utf-8'));
    } else {
        res.send('no person specified >_<;;');
    }
});

app.get('/sets', (req, res) => { //sends back set info we have stored c:
    res.send(JSON.parse(fs.readFileSync('./sets.json', 'utf-8')));
});

app.get('/lastfm', async(req, res) => {
    try {
        let songInfo = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=yurukyan&api_key=${process.env.LAST_FM_KEY}&format=json&limit=1`);
        res.send(await songInfo.json());
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
});

function parseDate(timestamp: number) {
    let days = Math.floor(timestamp/(1000*60*60*24));
    let hours = Math.floor(timestamp/(1000*60*60)) - days*24;
    let minutes = Math.floor(timestamp/(1000*60)) - days*24*60 - hours*60;
    return {
        days,
        hours,
        minutes
    }
}

const sysMembers = new Map([
    ['ckccgs', 'sydney'],
    ['tfprjx', 'lilac'],
    ['yaangx', 'hazel'],
    ['ayaxfc', 'may']
]);
function constructAlterInfo(apiData: any, imaTs: number, limitTs: number, isHistory: boolean) {
    let alterInfo: alter[] = [];
    let checkTs = imaTs; //starting from the top, working our way down until we hit limitTs - checkTs will always be bigger than currentFrontTs
    let totalTotal = 0;

    for (let i = 0; i < apiData.length; i++) {
        let currentFrontTs = new Date(apiData[i].timestamp).getTime();
        let alterIndex = alterInfo.findIndex(e => e.id  === apiData[i].members[0]); //finding which alter this switch is related to
        let frontDuration = checkTs-currentFrontTs;

        if (alterIndex === -1) { //if the alter isn't tracked yet, then we add them here~
            let memberName = sysMembers.get(apiData[i].members[0]) ?? '(no fronter)';
            if (!isHistory) {
                alterInfo.push({
                    name: memberName,
                    id: apiData[i].members[0],
                    fronting: false,
                    totalFrontTime: frontDuration,
                    lastFrontTime: frontDuration,
                    lastFrontTimestamp: new Date(currentFrontTs),
                    percent: -1
                });
            } else { //reduced if we are sending back frontHistory
                alterInfo.push({
                    name: memberName,
                    id: apiData[i].members[0],
                    fronting: false,
                    totalFrontTime: frontDuration,
                    percent: -1,
                    frontHistory: [{timestamp: new Date(apiData[i].timestamp), length: frontDuration}]
                });
            }
            totalTotal = totalTotal + frontDuration;
        } else {
            if (i < apiData.length-1) {
                alterInfo[alterIndex].totalFrontTime = alterInfo[alterIndex].totalFrontTime + frontDuration;
                totalTotal = totalTotal + frontDuration;
            } else { //on the last one, we need to add in additional time~ but not the whole duration of the front c:
                alterInfo[alterIndex].totalFrontTime = alterInfo[alterIndex].totalFrontTime + (imaTs - limitTs - totalTotal); //extra time to limit
            }
            if (isHistory) {
                alterInfo[alterIndex].frontHistory.push({timestamp: new Date(apiData[i].timestamp), length: frontDuration});
            }
        }

        if (i === 0) {
            alterInfo[0].fronting = true; //if we're at the very start, we know the first person is fronting :p
        }
        checkTs = currentFrontTs;
    }

    for (let i = 0; i < alterInfo.length; i++) {
        alterInfo[i].percent = Math.round(alterInfo[i].totalFrontTime/(imaTs-limitTs)*100);
        if (!isHistory) { alterInfo[i].lastFrontTimes = parseDate(alterInfo[i].lastFrontTime); }
        alterInfo[i].totalFrontTimes = parseDate(alterInfo[i].totalFrontTime);
    }

    return alterInfo;
}

app.get('/recentFronts', async(req, res) => {
    const systemURL = "https://api.pluralkit.me/v2";
    const systemId = "ytcvss";

    let limitDays = req.query.days ?? 30;
    let imaTs = new Date().getTime(); //ts as in timestamp :p i'm sick of looking at the word timestamp bro..
    let limitTs = imaTs - limitDays*1000*60*60*24;

    try {
        let apiResp = await fetch(`${systemURL}/systems/${systemId}/switches`); //unfortunately can't access after= with api, have to get all 100 switches from the past however long ago
        let parsedResp = await apiResp.json();

        //cutting off the array to just how long ago we want c:
        let foundDate = false;
        let j = 0;
        while (!foundDate || j < parsedResp.length) {
            if (new Date(parsedResp[j].timestamp).getTime() < limitTs) {
                foundDate = true;
                parsedResp.splice(j+1, parsedResp.length-j+1);
            }
            j++;
        }

        let alterInfo = constructAlterInfo(parsedResp, imaTs, limitTs, false);

        res.send(alterInfo);
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
});

app.get('/frontData', async(req, res) => {
    let frontData = JSON.parse(fs.readFileSync('switches.json', 'utf-8'));
    let startPeriod = new Date().getTime();
    let endPeriod = new Date(frontData[frontData.length-1].timestamp).getTime();
    let alterInfo = constructAlterInfo(frontData, startPeriod, endPeriod, true);
    
    alterInfo = {
        startPeriod,
        endPeriod,
        ...alterInfo
    }
    
    res.send(alterInfo);
});