// @ts-nocheck
import { browser } from '$app/environment';
import '$lib/i18n'; //initializes i18n :3
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';

export const load = async () => {
	if (browser) {
		locale.set(window.navigator.language);
	}
	await waitLocale();
};null as any as LayoutLoad;