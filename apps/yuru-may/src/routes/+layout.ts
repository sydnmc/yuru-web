import { browser } from '$app/environment';
import '@yuru-web/yuru-assets/i18n'; //initializes i18n :3
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async () => {
	if (browser) {
		locale.set(window.navigator.language);
	}
	await waitLocale();
}