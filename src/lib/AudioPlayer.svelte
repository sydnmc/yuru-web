<script lang="ts">
    export async function createAudioButtons() {
    /* preview buttons */
    var audio = document.getElementById('tab-player-source');
    var setIDs = [];

    for (let i = 0; i < curMapStatus.length; i++) {
        var curSongUrl = curMapStatus[i].songURLs[0];
        var setID = curSongUrl.substr(curSongUrl.indexOf("/beatmapsets/")+13, curSongUrl.length); //gets the beatmap id
        if (setID.includes("#osu")) { //again, will only work for std so be careful
            setID = setID.substring(0, setID.indexOf("#osu"));
        }
        setIDs.push(setID);
    }

    var mapIsPlaying = new Array(setIDs.length).fill(false);

    for (let i = 0; i < curMapStatus.length; i++) {
        var curButton = document.getElementById('tab-player-'+i);

        curButton.addEventListener("click", () => {
            var clickedButton = document.getElementById('tab-player-'+i);
            audio.src = `https://b.ppy.sh/preview/${setIDs[i]}.mp3`;
            audio.volume = 0.2; //doesnt make your ears DIE

            if (!mapIsPlaying[i]) {
                audio.play();
                clickedButton.innerHTML = `<i class="fa fa-pause" style="font-size: 40px"></i>`; //pause button
                mapIsPlaying[i] = true;
            } else {
                audio.pause();
            }

            if (audio.paused || audio.ended) {
                mapIsPlaying[i] = false;
                clickedButton.innerHTML = `<i class="fa fa-play" style="font-size: 40px"></i>`; //makes it a play button again if paused
            }
            if (mapIsPlaying.filter(Boolean).length > 1) { //checks for if it's paused or ended, but also if more than 1 value is true (if another button is clicked instead)
                for (let check = 0; check < mapIsPlaying.length; check++) {
                    if (mapIsPlaying[check] && check != i) {
                        mapIsPlaying[check] = false;
                        document.getElementById('tab-player-'+check).innerHTML = `<i class="fa fa-play" style="font-size: 40px"></i>`; //makes it a play button again if paused
                    }
                }
            }
        });
    }
}
</script>

<audio controls id="tab-player-source">
    <source type="audio/mpeg">
</audio>
<div class="play-button-container" id="play-container-${i}">
    <span class="play-button" id="tab-player-${i}"><i class="fa fa-play" style="font-size: 40px"></i></span>
</div>

<style>
.play-button-container {
    display: flex; 
    align-items: center;
    justify-content: center;
    min-height: 80px;
    background: radial-gradient(circle, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.75) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.play-button-container:hover {
    opacity: 1; /* triggers fadein */
}

.play-button {
    color: rgb(222, 224, 237);
}

.play-button:hover {
    color: rgb(222, 224, 237);
    cursor: pointer;
}
</style>