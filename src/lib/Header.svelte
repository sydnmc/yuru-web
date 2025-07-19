<script lang="ts">
  export let person: string;
  export let page: string;

  import { _ } from 'svelte-i18n';
  import { PUBLIC_HOME_LINK, PUBLIC_LILAC_GDS_LINK, PUBLIC_LILAC_HOME, PUBLIC_MAY_HOME, PUBLIC_SETS_LINK, PUBLIC_WHOAMI_LINK } from '$env/static/public';

  let prevPage = '';
  if (page === "home") {
    prevPage = PUBLIC_HOME_LINK;
  } else {
    switch (person) {
      case "lilac":
        prevPage = PUBLIC_LILAC_HOME;
        break;
      case "may":
        prevPage = PUBLIC_MAY_HOME;
        break;
    }
  }

  interface buttonInfo {
    name: string;
    link: string;
  }
  let buttonInfo: buttonInfo[] = [ //each person has at least a link back to our sets
    {
      name: $_('common.header.ourSets'),
      link: ""
    }
  ];

  let pfpAlt = '';
  let pfpLink = '';
  let username = '';
  switch (person) {
    case "lilac":
      pfpAlt = $_('lilac.header.pfpAlt');
      pfpLink = '/common/lilacpfp.png';
      username = "yuiyamu";
      buttonInfo.push({ name: "my osu! gds", link: PUBLIC_LILAC_GDS_LINK})
      buttonInfo.push({ name: "who am i?", link: PUBLIC_WHOAMI_LINK});
      break;
    case "may":
      pfpAlt = $_('may.header.pfpAlt');
      pfpLink = '/common/maypfp.jpg';
      username = "anemone_";
      break;
  }
</script>

<div id="header">
  <a id="pfp-container" href={prevPage}>
    <img src={pfpLink} alt={pfpAlt}/>
    <span>{username}</span>
  </a>
  {#each buttonInfo as option, i}
    <a class="option" href={option.link}>{option.name}</a>
    {#if i < buttonInfo.length-1}
    <span class="flower-divider">ꕤ</span>
    {/if}
  {/each}

  <span id="hamburger-button">&#9776;</span>
  <i class="fa fa-globe hidden-link"></i>
  <div id="burger-menu">
    <a id="close-button">&times;</a>
    {#each buttonInfo as button}
    <a class="burger-text" href="${button.link}">{button.name}</a>
    {/each}
  </div>
</div>

<style>
#header {
  font-family: 'Raleway', sans-serif;
  font-size: 18px;
  display: flex;
  position: relative;
  align-items: center;
  padding: 15px;
  background: linear-gradient(360deg,rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
}

#pfp-container {
  display: flex;
  align-items: center;
  margin-right: 20px;
  text-decoration: none;
} #pfp-container img {
  width: 60px;
  border-radius: 50%;
  margin-right: 10px;
} #pfp-container span {
  color: white;
}

.option {
  text-decoration: none;
} .option:hover {
  transition: 0.15s;
  text-shadow: -5px 4px 14px rgba(0,0,0,1);
}

.flower-divider {
  margin-left: 20px;
  margin-right: 20px;
}

.fa-globe {
  font-size: 20px;
  color: white;
  position: absolute; /* absolute based on the header position */
  top: 10px;
  right: 10px;
  text-decoration: none;
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
  .option {
    display: none;
  }

  .flower-divider {
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

    }

    #close-button {
        padding-right: 5px;
        padding-top: 5px;
        cursor: pointer;
    }
}
</style>