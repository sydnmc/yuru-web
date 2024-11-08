export function generatePageHeader(isJapanese, currentPage) {
    var header = `<div class="header">
        <a class="top-img" href="https://yuru.ca">
          <img class="header" id="profile-pic-image" src="images/lilacpfp.png" alt="lilac's kyu-kurarin pfp">
        </a>
        <h1 class="header">yuiyamu</h1>
        <div class="dropdown" style="margin-left: 1%;">
          <a class="button-link">
            <button class="drop-button" style="cursor: default;">osu!</button>
          </a>
          <div class="dropdown-content">
            <a href="gds.html" id="gds-but">my gds</a>
          </div>
        </div>
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
            <a class="borgar-menu-text" href="whoami.html">who am i?</a>
          </div>
        </div>
      </div>`;

    document.getElementById('page-header').innerHTML = header;

    var currentlyOnPage = "cursor: default; background-color: rgb(142, 142, 148); border-radius: 5px;";

    var gdsButton = document.getElementById('gds-but');
    var translateButton = document.getElementsByClassName('translate-button')[0];

    if (isJapanese) {
        gdsButton.textContent = "自分のgd";
        document.getElementById('profile-pic-image').setAttribute('alt', 'らいらっくのきゅうくらりんリンプロフィール画像');

        gdsButton.setAttribute('href', 'gds-ja_jp.html');
        switch (currentPage) {
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
        switch (currentPage) {
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