<script lang="ts">
  export let page: string;

  import { _ } from 'svelte-i18n';
  import { PUBLIC_HOME_LINK, PUBLIC_MUSIC_LINK, PUBLIC_SETS_LINK, PUBLIC_SYDNEY_GDS_LINK, PUBLIC_SYDNEY_HOME } from '$env/static/public';
  import Locale from './Locale.svelte';

  let prevPage;
  if (page === "home") {
    prevPage = PUBLIC_HOME_LINK;
  } else {
    prevPage = PUBLIC_SYDNEY_HOME;
  }

  interface buttonInfo {
    name: string;
    link: string;
    dropdown?: buttonInfo[];
  }

  let buttonInfo: buttonInfo[] = [{
    name: "osu!", //consistent across both pages, but we want to add more buttons for each person
    link: "",
    dropdown: [
      {
        name: $_('common.header.ourSets'),
        link: PUBLIC_SETS_LINK
      },
      {
        name: $_('common.header.myGds'),
        link: PUBLIC_SYDNEY_GDS_LINK
      }
    ]
  },
  {
    name: "music",
    link: PUBLIC_MUSIC_LINK
  }
];

  let pfpAlt = $_('sydney.header.pfpAlt');
  let pfpLink = '/common/sydneypfp.png';
  let username = "sydnmc"

  let displayBurger = false;
  function openHamburgerMenu() {
    displayBurger = true;
  }
  function closeHambugerMenu() {
    displayBurger = false;
  }

  let showWarning = true;
  function closeWarning() {
    showWarning = false;
  }
</script>

<div id="deprecated-warning" style="display: {showWarning? 'flex' : 'none'}">
  <span>this page has been deprecated, as sydney is no longer a main part of our system.</span>
  <span id="top-close-button" on:click={() => closeWarning()}>&times;</span>
  <span></span>
</div>
<div id="header">
  <a href={prevPage}>
    <img id="pfp-image" src={pfpLink} alt={pfpAlt}>
  </a>
  <h1>{username}</h1>
    {#each buttonInfo as button}
      {#if button.dropdown}
      <div class="button-with-dropdown-container">
        <button>{button.name}</button>
          <div class="dropdown-content">
            {#each button.dropdown as dropdown}
            <a href="{dropdown.link}">{dropdown.name}</a>
            {/each}
          </div>
      </div>
      {:else}
        <a href="{button.link}">
          <button>{button.name}</button>
        </a>
      {/if}
    {/each}
    <span id="hamburger-button" on:click={() => openHamburgerMenu()}>&#9776;</span>
    <div id="burger-menu" style="width: {displayBurger? '300px' : '0'}">
      <span id="close-button" on:click={() => closeHambugerMenu()}>&times;</span>
      {#each buttonInfo as button}
      {#if button.dropdown}
        {#each button.dropdown as dropdown}
          <a class="burger-text" href="{dropdown.link}">{button.name} | {dropdown.name}</a>
        {/each}
      {:else}
        <a class="burger-text" href="{button.link}">{button.name}</a>
      {/if}
    {/each}
    </div>
</div>

<style>
:root {
  --local-main: var(--sydney-main);
  --local-accent: var(--sydney-accent);
  --light-accent: var(--sydney-light-accent);
}

#deprecated-warning {
  display: flex;
  position: relative;
  justify-content: center;
  background-color: rgb(197, 88, 88);
  margin-left: 8px;
  margin-top: 8px;
  margin-right: 8px;
  border-radius: 5px;
  text-align: center;
} #deprecated-warning span {
  color: white;
}

#top-close-button {
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 5px;
}

#header { /* probably originally supposed to scroll with the page? */
    display: flex;
    position: relative;
    align-items: center;
    background-color: var(--local-main);
    border-radius: 10px;
    padding: 10px;
    margin-left: 8px;
    margin-top: 8px;
    margin-right: 8px;
}

#pfp-image {
    width: 120px;
    border-radius: 50%;
}

h1 {
    font-family: Kyokasho, sans-serif;
    font-size: 58px;
    font-weight: normal;
    padding-left: 20px;
    color: white;
}

button {
    font-family: Kyokasho, sans-serif;
    font-size: 32px;
    background-color: var(--light-accent);
    border: none;
    border-radius: 5px;
    color: white;
    padding: 15px 90px; /* determines the button size, default is this */
    transition-duration: 0.2s;
    cursor: pointer;
    margin-left: 20px;
} button:hover {
    background-color: var(--local-accent);
}

.button-with-dropdown-container {
    position: relative;
} .button-with-dropdown-container:hover .dropdown-content { /* makes dropdown content visible when hovered over */
    display: block;
}

.dropdown-content {
    display: none;
    position: absolute;
    width: calc(244px + 10px); /* really not a good way to go about it, but the box with osu! text is 244px */
    left: 15px; /* also not great, but i'll keep this for now to centre it */
    border-radius: 5px;
    box-shadow: 8px 8px 16px 0px rgba(0,0,0,0.5);
} .dropdown-content a {
    display: block;
    background-color: var(--light-accent);
    color: white;
    padding: 12px 16px; /* gives the text enough breathing room */
    text-align: center;
    cursor: pointer;
    text-decoration: none;
} .dropdown-content a:hover { /* makes dropdowns darker when you hover as well */
    background-color: var(--local-accent);
    border-radius: 5px;
}

/* burger menu (shouldn't display on desktop */
#hamburger-button {
    display: none;
}

#burger-menu {
    display: none;
}

/* mobile - burger menu */
@media only screen and (max-device-width: 768px)
{
    /* changing/removing desktop elements */
    #pfp-image {
        width: 90px;
    }

    h1 {
        font-size: 50px;
        padding-left: 10px;
    }

    .button-with-dropdown-container {
        display: none;
    }

    button {
        display: none;
    }

    /* displaying hamburger menu */
    #hamburger-button {
        display: grid;
        font-size: 36px;
        /* color set by js */
        cursor: pointer;
        margin-left: auto; /* moves it to the end of the flexbox */
    }

    #burger-menu {
        display: block;
        position: fixed;
        height: 100%;
        width: 0; /* width gets changed when it's opened, 0 by default */
        top: 0;
        right: 0;
        background-color: var(--local-main);
        text-align: right;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        transition: .25s ease; /* makes the slide out animation~ */
        z-index: 1;
    }

    .burger-text {
        display: block;
        text-align: center;
        color: white;
        cursor: pointer;
        padding-top: 7.5px;
        padding-bottom: 7.5px;
        text-decoration: none;

    }

    #close-button {
        color: white;
        padding-right: 5px;
        padding-top: 5px;
        cursor: pointer;
    }
}
</style>
