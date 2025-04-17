export default {
	async fetch(request, env) {
		var fetchPage = new URL(request.url).pathname;
		var res = await env.ASSETS.fetch(request); //checks if the current page that we're on actually exists or not
		var pageContent;
		
		if (res.status == 404) {
			fetchPage = "404";
		}

		switch (fetchPage) {
			case "/gds":
				//each script will see what site we're on, so we don't need to pass through anything extra to it :O
				pageContent = await fetch(`https://api.yuru.ca/gds.html`); 
				break;
			case "/404translate":
				pageContent = await fetch(`https://api.yuru.ca/404translate.html`);
				break;
			case "404":
				pageContent = await fetch(`https://api.yuru.ca/404.html`);
				break;
		}
		//passing through what we fetched, including the headers + status just in case anything went wrong, and so we can cache it too
		return new Response(pageContent.body, {
			status: pageContent.status,
			headers: {
				"Content-Type": "text/html",
				"Cache-Control": "public, max-age=300" //caches the page we fetched for 5 min
			}
		});
	}
}