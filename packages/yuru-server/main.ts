import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'node:path';
import { totalmem } from 'node:os';

dotenv.config();

const osuApi = "https://osu.ppy.sh/api/get_beatmaps";
//will add back autoupdating later ^^
const app = express();

app.listen(3333, () => {
    console.log(`\x1b[45myuru.ca server\x1b[0m - currently listening on port 3333~`);
})
app.use(cors());
app.use(express.json());
app.use(express.static('page/assets/')); //serves the assets for the api page ^-^
app.use(express.urlencoded({ extended: true }));

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

app.get('/fronter', async(req, res) => {
    const systemURL = "https://api.pluralkit.me/v2";
    const systemId = "ytcvss";
    const sysMembers = new Map([
        ['ckccgs', 'sydney'],
        ['tfprjx', 'lilac'],
        ['yaangx', 'hazel'],
        ['ayaxfc', 'may']
    ]);

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

        let alterInfo: alter[] = [];
        let checkTs = imaTs; //starting from the top, working our way down until we hit limitTs - checkTs will always be bigger than currentFrontTs
        let totalTotal = 0;

        for (let i = 0; i < parsedResp.length; i++) {
            let currentFrontTs = new Date(parsedResp[i].timestamp).getTime();
            let alterIndex = alterInfo.findIndex(e => e.id  === parsedResp[i].members[0]); //finding which alter this switch is related to
            let frontDuration = checkTs-currentFrontTs;

            if (alterIndex === -1) { //if the alter isn't tracked yet, then we add them here~
                alterInfo.push({
                    name: sysMembers.get(parsedResp[i].members[0]) ?? '(no fronter)',
                    id: parsedResp[i].members[0],
                    fronting: false,
                    totalFrontTime: frontDuration,
                    lastFrontTime: frontDuration,
                    lastFrontTimestamp: new Date(currentFrontTs),
                    percent: -1
                });
                totalTotal = totalTotal + frontDuration;
            } else {
                if (i < parsedResp.length-1) {
                    alterInfo[alterIndex].totalFrontTime = alterInfo[alterIndex].totalFrontTime + frontDuration;
                    totalTotal = totalTotal + frontDuration;
                } else { //on the last one, we need to add in additional time~ but not the whole duration of the front c:
                    alterInfo[alterIndex].totalFrontTime = alterInfo[alterIndex].totalFrontTime + (imaTs - limitTs - totalTotal); //extra time to limit
                }
                alterInfo[alterIndex].lastFrontTime = frontDuration;
                alterInfo[alterIndex].lastFrontTimestamp = new Date(currentFrontTs);
            }

            if (i === 0) {
                alterInfo[0].fronting = true; //if we're at the very start, we know the first person is fronting :p
            }

            checkTs = currentFrontTs;
        }

        let total = 0;
        for (let i = 0; i < alterInfo.length; i++) {
            total = total+alterInfo[i].totalFrontTime;
            alterInfo[i].percent = Math.round(alterInfo[i].totalFrontTime/(imaTs-limitTs)*100);
            alterInfo[i].lastFrontTimes = parseDate(alterInfo[i].lastFrontTime);
            alterInfo[i].totalFrontTimes = parseDate(alterInfo[i].totalFrontTime);
        }

        res.send(alterInfo);
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
});