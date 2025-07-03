<script lang="ts">

function generatePageHeader(jp, curPage, person) {
  let websitePerson = person;
  if (person == 'sydney') {
    websitePerson = 'syd';
  }
  let username;
  let pfpAlt;
  let translateUrl = `./${curPage}-ja_jp.html`;
  if (((curPage == 'index' || curPage == 'music' ) && person == 'sydney') || (curPage == 'whoami' && person == 'lilac')) {
    //for right now, these are all of the untranslated pages that also have headers (sets aren't translated yet either, but i'll get to that at some point~)
    //we want to redirect these to the custom translate 404 page instead of the normal 404 page :3
    translateUrl = `https://${websitePerson}.yuru.ca/404translate`;
  }
  let prevPage;

  let mobileContent = "";
  let desktopContent = "";
  let buttonInfo = [{
      name: "osu!",
      link: "",
      dropdown: [
        {
          name: "our sets",
          link: "https://yuru.ca/sets"
        },
        {
          name: "my gds",
          link: `https://${websitePerson}.yuru.ca/gds`
        }
      ]
    }];
  switch (person) {
    case 'lilac':
      username = 'yuiyamu';
      pfpAlt = "lilac's kyu-kurarin pfp";
      headerSheet.cssRules[2].style.color = `var(--background)`; //h1 text
      headerSheet.cssRules[14].cssRules[4].style.color = `var(--background)`; //hamburger-button
      buttonInfo.push({ name: "who am i?", link: './whoami.html'});
      break;
    case 'sydney':
      username = 'sydnmc';
      pfpAlt = "sydney's shima rin pfp";
      headerSheet.cssRules[2].style.color = `white`; //h1 text
      headerSheet.cssRules[14].cssRules[4].style.color = `white`; //hamburger-button
      headerSheet.cssRules[14].cssRules[6].style.color = `white`; //burger-text
      buttonInfo.push({ name: "music", link: './music.html'});
      break;
  }

  if (curPage == "index") {
    prevPage = "https://yuru.ca";
  } else {
    prevPage = "./index.html";
  }

  if (jp) {
    buttonInfo[0].dropdown[0].name = "あたしたちのgds";
    buttonInfo[0].dropdown[1].name = "自分の譜面";
    translateUrl = `./${curPage}.html`;
    switch (person) {
      case 'lilac':
        buttonInfo[1].name = "あたしって誰？";
        pfpAlt = "らいらっくのきゅうくらりんリンプロフィール画";
        break;
      case 'sydney':
        buttonInfo[1].name = "自分の曲";
        pfpAlt = "シドニーの志摩リンプロフィール画像";
        break;
    }
    if (curPage == "index") {
      prevPage = "https://yuru.ca/index-ja_jp.html";
    } else {
      prevPage = "./index-ja_jp.html"
    }
  }

  buttonInfo.forEach(button => {
    if (button.dropdown) {
      desktopContent = desktopContent+`<div class="button-with-dropdown-container"><button class="drop-button">${button.name}</button><div class="dropdown-content">`; //starts the dropdown container
      button.dropdown.forEach(dropdown => {
        desktopContent = desktopContent+`<a href="${dropdown.link}">${dropdown.name}</a>`;
        mobileContent = mobileContent+`<a class="burger-text" href="${dropdown.link}">${button.name} | ${dropdown.name}</a>`;
      });
      desktopContent = desktopContent+`</div></div>`; //closes out both divs we opened
    } else {
      desktopContent = desktopContent+`<a href="${button.link}"><button class="header-button">${button.name}</button></a>`;
      mobileContent = mobileContent+`<a class="burger-text" href="${button.link}">${button.name}</a>`;
    }
  });

  let header = 
  `<div id="header">
        <a href="${prevPage}">
          <img id="pfp-image" src="https://api.yuru.ca/images/${person}pfp.png" alt="${pfpAlt}">
        </a>
        <h1>${username}</h1>
        ${desktopContent}
        <span id="hamburger-button">&#9776;</span>
        <a id="translate-button" href="${translateUrl}">&#127760;</a>

        <div id="burger-menu">
          <a id="close-button">&times;</a>
          ${mobileContent}
        </div>
      </div>`;

    document.getElementById('page-header').innerHTML = header; //puts the header on the page

    /* changing elements based on person */
    headerSheet.cssRules[0].style.backgroundColor = `var(--${person}-main)`; //header
    headerSheet.cssRules[3].style.backgroundColor = `var(--${person}-light-accent)`; //button
    headerSheet.cssRules[4].style.backgroundColor = `var(--${person}-accent)`; //button:hover
    headerSheet.cssRules[9].style.backgroundColor = `var(--${person}-light-accent)`; //button:hover
    headerSheet.cssRules[11].style.backgroundColor = `var(--${person}-accent)`; //button:hover

    headerSheet.cssRules[14].cssRules[5].style.backgroundColor = `var(--${person}-light-accent)`; //burger-menu
    headerSheet.cssRules[14].cssRules[7].style.backgroundColor = `var(--${person}-main)`; //burger-text:hover

    //let currentlyOnPage = `cursor: default; background-color: var(--${person}-accent); border-radius: 5px;`;
    if (curPage == "gds") {
      initializeGdsPage(jp, person);
    }

  document.getElementById('hamburger-button').addEventListener('click', function() {
      document.getElementById('burger-menu').style = "width: 250px;"
  });
  
  document.getElementById('close-button').addEventListener('click', function() {
      document.getElementById('burger-menu').style = "width: 0px;"
  });
}

generatePageHeader(jp, pathname, site);
</script>

<style>
    /* header styling properties */
#header { /* probably originally supposed to scroll with the page? */
    display: flex;
    position: relative;
    align-items: center;
    /* background set by js */
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
}

button {
    font-family: Kyokasho, sans-serif;
    font-size: 32px;
    border: none;
    border-radius: 5px;
    color: white;
    /* background set by js */
    padding: 15px 90px; /* determines the button size, default is this */
    transition-duration: 0.2s;
    cursor: pointer;
    margin-left: 20px;
} button:hover {
    /* background set by js */
}

.smaller-button {
    font-size: 26px;
    padding: 15px 40px;
}

#translate-button {
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
    /* background set by js */
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
    /* background set by js */
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