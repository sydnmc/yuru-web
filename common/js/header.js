import { initializeGdsPage } from './gds.js';

var documentSheets = document.styleSheets;
var headerSheet;

var sheetCount = 0;
var foundHeaderSheet = false;
while (sheetCount < documentSheets.length && !foundHeaderSheet) {
  if (documentSheets[sheetCount].href.includes('header.css')) {
    headerSheet = documentSheets[sheetCount];
    foundHeaderSheet = true;
  }
  sheetCount++;
}

/* checking for page language */
var jp = false;
if (document.documentElement.lang == 'jp') {
    jp = true;
}

//first, we want to know if we're on lilac.yuru.ca or syd.yuru.ca
var testing = false;
var hostname = location.hostname;
var site;
switch (hostname) {
  case 'lilac.yuru.ca':
    site = 'lilac';
    break;
  case 'syd.yuru.ca':
    site = 'sydney';
    break;
  case '127.0.0.1': //this is only for testing, the other two should work just fine in prod~
    testing = true;
    break;
}

//finding what page we're on
var pathname = location.pathname.substring(1);
if (testing) {
  if (pathname.includes('lilac')) {
    site = 'lilac';
  } else if (pathname.includes('syd')) {
    site = 'sydney';
  }
  pathname = pathname.split('/')[1]; //getting the stuff after the next slash, which should be the page name
}

if (!site) { //if we still don't have a site, we must be on a common page, so let's account for that~
  let person = location.search.substring(1);
  if (person == 'lilac') {
    site = 'lilac';
  } else if (person == 'sydney') {
    site = 'sydney';
  }
}

if (pathname == '') { //if we're at the index, set it to be index for clarity
  pathname = "index";
} if (jp) {
  pathname = pathname.split('-ja_jp')[0]; //lastly, all japanese pages have -ja_jp after them, so we want to remove that as well
}
pathname = pathname.split('.html')[0]; //removes the .html after, which should be the last thing that we have

console.log(`testing: ${testing}, site: ${site}, pathname: ${pathname}, jp: ${jp}`);

function generatePageHeader(jp, curPage, person) {
  let username;
  let pfpAlt;
  let translateUrl = `./${curPage}-ja_jp.html`;
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
          link: `../common/gds.html?${person}`
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
    if (curPage == "gds") { //or any other common page, though gds is the only one now
      
    }
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
          <img id="pfp-image" src="../common/images/${person}pfp.png" alt="${pfpAlt}">
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