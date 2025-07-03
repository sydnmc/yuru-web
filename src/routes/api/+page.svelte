<svelte:head>
    <meta property="og:site_name" content="api△">
    <meta property="og:title" content="api">
    <meta property="og:description" content="api used for yuru.ca">
    <meta name="theme-color" content="#FCE758">
    <title>api△</title>
</svelte:head>


  <header>
    <a class="fa fa-github hidden-link" style="position: relative; top: 1.5px; color: white; font-size: 20px;" href="https://github.com/sydnmc/yuru-web"></a>
    <!-- this sucks but i'm manually bringing it down a bit :3 -->
    <a class="hidden-link" href="index-ja_jp.html">&#127760;</a>
  </header>
    <section id="page">
      <h1 style="display: inline-block"><a id="title" href="https://yuru.ca">yurukyan△</a></h1><h2 id="api-text">api</h2>
      <div class="section-divide"></div>
      <h1>endpoints</h1>
      <div>
        <p><code>/gds</code> - returns the osu! guest difficulties list for lilac or sydney, requires <code>person=STRING</code> option</p>
        <p><code>/sets</code> - returns the list of osu! beatmapsets that both of us have done</p>
        <p><code>/songInfo</code> - using last.fm, returns the song last listened to, or the song we're currently listening to</p>
        <p><code>/pkInfo</code> - using pluralkit, <code>frontList=true</code> returns the last fronts for the number of days specified by <code>before=INT</code>, as well as a percentage that each person has fronted in that timeframe. without the <code>frontList</code> option, it requires a <code>user=STRING</code> option to fetch a user by their pluralkit id</p>
      </div>
      <div class="section-divide"></div>
      <div id="footer">
        <span>made by</span>
        <img src="https://api.yuru.ca/favicon.ico" alt="yurukyan">
        <span><a href="https://yuru.ca">yurukyan</a> with <i class="fa fa-heart"></i></span>
      </div>
    </section>

    <style>
      /* local variables */
:root {
    --tent: #FCE758;
}

/* header icons */
header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: end;
    align-items: center;
    height: 5vh;
    margin-bottom: 0px;
}

header a {
    padding-right: 8px; /* gives spacing to the icons */
}

/* page section */
#page {
    margin-left: 24%;
    margin-right: 24%;
}

#title {
    font-family: Kyokasho, sans-serif;
    color: var(--tent);
    font-size: 58px;
    text-decoration: none;
    font-weight: normal;
}

#api-text {
    margin-left: 10px;
    display: inline-block;
}

.section-divide {
    width: 100%;
    height: 3px;
    background-color: rgb(60, 60, 60);
}

#footer {
    margin-top: 10px;
    width: 100%;
    text-align: center;
} #footer img {
    width: 2%;
    vertical-align: middle;
} #footer a {
    text-decoration: none;
    color: var(--tent);
}


/* mobile */
@media only screen and (max-device-width: 1000px)
{
    #page {
        margin-left: 0%;
        margin-right: 0%;
    }
}

    </style>
