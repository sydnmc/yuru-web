<script lang="ts">
    import { _, locale } from 'svelte-i18n';
    export let mode: string;

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
    <div class="{mode === "header"? 'header-locale-menu' : 'locale-menu'}" style="display: {showLocaleMenu? 'flex' : 'none'}">
        <div onclick={() => changeLocale('en')}>
            <img src="https://osu.ppy.sh/assets/images/flags/1f1e8-1f1e6.svg" alt="ca"/>
            <span>english (canadian)</span>
        </div>
        <div class="middle-lang" onclick={() => changeLocale('jp')}>
            <img src="https://osu.ppy.sh/assets/images/flags/1f1ef-1f1f5.svg" alt="jp"/>
            <span>日本語</span>
        </div>
        <div onclick={() => changeLocale('il')}>
            <img src="https://osu.ppy.sh/assets/images/flags/1f1ee-1f1f1.svg" alt="il"/>
            <span dir="rtl">עברית</span>
        </div>
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

.middle-lang {
    border-top: 1px solid white;
    border-bottom: 1px solid white;
}
</style>