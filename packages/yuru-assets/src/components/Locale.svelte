<script lang="ts">
    import { _, locale } from "svelte-i18n";
    export let mode: string;
    export let person: string;
    export let page: string;
    import { pageLocales, localeInfo } from "./langSupport";

    let showLocaleMenu = false;
    function openLocaleMenu() {
        if (showLocaleMenu) {
            showLocaleMenu = false;
        } else {
            showLocaleMenu = true;
        }
    }

    function changeLocale(localeString: string) {
        locale.set(localeString);
    }
</script>

<button class="fa fa-globe" onclick={() => openLocaleMenu()}>
    <div class={mode === "header" ? "header-locale-menu" : "locale-menu"} style="display: {showLocaleMenu ? 'flex' : 'none'}">
        {#each pageLocales[person][page] as lang}
            <div onclick={() => changeLocale(lang)}>
                <img src={localeInfo[lang].flag} alt={lang} />
                <span>{localeInfo[lang].name}</span>
            </div>
        {/each}
    </div>
</button>

<style>
    .fa-globe {
        background-color: transparent;
        border: none;
        position: relative;
        font-size: 22px;
        color: white;
        padding-right: 8px;
        cursor: pointer;
    }

    .locale-menu {
        display: flex;
        position: absolute;
        top: 28px;
        right: 8px;
        flex-direction: column;
        border: 3px solid #79b8d4;
        border-radius: 10px;
        width: 190px;
        backdrop-filter: brightness(0.5);
    } .locale-menu div {
        display: flex;
        padding: 8px;
    } .locale-menu div img {
        width: 24px;
        margin-right: 5px;
    } .locale-menu div span {
        font-family: "Zen Kaku Gothic New", sans-serif;
        font-size: 18px;
    }

    .header-locale-menu {
        display: flex;
        position: absolute;
        top: 30px;
        right: 8px;
        flex-direction: column;
        border-radius: 10px;
        width: 180px;
        z-index: 1;
    } .header-locale-menu div {
        display: flex;
        padding: 8px;
    } .header-locale-menu div img {
        width: 22px;
        margin-right: 5px;
    } .header-locale-menu div span {
        font-family: "Raleway", sans-serif;
        font-size: 16px;
    }
</style>
