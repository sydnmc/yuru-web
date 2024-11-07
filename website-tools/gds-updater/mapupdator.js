const fs = require('fs'); //this will only work with node.js, never in browser. please use this tool to update maps on the backend.
var options = JSON.parse(fs.readFileSync('options.json', 'utf8'));

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const osuURL = "https://osu.ppy.sh/api/get_beatmaps"

var wipCount = 0; //first, checking the number of wip maps to be excluded

async function grabSongInfo(beatmap_id, unicode) {
    var apiResponse;
    var mapInfo = [{
        "title":"",
        "artist":"",
        "diffname":"",
        "mapper":"",
        "sr":"",
        "status":"",
        "touhou":"",
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
    //apiResponse = fs.readFileSync('bleh.json', 'utf8'); //just for offline testing
    //apiResponse = JSON.parse(apiResponse);

    //console.log(`Beatmap information returned from osu: ${apiResponse}`);

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

    if (unicode) {
        mapInfo[0].title = apiResponse[0].title_unicode;
        mapInfo[0].artist = apiResponse[0].artist_unicode;
    } else {
        mapInfo[0].title = apiResponse[0].title;
        mapInfo[0].artist = apiResponse[0].artist; 
    }

    console.log(apiResponse);

    mapInfo[0].diffname = apiResponse[0].version;
    mapInfo[0].mapper = apiResponse[0].creator;
    mapInfo[0].sr = Math.round(apiResponse[0].difficultyrating*100) / 100;
    
    if (apiResponse[0].tags.includes("touhou")) {
        mapInfo[0].touhou = true;
    } else {
        mapInfo[0].touhou = false;
    }

    return await mapInfo;
}

async function updateAllMaps(unicode, sydney) {
    for (let i = 0; i < mapStatus.length; i++) {
        if (mapStatus[i].mapStatus == "wip") {
            wipCount++;
        }
    }
    console.log(`\x1b[32mThere are currently \x1b[33m${wipCount}\x1b[0m\x1b[32m wip maps, excluding those from update.\x1b[0m`);

    if (options.onlyUpdateLast != -1) {
        for (let i = mapStatus.length-options.onlyUpdateLast-wipCount; i < mapStatus.length-wipCount; i++) { //only updating the last n number of rows, excluding wip maps
            if (mapStatus[i].songURLs[0] == "") { //if there is no song url
                console.log(`-- no song url associated with #${i+1}, skipping`);
                i++; //skip the current entry
            }
            console.log(`Updating map \x1b[36m${mapStatus[i].songName}\x1b[0m - ${i+1} of ${mapStatus.length-wipCount+1}`);
            var beatmapID = mapStatus[i].songURLs[0].substr(mapStatus[i].songURLs[0].indexOf("#osu/")+5); //only works in std
            var curSongInfo = await grabSongInfo(beatmapID, unicode);

            //writing to local mapStatus json
            mapStatus[i].songName = `${curSongInfo[0].artist} - ${curSongInfo[0].title}`;
            mapStatus[i].difficulties[0] = curSongInfo[0].diffname;
            mapStatus[i].mapper = curSongInfo[0].mapper;
            mapStatus[i].starRatings[0] = curSongInfo[0].sr;
            mapStatus[i].mapStatus = curSongInfo[0].status;
            mapStatus[i].touhou = curSongInfo[0].touhou;

            console.log(mapStatus[i]);
        }
        var filename = 'syd-updated.json'

        if (!sydney) {
            filename = 'lilac-updated.json'
            if (unicode) {
                filename = 'lilac-jp.json'
            }
        } else if (unicode) {
            filename = 'syd-updated-jp.json'
        }
        fs.writeFileSync(filename, JSON.stringify(mapStatus));
        console.log(`Succesfully wrote to ${filename}!`);
    }
}

async function initialize() {
    var unicode = false;
    var sydney = true;

    rl.question(`\x1b[35m-- yuru.ca map manager --\x1b[0m
        1 - \x1b[1m\x1b[35msydney\x1b[0m update all maps
        2 - \x1b[1m\x1b[35msydney\x1b[0m update all maps (unicode)
        3 - \x1b[1m\x1b[35msydney\x1b[0m add new difficulty

        4 - \x1b[90mlilac\x1b[0m update all maps
        5 - \x1b[90mlilac\x1b[0m update all maps (unicode)
        6 - \x1b[90mlilac\x1b[0m add new difficulty

        7 - exit
        `, function(input) { 
            switch (input) {
                case "1":
                    mapStatus = mapStatusSydney;
                    updateAllMaps(unicode, sydney);
                    break;
                case "2": 
                    mapStatus = mapStatusSydney;
                    unicode = true;
                    updateAllMaps(unicode, sydney);
                    break;
                case "3":
                    mapStatus = mapStatusSydney;
                    addDiff();
                    break;
                case "4":
                    mapStatus = mapStatusLilac;
                    sydney = false;
                    updateAllMaps(unicode, sydney);
                    break;
                case "5":
                    mapStatus = mapStatusLilac;
                    sydney = false;
                    unicode = true;
                    updateAllMaps(unicode, sydney);
                    break;
                case "6":
                    sydney = false
                    mapStatus = mapStatusLilac;
                    addDiff(sydney);
                    break;
                case "7":
                    rl.close();
                    break;
            }
        });
}

function addDiff(sydney) {
    var title;
    var diffname;
    var mapper;
    var link ;
    var status = "wip";
    var sr;
    var dateFinished;
    var touhou = false;
    var bn1 = "";
    var bn2 = "";

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
                                rl.question(`touhou (y/n): `, function(input) { 
                                    if (input == "y") {
                                        touhou = true;
                                    }
                                    rl.question(`bn #1 (if none, leave blank): `, function(input) {
                                        bn1 = input;
                                        rl.question(`bn #2 (if none, leave blank): `, function(input) {
                                            bn2 = input;

                                            var newDiff = {
                                                "bgLink": "",
                                                "songName": title,
                                                "songURLs": [ link ],
                                                "mapper": mapper,
                                                "difficulties": [ diffname ],
                                                "starRatings": [ sr ],
                                                "datesFinished": [ dateFinished ],
                                                "bns": [
                                                bn1,
                                                bn2
                                                ],
                                                "mapStatus": status,
                                                "touhou": touhou
                                            }
                                            mapStatus.push(newDiff);

                                            var filename = 'syd-updated.json'
                                            console.log();

                                            if (!sydney) {
                                                filename = 'lilac-updated.json'
                                            }
                                            fs.writeFileSync(filename, JSON.stringify(mapStatus));
                                            console.log(`Succesfully wrote to ${filename}!`);
                                            rl.question(`
1 - return to \x1b[35mhome\x1b[0m
2 - exit `, function(input) {
                                                    if (input == "1") {
                                                        initialize();
                                                    } else {
                                                        rl.close();
                                                    }
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
    });
}

var mapStatusSydney = JSON.parse(fs.readFileSync('syd-mapstatus.json', 'utf8'));
var mapStatusLilac = JSON.parse(fs.readFileSync('lilac-mapstatus.json', 'utf8'));
var mapStatus;

(async () => {
    await initialize();
})();