import { browser } from '$app/environment';
import { init, register } from 'svelte-i18n';

const defaultLocale = 'en-CA';

register('en-CA', () => import('./locales/en-CA.json'));
register('ja-JP', () => import('./locales/ja-JP.json'));
register('he-IL', () => import('./locales/he-IL.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale,
});
