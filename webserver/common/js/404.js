/* just a little script to detect the subdomain that we're on, and change the style depending on where we are.
* taken from header.js */

var documentSheets = document.styleSheets;
var sheet;

var sheetCount = 0;
var foundSheet = false;
while (sheetCount < documentSheets.length && !foundSheet) {
  if (documentSheets[sheetCount].href.includes('404.css')) {
    sheet = documentSheets[sheetCount].cssRules;
    foundSheet = true;
  }
  sheetCount++;
}

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
  case 'yuru.ca':
    site = 'yurukyan';
    break;
}

console.log(`current site: ${site}`);
if (site == 'lilac') {
    sheet[0].style.backgroundColor = 'var(--lilac-main)';
    sheet[2].style.color = 'var(--background)';
    sheet[3].style.color = 'var(--background)';

    let image = document.getElementById('image');
    document.getElementById('title').textContent = '404 | yuiyamu';
    document.getElementById('image-link').href = 'https://lilac.yuru.ca';
    image.alt = "lilac's kyu-kurarin pfp";
    image.src = 'https://api.yuru.ca/images/lilacpfp.png';
} else if (site == 'yurukyan') {
    let image = document.getElementById('image');
    document.getElementById('title').textContent = '404 | yurukyan';
    document.getElementById('image-link').href = 'https://yuru.ca';
    image.alt = "system shima rin pfp";
    image.src = 'https://api.yuru.ca/images/systempfp.png';
}

