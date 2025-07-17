import fs from 'node:fs';

let setsList = JSON.parse(fs.readFileSync('sets.json', 'utf-8'));

    let hoverInfo = {
        'tilda': {userID: 6233296, flag: '1f1fa-1f1f8.svg', country: 'US'},
        '_Karaage': {userID: 11864461, flag: '1f1f5-1f1ed.svg', country: 'PH'},
        'Bloxi': {userID: 9022451, flag: '1f1fa-1f1f8.svg', country: 'US'},
        'muya-': {userID: 12883611, flag: '1f1ee-1f1f1.svg', country: 'IL'},
        'NorXor': {userID: 14936736, flag: '1f1e8-1f1e6.svg', country: 'CA'},
        'I_Love_Egg': {userID: 10743013, flag: '1f1fa-1f1f8.svg', country: 'US'},
        'Mendozer': {userID: 13531286, flag: '1f1ec-1f1e7.svg', country: 'GB'},
        'itay': {userID: 10701418, flag: '1f1ee-1f1f1.svg', country: 'IL'},
        'radar': {userID: 7131099, flag: '1f1fa-1f1f8.svg', country: 'US'},
        'unranked': {userID: 8502512, flag: '1f1f8-1f1ea.svg', country: 'DE'},
        'hifu': {userID: 11843685, flag: '1f1ef-1f1f5.svg', country: 'JP'},
        'Ryuusei_Aika': {userID: 7777875, flag: '1f1e8-1f1f3.svg', country: 'CN'},
        'Zer0-G': {userID: 12577911, flag: '1f1e8-1f1e6.svg', country: 'CA'},
        'Chompy': {userID: 7427035, flag: '1f1e8-1f1e6.svg', country: 'CA'},
        'Ekoro': {userID: 284905, flag: '1f1eb-1f1f7.svg', country: 'FR'}
    }
    
    for (let j = 0; j < setsList.length; j++) {
        let description = setsList[j].description;
        let hovers = description.split('hover.');
        let completeString = hovers[0];

        let descriptionContent = [];
        descriptionContent.push({type: 'description', content: completeString});


        if (hovers.length > 1) {
            for (let i = 1; i < hovers.length; i++) {
                let username = hovers[i].split(' ')[0]; //each of the hovers has a space after the username
                let displayUsername = username;

                if (username.includes('_') && username.indexOf('_') > 1) { //some usernames will have an underscore intentionally, like _Karaage - removing all underscores past the 1st is Fine enough for now
                    displayUsername = displayUsername.replaceAll('_', ' ');
                }

                let hoverContent = {
                    "username": displayUsername,
                    "userID": hoverInfo[username]?.userID,
                    "flag": hoverInfo[username]?.flag
                }
                
                descriptionContent.push({type: 'hover', content: hoverContent}, {type: "description", content: hovers[i].split(username)[1]});
            }
        }
        setsList[j].description = descriptionContent;
    }

    fs.writeFileSync('new.json', JSON.stringify(setsList, null, 4))