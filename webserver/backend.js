const fs = require('fs');
const express = require('express');
const cors = require('cors');
const options = JSON.parse(fs.readFileSync('servoptions.json', 'utf8'));
const { grabSongInfo, updateAllMaps } = require('./mapupdate.js');

const app = express();

app.listen(3333, () => {
    console.log(`\x1b[45myuru.ca server\x1b[0m - currently listening on port 3333~`);
    initialize();
})
app.use(cors());
app.use(express.json());
app.use(express.static('common')); //serves (cunt) all files from the common folder
app.use(express.urlencoded({ extended: true }));

const WebSocket = require('ws'); //used to do yuri with mrrpbot >.<
const wsPort = 7676;
const yurubridge = new WebSocket.Server({ host: '127.0.0.1', port: wsPort }); //binds the ws connection to localhost, since everything is run locally on yuyuko~

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
    mapStatusSydney = JSON.parse(fs.readFileSync('syd-mapstatus.json', 'utf8'));
    mapStatusLilac = JSON.parse(fs.readFileSync('lilac-mapstatus.json', 'utf8'));
}

refreshMapStatuses(); //initializes map statuses, in this case~

async function initialize() {
    setInterval(async () => {
        console.log(`Automatically updating all maps...`);
        await updateAllMaps(true, mapStatusSydney);
        await updateAllMaps(false, mapStatusLilac);
    }, options.autoupdateEvery*1000*60*60); //autoupdateEvery is in hours, so we're converting to ms for setInterval to be happy
}

app.get('/', (req, res) => {
  res.redirect('https://yuru.ca/');
});

app.get('/gds', (req, res) => {
    let serverResponse;

    let person = req.query.person;
    if (person === 'sydney') {
        serverResponse = mapStatusSydney;
    } else if (person === 'lilac') {
        serverResponse = mapStatusLilac;
    } else {
        serverResponse = 'Invalid person specified.';
    }

    res.send(serverResponse);
});

app.get('/sets', (req, res) => {
    let setInfo = JSON.parse(fs.readFileSync('setinfo.json', 'utf8'));
    res.send(setInfo);
});

app.get('/songInfo', async(req, res) => {
    const lastFmURL = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${options.lastFmUsername}&api_key=${options.lastFmKey}&format=json&limit=1`;
    let songInfo;

    try {
        songInfo = await fetch(lastFmURL);
        res.send(await songInfo.json());
    } catch (err) {
        console.log(err.message);
    }
});

app.get('/pkInfo', async(req, res) => {
    const systemURL = "https://api.pluralkit.me/v2";
    const systemId = "ytcvss"
    const sysMembers = ['ckccgs', 'tfprjx', 'yaangx']; //sydney, lilac, hazel
    let user = req.query.user;
    let frontList = req.query.frontList;
    let before = parseInt(req.query.before);
    let apiResp;

    let daysAgoAmount = 1000*60*60*24*before; //x num of days in ms
    let now = new Date();
    let daysAgoDate = now.getTime() - daysAgoAmount;

    try {
        if (frontList) {
            apiResp = await fetch(`${systemURL}/systems/${systemId}/switches`); //unfortunately can't access after= with api, have to get all 100 switches from the past however long ago
            let parsedResp = await apiResp.json();

            let dateCounter = 0;
            let foundBreakDate = false;
            let trimmedResp = [];
            while (dateCounter < parsedResp.length && !foundBreakDate) { //this finds the number of switches in the defined timeframe~ doesn't currently support more than 100 >w<
                let switchDate = new Date(parsedResp[dateCounter].timestamp);
                if (switchDate > new Date(daysAgoDate)) {
                    trimmedResp.push(parsedResp[dateCounter]);
                } else {
                    foundBreakDate = true;
                }
                dateCounter++;
            }

            let frontersInfo = [
                { name: 'sydney', memberTime: 0},
                { name: 'lilac', memberTime: 0 },
                { name: 'hazel', memberTime: 0 }
            ]

            let prevTimestamp = new Date().getTime();
            for (let i = 0; i < trimmedResp.length; i++) {
                let curTimestamp = new Date(trimmedResp[i].timestamp).getTime();
                for (let j = 0; j < sysMembers.length; j++) {
                    if (trimmedResp[i].members[0] == sysMembers[j]) {
                        frontersInfo[j].memberTime = frontersInfo[j].memberTime+(prevTimestamp - curTimestamp);
                    }
                }
                prevTimestamp = curTimestamp;
            }

            //if we're at the end, we want to get it exactly to however many days - whoever was last fronting gets that extra time added
            let extraTime = daysAgoAmount-(frontersInfo[0].memberTime+frontersInfo[1].memberTime+frontersInfo[2].memberTime);
            for (let i = 0; i < sysMembers.length; i++) {
                if (trimmedResp[trimmedResp.length-1].members[0] === sysMembers[0]) {
                    frontersInfo[i].memberTime = frontersInfo[i].memberTime+extraTime;
                }
            }
            let totalTime = frontersInfo[0].memberTime+frontersInfo[1].memberTime+frontersInfo[2].memberTime;

            for (let i = 0; i < sysMembers.length; i++) {
                frontersInfo[i].memberPercent = Math.round((frontersInfo[i].memberTime/totalTime)*100);

                let foundMember = false;
                let memberInt = 0;
                while (memberInt < trimmedResp.length && !foundMember) {
                    if (trimmedResp[memberInt].members[0] === sysMembers[i]) {
                        let nextTimestamp;
                        try {
                            nextTimestamp = Date.parse(trimmedResp[memberInt-1].timestamp);
                            frontersInfo[i].isFronting = false;
                        } catch {
                            nextTimestamp = Date.now(); //if there's not a next timestamp, the member must be currently fronting
                            frontersInfo[i].isFronting = true;
                        }
                        frontersInfo[i].lastFrontTimestamp = trimmedResp[memberInt].timestamp;
                        frontersInfo[i].lastFrontAmount = nextTimestamp-Date.parse(trimmedResp[memberInt].timestamp);
                        foundMember = true;
                    }
                    memberInt++;
                }
            }

            res.send(frontersInfo);
        } else {
            apiResp = await fetch(`${systemURL}/members/${user}`);
            res.send(await apiResp.json());
        }
    } catch (err) {
        console.log(err.message);
    }
});
