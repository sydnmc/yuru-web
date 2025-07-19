/* now that i know more about how svelte works, this could probably be really really simplified,, but it works for now, so~ */
//this was also very heavily stolen from osugds.moe, and i kinda forgot what i'm talking about here ^ but, i'll fix it when i need to~

import { writable } from 'svelte/store'; //handles subscriptions in svelte

export let currentAudioInfo = writable({"id":-1, "progress":-1});
let animationCounter = -1;

let audioStore = {};
export function addToPageAudioController(gdInfo: gd) {
  let audio = new Audio(`https://b.ppy.sh/preview/${gdInfo.mapId}.mp3`)
  audioStore[gdInfo.mapId] = {audio, "isPlaying":false};
}

export function playFromAudioController(index: number) {
  console.log(audioStore);
  console.log(index);
  let currentAudio = audioStore[index];

  //in order to make this clicked audio play, we have to pause the last one (if there is one)
  Object.entries(audioStore).forEach(audio => { //pauses all currently playing audio, if we have any c:
    audio.audio.pause();
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
}

function startUpdatingProgress(id: number, audio: HTMLAudioElement) {
	function pollAudioProgress() {
		if (audio.paused || audio.ended) { //stop any animations if we're not playing anything
			return;
		}

		let progress = audio.currentTime*10; //every song file is 10 seconds, so we get a percentage out of this
		currentAudioInfo.set({id, "progress":progress});
		animationCounter = requestAnimationFrame(pollAudioProgress);
	}

	pollAudioProgress(); //starts update loop
}
