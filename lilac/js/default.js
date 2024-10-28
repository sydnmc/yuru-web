import { generatePageHeader } from './header.js';

/* checking for page language */
var jp = false;
try {
    document.getElementById('jp-page').innerHTML = "";
    jp = true;
} catch { }

var filename = location.href.split("/").slice(-1)[0];
filename = filename.substring(0, filename.indexOf("."));

if (jp) {
    filename = filename.substring(0, filename.indexOf("-"));
}

generatePageHeader(jp, filename);