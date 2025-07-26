# yuru-web

yurukyan△ system personal website~


## localization
our system (mostly lilac) is currently working on translating every page on our site into japanese - and, thanks to the help of our lovely girlfriend, work for hebrew translations is also currently underway! however, this does not apply to sydney's pages, as those are no longer being maintained.

> japanese: every page except for `lilac/whoami` and `yurukyan/sets`

> hebrew: only `yurukyan/home` and the error page

## dev notes
since this project now utilizes sveltekit as its framework, installation and development are relatively simple. just go to the root of the project, run `npm install` to install all of the dev dependencies, then `npm run dev` to start a local server.

note: because of how individual servers are run for each web page (due to turborepo), you must make sure you have ports `1414` through `1417` open before running.

despite using sveltekit, we prefer not using the built in server functionality and, instead, have a single `main.js` in `src/lib/server` which you must also run to have a local backend~ this also assumes that you have all of the necessary .json files to serve, which can be fetched from [here](https://api.yuru.ca/sets), [here](https://api.yuru.ca/gds?person=lilac), and [here](https://api.yuru.ca/gds?person=sydney). it also expects a `.env` with a [last.fm](https://www.last.fm/api/account/create) key, but basic functionality is still maintained without having a `.env` file in the server folder.
