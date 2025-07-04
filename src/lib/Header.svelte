<script lang="ts">
  export let person: string;
  export let page: string;

  import { _ } from 'svelte-i18n';

  let prevPage;
  if (page === "home") {
    prevPage = "https://yuru.ca";
  } else {
    prevPage = `https://${person}.yuru.ca`;
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
        link: "https://yuru.ca/sets"
      },
      {
        name: $_('common.header.myGds'),
        link: `https://${person}.yuru.ca/gds`
      }
    ]
  }];

  let pfpAlt = '';
  let pfpLink = '';
  let username = '';

  let main = '';
  let accent = '';
  let lightAccent = '';
  switch (person) {
    case "syd":
      pfpAlt = $_('sydney.header.pfpAlt');
      pfpLink = '/common/sydneypfp.png';
      username = "sydnmc"
      buttonInfo.push({ name: "music", link: './music.html'});

      main = 'var(--sydney-main)';
      accent = 'var(--sydney-accent)';
      lightAccent = 'var(--sydney-light-accent)';
      break;
    case "lilac":
      pfpAlt = $_('lilac.header.pfpAlt');
      pfpLink = '/common/lilacpfp.png';
      username = "yuiyamu";
      buttonInfo.push({ name: "who am i?", link: './whoami.html'});

      main = 'var(--lilac-main)';
      accent = 'var(--lilac-accent)';
      lightAccent = 'var(--lilac-light-accent)';
      break;
  }


  if (((page === 'home' || page === 'music' ) && person === 'sydney') || (page === 'whoami' && person === 'lilac')) {
    //for right now, these are all of the untranslated pages that also have headers (sets aren't translated yet either, but i'll get to that at some point~)
    //we want to redirect these to the custom translate 404 page instead of the normal 404 page :3
    
    //will impliment :3
  }
</script>

<div id="header" style="background-color: {main}">
  <a href={prevPage}>
    <img id="pfp-image" src={pfpLink} alt={pfpAlt}>
  </a>
  <h1>{username}</h1>
    {#each buttonInfo as button}
      {#if button.dropdown}
      <div class="button-with-dropdown-container">
        <button class="drop-button" style="background-color: {lightAccent}">{button.name}</button>
          <div class="dropdown-content">
            {#each button.dropdown as dropdown}
            <a href="{dropdown.link}" style="background-color: {lightAccent}">{dropdown.name}</a>
            {/each}
          </div>
      </div>
      {:else}
        <a href="{button.link}">
          <button class="header-button" style="background-color: {lightAccent}">{button.name}</button>
        </a>
      {/if}
    {/each}
    <span id="hamburger-button">&#9776;</span>
    <i class="fa fa-globe hidden-link" style="color: white; font-size: 22px;"></i>
    <div id="burger-menu">
      <a id="close-button">&times;</a>
      {#each buttonInfo as button}
      {#if button.dropdown}
        {#each button.dropdown as dropdown}
          <a class="burger-text" href="${dropdown.link}">{button.name} | {dropdown.name}</a>
        {/each}
      {:else}
        <a class="burger-text" href="${button.link}">{button.name}</a>
      {/if}
    {/each}
    </div>
</div>

<style>
/* header styling properties */
#header { /* probably originally supposed to scroll with the page? */
    display: flex;
    position: relative;
    align-items: center;
    border-radius: 10px;
    padding: 10px;
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
    border: none;
    border-radius: 5px;
    color: white;
    padding: 15px 90px; /* determines the button size, default is this */
    transition-duration: 0.2s;
    cursor: pointer;
    margin-left: 20px;
}

.smaller-button {
    font-size: 26px;
    padding: 15px 40px;
}

.fa-globe {
    position: absolute; /* absolute based on the header position */
    top: 10px;
    right: 10px;
    text-decoration: none;
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
}

.dropdown-content a {
    display: block;
    color: white;
    padding: 12px 16px; /* gives the text enough breathing room */
    text-align: center;
    cursor: pointer;
    text-decoration: none;
} .dropdown-content a:hover { /* makes dropdowns darker when you hover as well */
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
@media only screen and (max-device-width: 1000px)
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

    .header-button {
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
        /* background set by js */
        text-align: right;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        transition: .25s ease; /* makes the slide out animation~ */
        z-index: 1;
    }

    .burger-text {
        display: block;
        text-align: center;
        color: var(--background);
        cursor: pointer;
        padding-top: 7.5px;
        padding-bottom: 7.5px;
        text-decoration: none;

    } .burger-text:hover {
        /* background set by js */
    }

    #close-button {
        padding-right: 5px;
        padding-top: 5px;
        cursor: pointer;
    }
}
</style>