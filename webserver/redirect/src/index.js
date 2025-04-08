/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request) {
	  const url = new URL(request.url);
	  if (url.pathname == "/gds") { //if we're headed to a gds page, we want to proxy it to common~
		const apiContent = await fetch(`https://api.yuru.ca/gds.html`); //the gds script will see what site we're on, so we don't need to pass through anything extra to it :O
  
		//passing through what we fetched, including the headers + status just in case
		return new Response(apiContent.body, {
		  status: apiContent.status,
		  headers: {
			"Content-Type": "text/html",
			"Cache-Control": "public, max-age=300" //caches the page we fetched for 5 min
		  }
		});
	  }
	}
  }