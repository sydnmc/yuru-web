import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

app.get('/songInfo', async(req, res) => {
    try {
        let songInfo = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=yurukyan&api_key=${process.env.LAST_FM_KEY}&format=json&limit=1`);
        res.send(await songInfo.json());
    } catch (err) {
        console.log(error.message);
        res.send(err.message);
    }
});

app.get('/pkInfo', async(req, res) => {
    const systemURL = "https://api.pluralkit.me/v2";
    const systemId = "ytcvss";
    const sysMembers = {
        'ckccgs': 'sydney',
        'tfprjx': 'lilac',
        'yaangx': 'hazel',
        'ayaxfc': 'may'
    }

    let daysAgoAmount = 2592000000;
    let now = new Date();
    let daysAgoDate = new Date(now.getTime() - daysAgoAmount);

    let apiResp;
    try {
        apiResp = await fetch(`${systemURL}/systems/${systemId}/switches`); //unfortunately can't access after= with api, have to get all 100 switches from the past however long ago
        let parsedResp = await apiResp.json();

        let dateCounter = 0;
        let foundBreakDate = false;
        let trimmedResp = [];
        while (dateCounter < parsedResp.length && !foundBreakDate) { //this finds the number of switches in the defined timeframe~ doesn't currently support more than 100 >w<
            let switchDate = new Date(parsedResp[dateCounter].timestamp);
            if (switchDate > daysAgoDate) {
                trimmedResp.push(parsedResp[dateCounter]);
            } else {
                foundBreakDate = true;
            }
            dateCounter++;
        }

        let alterInfo = [];
        let prevTimestamp = daysAgoDate.getTime(); //sets it to 30 days ago

        for (let i = trimmedResp.length-1; i > 0; i--) { //going up from 30 days ago
            let curTimestamp = new Date(trimmedResp[i].timestamp).getTime();
            let nextTimestamp = new Date(trimmedResp[i-1].timestamp).getTime();
            let alterIndex = alterInfo.findIndex(e => e.alterId  === trimmedResp[i].members[0]);

            if (alterIndex === -1) { //if the current alter isn't in the list~
                alterInfo.push({
                    alterId: trimmedResp[i].members[0], 
                    time: curTimestamp - prevTimestamp,
                    fronting: false, //will verify later
                    lastFrontTimestamp: trimmedResp[i].timestamp,
                });
            } else {
                let frontLen = nextTimestamp - curTimestamp;
                alterInfo[alterIndex].time = alterInfo[alterIndex].time + frontLen;
                alterInfo[alterIndex].lastFrontTimestamp = trimmedResp[i].timestamp;
                alterInfo[alterIndex].lastFrontAmount = frontLen
            }
            prevTimestamp = curTimestamp;
        }
        
        for (let i = 0; i < alterInfo.length; i++) { //for convenience, we calculate the usable time here too~ remove in prod
            let frontTime = alterInfo[i].time
            alterInfo[i].frontDays = Math.round(frontTime/(1000*60*60*24));
            alterInfo[i].frontHours = Math.round(frontTime/(1000*60*60)) - alterInfo[i].frontDays*24;
        }

        //if we're at the end, we want to get it exactly to however many days - whoever was last fronting gets that extra time added
        let totalTime = 0;
        alterInfo.forEach(alter => {
            totalTime = totalTime+alter.time;
        });

        //finding who's currently fronting + adding in their extra time~
        //this is also where we add in names c:
        let frontingAlterIndex;
        let timeToCurrent = daysAgoAmount;
        for (let i = 0; i < alterInfo.length; i++) {
            let timeToCurrentFromAlter = now - new Date(alterInfo[i].lastFrontTimestamp).getTime();
            if (timeToCurrent > timeToCurrentFromAlter) {
                timeToCurrent = timeToCurrentFromAlter;
                frontingAlterIndex = i;
            }
        }

        alterInfo = alterInfo.map(alter => ({ //adding in names
            name: sysMembers[alter.alterId]? sysMembers[alter.alterId] : '(no fronter)',
            ...alter
        }));

        let extraTime = daysAgoAmount-totalTime;
        alterInfo[frontingAlterIndex].fronting = true;
        alterInfo[frontingAlterIndex].time = alterInfo[frontingAlterIndex].time+extraTime; //now that time is locked in, we can finally calculate frontpercent

        let total = 0;
        for (let i = 0; i < alterInfo.length; i++) {
            alterInfo[i].frontpercent = Math.round((alterInfo[i].time/daysAgoAmount)*100);
            total = total+alterInfo[i].time;
        }
        console.log(total);

        res.send(alterInfo);
    } catch (err) {
        console.log(err.message);
        res.send(err.message);
    }
});
