/* you cant lie this coloured text is sick as hell -sydney*/
//it kinda is... -lilac

const fs = require('fs'); 
const express = require('express');
const cors = require('cors');
const options = JSON.parse(fs.readFileSync('servoptions.json', 'utf8'));

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const osuURL = "https://osu.ppy.sh/api/get_beatmaps";
const app = express();

app.listen(3333, () => {
    console.log(`\x1b[45myuru.ca server\x1b[0m - currently listening on port 3333~`);
    initialize();
})
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var mapStatusSydney = JSON.parse(fs.readFileSync('syd-mapstatus.json', 'utf8'));
var mapStatusLilac = JSON.parse(fs.readFileSync('lilac-mapstatus.json', 'utf8'));

function findWipCount(mapStatus) {
    let wipCount = 0;

    for (let i = 0; i < mapStatus.length; i++) {
        if (mapStatus[i].mapStatus == "wip") {
            wipCount++;
        }
    }

    return wipCount;
}

async function grabSongInfo(beatmap_id) {
    let apiResponse;
    let mapInfo = [{
        "title":"",
        "title_unicode":"",
        "artist":"",
        "artist_unicode":"",
        "diffname":"",
        "mapper":"",
        "sr":"",
        "status":""
    }];

    try {
        const response = await fetch(osuURL+`?k=${options.osuKey}&b=${beatmap_id}`); //looks up the beatmap (diff) using osu API
        if (!response.ok) {
            throw new Error(`Response from osu API: ${response.status}`);
        }
        apiResponse = await response.json();
    } catch (error) {
        console.log(error.message);
    }

    switch (apiResponse[0].approved) {
        case "-2":
            mapInfo[0].status = "deadge"; //graved
            break;
        case "-1":
            mapInfo[0].status = "set wip"; //wip set
            break;
        case "0":
            mapInfo[0].status = "pending"; //pending
            break;
        case "1":
            mapInfo[0].status = "ranked"; //ranked
            break;
        case "3":
            mapInfo[0].status = "qualified"; //qualified, case 2 should never be used as none of my maps can get approved now :p
            break;
        case "4":
            mapInfo[0].status = "loved"; //if this ever happens ill shit myself
            break;
    }

    mapInfo[0].title_unicode = apiResponse[0].title_unicode;
    mapInfo[0].artist_unicode = apiResponse[0].artist_unicode;
    mapInfo[0].title = apiResponse[0].title;
    mapInfo[0].artist = apiResponse[0].artist; 

    mapInfo[0].diffname = apiResponse[0].version;
    mapInfo[0].mapper = apiResponse[0].creator;
    mapInfo[0].sr = Math.round(apiResponse[0].difficultyrating*100) / 100;

    return await mapInfo;
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
            let curSongInfo = await grabSongInfo(beatmapID);

            //writing to local mapStatus json
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

async function initialize() {
    let sydney = true;

    rl.question(`\x1b[35m-- \x1b[0m\x1b[45myuru.ca server\x1b[0m \x1b[35mmap manager --\x1b[0m
        as currently set, this server will automatically update maps every \x1b[32m${options.autoupdateEvery} hours.\x1b[0m

        1 - \x1b[1m\x1b[35msydney\x1b[0m update all maps
        2 - \x1b[1m\x1b[35msydney\x1b[0m add new difficulty

        3 - \x1b[90mlilac\x1b[0m update all maps
        4 - \x1b[90mlilac\x1b[0m add new difficulty

        5 - shutdown
        `, function(input) { 
            switch (input) {
                case "1":
                    updateAllMaps(sydney, mapStatusSydney);
                    break;
                case "2":
                    addDiff(sydney, mapStatusSydney);
                    break;
                case "3":
                    mapStatus = mapStatusLilac;
                    sydney = false;
                    updateAllMaps(sydney, mapStatusLilac);
                    break;
                case "4":
                    sydney = false
                    addDiff(sydney, mapStatusLilac);
                    break;
                case "5":
                    rl.close();
                    break;
            }
    });

    setInterval(async () => {
        console.log(`Automatically updating all maps...`);
        await updateAllMaps(true, mapStatusSydney);
        await updateAllMaps(false, mapStatusLilac);
    }, options.autoupdateEvery*1000*60*60); //autoupdateEvery is in hours, so we're converting to ms for setInterval to be happy
}

function addAdditionalDiffs(diffname, link, sr, dateFinished, oldDiffs) {
    let diffStructure = {
        "diffname": [diffname],
        "sr": [sr],
        "mapLink": [link],
        "date": [dateFinished]
    }

    if (oldDiffs) {
        diffStructure = oldDiffs;
    }
    
    rl.question(`diffname: `, function(input) {
        diffStructure.diffname.push(input);
        rl.question(`star rating (can be an estimate if wip): `, function(input) {
            diffStructure.sr.push(input);
            rl.question(`map link? (if none, leave blank): `, function(input) {
                diffStructure.mapLink.push(input);
                rl.question(`date finished? (if none, leave blank): `, function(input) {
                    diffStructure.date.push(input);
                    rl.question(`any other maps to add? y/n: `, function(input) {
                        if (input == "y") {
                            addAdditionalDiffs(null, null, null, null, diffStructure);
                        } else {
                            callback();
                        }
                    });
                });
            });
        });
    });

    return 
}

function addDiff(sydney, curMapStatus) {
    let title;
    let diffname;
    let mapper;
    let link ;
    let status = "wip";
    let sr;
    let dateFinished;
    let bn1 = "";
    let bn2 = "";

    rl.question(`song name (artist - title): `, function(input) { 
        title = input;
        rl.question(`mapper: `, function(input) { 
            mapper = input;
            rl.question(`diffname: `, function(input) { 
                diffname = input;
                rl.question(`star rating (can be an estimate if wip): `, function(input) { 
                    sr = input;
                    rl.question(`map link? (if none, leave blank): `, function(input) { 
                        link = input;
                        rl.question(`current status? (if wip, leave blank): `, function(input) { 
                            status = input;
                            rl.question(`date finished? (if none, leave blank): `, function(input) { 
                                dateFinished = input;
                                rl.question(`any other maps to add? y/n: `, function(input) {
                                    if (input == "y") {
                                        let additionalInfo = addAdditionalDiffs(diffname, link, sr, dateFinished);
                                    }
                                    rl.question(`bn #1 (if none, leave blank): `, function(input) {
                                        bn1 = input;
                                        rl.question(`bn #2 (if none, leave blank): `, function(input) {
                                            bn2 = input;

                                            let newDiff = {
                                                "songName": title,
                                                "songURLs": [ link ],
                                                "mapper": mapper,
                                                "difficulties": [ diffname ],
                                                "starRatings": [ sr ],
                                                "datesFinished": [ dateFinished ],
                                                "bns": [ bn1, bn2 ],
                                                "mapStatus": status
                                            }

                                            if (status == "wip") {
                                                curMapStatus.push(newDiff);
                                            } else { //if it's not wip, we want it to appear at the bottom of the non-wip sets
                                                curMapStatus = curMapStatus.toSpliced(curMapStatus.length-findWipCount(curMapStatus), 0, newDiff);
                                            }

                                            let filename = 'syd-mapstatus.json'
                                            console.log(); //blank space (intetional, for style)

                                            if (!sydney) {
                                                filename = 'lilac-mapstatus.json'
                                            }
                                            fs.writeFileSync(filename, JSON.stringify(curMapStatus, null, 2));
                                            console.log(`Succesfully wrote to ${filename}!`);
                                            rl.question(`
1 - return to \x1b[35mhome\x1b[0m
2 - exit `,                                     function(input) {
                                                    if (input == "1") {
                                                        initialize();
                                                    } else {
                                                        rl.close();
                                                    }
                                                }
                                            );
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

app.get('/', (req, res) => {
    res.send(JSON.parse(`{"response":"meow~"}`));
});

app.get('/gds', (req, res) => {
    let serverResponse;

    let person = req.query.person;
    if (person == 'sydney') {
        serverResponse = mapStatusSydney;
    } else if (person == 'lilac') {
        serverResponse = mapStatusLilac;
    } else {
        serverResponse = 'Invalid person specified.';
    }
    
    res.send(serverResponse);
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
    let user = req.query.user;
    let frontList = req.query.frontList;
    let apiResp;

    try {
        if (frontList) {
            apiResp = await fetch(`${systemURL}/systems/${systemId}/switches?limit=2`);
            res.send(await apiResp.json());
        } else {
            apiResp = await fetch(`${systemURL}/members/${user}`);
            res.send(await apiResp.json());
        }
    } catch (err) {
        console.log(err.message)
    }
});