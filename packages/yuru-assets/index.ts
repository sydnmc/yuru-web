/* svelte components */
export { default as AudioPlayer } from './lib/components/AudioPlayer.svelte';
export { default as AudioVolume } from './lib/components/AudioVolume.svelte';
export { default as Header } from './lib/components/Header.svelte';
export { default as Locale } from './lib/components/Locale.svelte';
export { default as GuestDifficulties } from './lib/GuestDifficulties.svelte';

export * from './lib/types.ts';

import './lib/base.css'; //not exactly needed, but it's cleaner to just import from here ^-^

//things in the assets folder are also already imported by vite :3
