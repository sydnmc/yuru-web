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

console.log(`testing: ${testing}, site: ${site}, pathname: ${pathname}, jp: ${jp}`);

function generatePageHeader(jp, curPage, person) {
  let username;
  let pfpAlt;
  let translateUrl;
  switch (person) {
    case 'lilac':
      username = 'yuiyamu';
      break;
    case 'sydney':
      username = 'sydnmc';
      break;
  }

  let header = 
  `<div id="header">
        <a id="top-img" href="https://yuru.ca"> <!-- needs to update depending on jp page/where we are -->
          <img id="pfp-image" src="../common/images/${person}pfp.png"> <!-- should update both alt text and source -->
        </a>
        <h1>${username}</h1>
        <div class="button-with-dropdown-container">
          <button class="drop-button">osu!</button>
          <div class="dropdown-content">
            <a href="http://yuru.ca/sets.html">our sets</a>
            <a href="../common/gds.html?${person}">my gds</a>
          </div>
        </div>
        <button id="hamburger"><span>&#9776;</span></button>
        <a id="translate-button" href="index-ja_jp.html">&#127760;</a>

        <div class="borgar-menu" id="popout-menu">
          <div class="borgar-text-wrapper" id="close-button">
            <a id="close-button-text">&times;</a>
          </div>
          <div class="borgar-text-wrapper">
            <a href="../common/gds.html?${person}">osu! | gds</a>
          </div>
          <div class="borgar-text-wrapper">
            <a href="http://yuru.ca/sets.html">osu! | sets</a>
          </div>
          <div class="borgar-text-wrapper">
            <a href="whoami.html">who am i?</a>
          </div>
        </div>
      </div>`;

    document.getElementById('page-header').innerHTML = header; //puts the header on the page
    document.getElementById('header').style.backgroundColor = `var(--${person}-main)`;

    let currentlyOnPage = `cursor: default; background-color: var(--${person}-accent); border-radius: 5px;`;

    let gdsButton = document.getElementById('gds-but');
    let setsButton = document.getElementById('sets-but');
    let translateButton = document.getElementsByClassName('translate-button')[0];
    translateButton = document.getElementsByClassName('button').style.backgroundColor = `var(--${person}-accent)`;
    

    if (jp) {
        gdsButton.textContent = "あたしたちのgds";
        setsButton.textContent = "自分の譜面";
        document.getElementById('pfp-image').setAttribute('alt', 'らいらっくのきゅうくらりんリンプロフィール画像');

        gdsButton.setAttribute('href', 'gds-ja_jp.html');
        setsButton.setAttribute('href', '404translate.html');
        switch (curPage) {
            case "index":
                document.getElementsByClassName('top-img')[0].setAttribute('href', 'https://yuru.ca/index-ja_jp');
                translateButton.setAttribute('href', 'index.html');
                break;
            case "gds":
                gdsButton.style = currentlyOnPage;
                gdsButton.removeAttribute('href');
                translateButton.setAttribute('href', 'gds.html');
                document.getElementsByClassName('top-img')[0].setAttribute('href', 'index-ja_jp.html');
                break;
        }
    } else {
        switch (curPage) {
            case "index":
                document.getElementsByClassName('top-img')[0].setAttribute('href', 'https://yuru.ca/');
                break;
            case "gds":
                gdsButton.style = currentlyOnPage;
                gdsButton.removeAttribute('href');
                translateButton.setAttribute('href', 'gds-ja_jp.html');
                document.getElementsByClassName('top-img')[0].setAttribute('href', 'index.html');
                break;
            case "whoami":
                document.getElementsByClassName('top-img')[0].setAttribute('href', 'index.html');
                translateButton.setAttribute('href', '404translate.html');
                break;
        }
    }

  document.getElementById('hamburger').addEventListener('click', function() {
      document.getElementById('popout-menu').style = "width: 250px;"
  });
  
  document.getElementById('close-button').addEventListener('click', function() {
      document.getElementById('popout-menu').style = "width: 0px;"
  });
}

generatePageHeader(jp, pathname, site);