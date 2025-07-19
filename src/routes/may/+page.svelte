<svelte:head>
    <meta property="og:site_name" content="yurukyan△">
    <meta property="og:title" content="anemone_△">
    <meta property="og:description" content="may's homepage >.<">
    <meta name="theme-color" content="#dee0ed">
    <title>anemone_△</title>
</svelte:head>

<script lang="ts">
    import Header from "$lib/Header.svelte";
</script>

<Header person="may" page="home"/>
<div>
    
</div>
<h1>hi! o/</h1>
<p style="margin-bottom: 5px;">similar to lilac, i'm pretty new here. most of what i've done so far is working on the <strong>sitewide redesign</strong> here + helping maintain some of our other projects.</p>
<p style="margin-top: 0">i suppose i'm basically replacing the role sydney had, but i like to maintain a low profile c: <strong>doesn't mean you're discouraged from coming and saying hi to me tho!</strong></p>
<img id="nene" src="/may/cute ass nene.png" alt="nene chibi">

<style>
h1 {
    text-align: center;
    font-size: 28px;
}

p {
    font-size: 18px;
    text-align: center;
}

#nene {
    position: absolute;
    bottom: 15px;
    right: 15px;
    animation: scroll-loop 2s linear infinite;
    animation-timing-function: cubic-bezier(.1,0,.0,1)
}

@keyframes scroll-loop {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-80px); }
}

</style>