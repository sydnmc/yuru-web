export * from "svelte-i18n";

import { browser } from "$app/environment";
import { init, register } from "@repo/i18n";

const defaultLocale = "en-CA";

register("en-CA", () => import("./locales/en-CA.json"));
register("ja-JP", () => import("./locales/ja-JP.json"));
register("he-IL", () => import("./locales/he-IL.json"));
register("zh-CN", () => import("./locales/zh-CN.json"));

init({
  fallbackLocale: defaultLocale,
  initialLocale: browser ? window.navigator.language : defaultLocale,
});
