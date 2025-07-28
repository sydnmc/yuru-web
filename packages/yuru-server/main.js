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
        console.log(error.message)
    }
});

app.get('/pkInfo', async(req, res) => { //probably should maintain this code a loooot better,,
    const systemURL = "https://api.pluralkit.me/v2";
    const systemId = "ytcvss"
    const sysMembers = ['ckccgs', 'tfprjx', 'yaangx', 'ayaxfc']; //sydney, lilac, hazel, may

    let frontersInfo = [
        { name: 'sydney', memberTime: 0},
        { name: 'lilac', memberTime: 0 },
        { name: 'hazel', memberTime: 0 },
        { name: 'may', memberTime: 0 }
    ];

    let daysAgoAmount = 2592000000;
    let now = new Date();
    let daysAgoDate = now.getTime() - daysAgoAmount;

    let apiResp;
    try {
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

        let prevTimestamp = new Date().getTime();
        for (let i = 0; i < trimmedResp.length; i++) {
            let curTimestamp = new Date(trimmedResp[i].timestamp).getTime();
            for (let j = 0; j < sysMembers.length; j++) {
                if (trimmedResp[i].members[0] === sysMembers[j]) {
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
        let totalTime = frontersInfo[0].memberTime+frontersInfo[1].memberTime+frontersInfo[2].memberTime+frontersInfo[3].memberTime;


        for (let i = 0; i < sysMembers.length; i++) {
            frontersInfo[i].memberPercent = Math.round((frontersInfo[i].memberTime/totalTime)*100);

            let foundMember = false;
            let memberInt = 0;
            while (memberInt < trimmedResp.length && !foundMember) {
                if (trimmedResp[memberInt].members[0] == sysMembers[i]) {
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
    } catch (err) {
        console.log(err.message);
    }
});
