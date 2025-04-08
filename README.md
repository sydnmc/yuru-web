# yuru-web

yurukyan△ system personal website~

`syd` and `lilac` contain pages specific to our subdomains (i.e. [syd.yuru.ca](https://syd.yuru.ca) and [lilac.yuru.ca](https://lilac.yuru.ca) respectively). 

`webserver` contains the backend of the website ([api.yuru.ca](https://api.yuru.ca)). there isn't any data included (as this is updated regularly and accesses other apis for various things such as last.fm and pluralkit integration) but you can see what data is on the server through the various endpoints listed below.

`webserver/common` contains base css used across all parts of the website, as well as common pages between both lilac and sydney (such as the gds or 404 pages).
 
we're also working on japanese translations for each page - however these may take a while, so don't expect anything at too fast of a pace :3

### endpoints
the website calls various endpoints for things to work smoothly, each of which you can check on your own and are documented here if (for whatever reason) you would like to use them for personal use. the root endpoint is `https://api.yuru.ca/`.

`gds/` (GET) - returns the osu! guest difficulties list for lilac or sydney, requires `person=STRING` option

`sets/` (GET) - returns the list of osu! beatmapsets that both of us have done

`songInfo/` (GET) - using last.fm, returns the song last listened to, or the song we're currently listening to

`pkInfo/` (GET) - using pluralkit, `frontList=true` returns the last fronts for the number of days specified by `before=INT`, as well as a percentage that each person has fronted in that timeframe. without the `frontList` option, it requires a `user=STRING` option to fetch a user by their pluralkit id