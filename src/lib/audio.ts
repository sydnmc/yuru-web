import { writable } from 'svelte/store'; //handles subscriptions in svelte

export let audioInfo = writable({progress: -1, id: -1, currentlyPlaying: false});
let animationCounter = -1;

interface AudioStore {
  audio: HTMLAudioElement,
  isPlaying: boolean;
}

let audioStore: AudioStore = {};
export function addToPageAudioController(mapId: number, audio: HTMLAudioElement) {
  audioStore[mapId.toString()] = {audio, "isPlaying":false};
}

export function playFromAudioController(index: number) {
  let currentAudio = audioStore[index];

  //in order to make this clicked audio play, we have to pause the last one (if there is one)
  Object.entries(audioStore).forEach(audio => { //pauses all currently playing audio, if we have any c:
    audio[1].audio.pause();
  });

  currentAudio.isPlaying = true;
  currentAudio.audio.volume = 0.2;
  currentAudio.audio.play();

  startUpdatingProgress(index, currentAudio.audio);
}

export function pauseFromAudioController(index: number) {
  let currentAudio = audioStore[index];
  currentAudio.isPlaying = false;
  currentAudio.audio.pause();
  audioInfo.set({progress: -1, id: -1, currentlyPlaying: false});
}

export function changeVolume(volume: number) {
  Object.entries(audioStore).forEach(audio => {
    audio[1].audio.volume = volume;
  });
}

function startUpdatingProgress(id: number, audio: HTMLAudioElement) {
	function pollAudioProgress() {
		if (audio.paused || audio.ended) { //stop any animations if we're not playing anything
			return;
		}

		let progress = audio.currentTime*10; //every song file is 10 seconds, so we get a percentage out of this
		audioInfo.set({progress, id, currentlyPlaying: true});
		animationCounter = requestAnimationFrame(pollAudioProgress);
	}

	pollAudioProgress(); //starts updating audio constantly
}
