export function generatePageHeader(isJapanese, currentPage) {
    var header = `<div class="header">
        <a class="top-img" href="index.html">
          <img id="profile-pic-image" class="header" src="images/sydpfp.png" alt="sydney's shima rin pfp">
        </a>
        <h1 class="header">sydnmc</h1>
        <div class="dropdown" style="margin-left: 1%;">
          <a class="button-link">
            <button class="drop-button" style="cursor: default;">osu!</button>
          </a>
          <div class="dropdown-content">
            <a href="sets.html" id="sets-but">my sets</a>
            <a href="gds.html" id="gds-but">my gds</a>
          </div>
        </div>
        <a class="button-link" id="music-link" href="music.html">
          <button id="music-but">music</button>
        </a>
        <button class="borgar" id="hamburger"><span id="borgar-text">&#9776;</span></button>
        <a class="translate-button" href="index-ja_jp.html">&#127760;</a>

        <div class="borgar-menu" id="popout-menu">
          <div class="borgar-text-wrapper" id="close-button">
            <a class="borgar-menu-text" id="close-button-text">&times;</a>
          </div>
          <div class="borgar-text-wrapper">
            <a class="borgar-menu-text" href="gds.html">osu! | gds</a>
          </div>
          <div class="borgar-text-wrapper">
            <a class="borgar-menu-text" href="sets.html">osu! | sets</a>
          </div>
          <div class="borgar-text-wrapper">
            <a class="borgar-menu-text" href="music.html">music</a>
          </div>
        </div>
      </div>`;

    document.getElementById('page-header').innerHTML = header;

    var currentlyOnPage = "cursor: default; background-color: rgb(49, 43, 53); border-radius: 5px;";

    var gdsButton = document.getElementById('gds-but');
    var setsButton = document.getElementById('sets-but');
    var musicButton = document.getElementById('music-but');
    var translateButton = document.getElementsByClassName('translate-button')[0];

    if (isJapanese) {
        setsButton.textContent = "自分の譜面";
        gdsButton.textContent = "自分のgd";
        musicButton.textContent = "音楽"
        document.getElementById('profile-pic-image').setAttribute('alt', 'シドニーの志摩リンプロフィール画像');

        setsButton.setAttribute('href', '404translate.html');
        gdsButton.setAttribute('href', 'gds-ja_jp.html');
        document.getElementById('music-link').setAttribute('href', '404translate.html');

        switch (currentPage) {
            case "index":
                document.getElementsByClassName('top-img')[0].setAttribute('href', 'https://yuru.ca/index-ja_jp');
                translateButton.setAttribute('href', 'index.html');
                break;
            case "sets":
                setsButton.style = currentlyOnPage;
                setsButton.removeAttribute('href');
                translateButton.setAttribute('href', '404translate.html');
                document.getElementsByClassName('top-img')[0].setAttribute('href', 'index-ja_jp.html');
                break;
            case "gds":
                gdsButton.style = currentlyOnPage;
                gdsButton.removeAttribute('href');
                translateButton.setAttribute('href', 'gds.html');
                document.getElementsByClassName('top-img')[0].setAttribute('href', 'index-ja_jp.html');
                break;
            case "music":
                musicButton.style = currentlyOnPage;
                musicButton.removeAttribute('href');
                translateButton.setAttribute('href', 'music.html');
                document.getElementsByClassName('top-img')[0].setAttribute('href', 'index-ja_jp.html');
                break;
        }
    } else {
        switch (currentPage) {
            case "index":
                document.getElementsByClassName('top-img')[0].setAttribute('href', 'https://yuru.ca/');
                break;
            case "sets":
                setsButton.style = currentlyOnPage;
                setsButton.removeAttribute('href');
                translateButton.setAttribute('href', '404translate.html');
                break;
            case "gds":
                gdsButton.style = currentlyOnPage;
                gdsButton.removeAttribute('href');
                translateButton.setAttribute('href', '404translate.html');
                break;
            case "music":
                musicButton.style = currentlyOnPage;
                musicButton.removeAttribute('href');
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