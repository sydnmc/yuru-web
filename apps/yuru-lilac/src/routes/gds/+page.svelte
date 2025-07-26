<svelte:head>
  <meta property="og:site_name" content="yurukyan△">
  <meta property="og:title" content="yuiyamu | gds">
  <meta property="og:description" content="a list of gds by yuiyamu">
  <meta name="theme-color" content="#dee0ed">
  <title>yuiyamu | gds</title>
</svelte:head>

<script lang="ts">
    import GuestDifficulties from "@yuru-web/yuru-assets";
    import Header from "@yuru-web/yuru-assets";
</script>

<Header person="lilac" page="gds"/>
<div id="background"></div>
<GuestDifficulties person="lilac"/>

<style>
#background {
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-image: url('/lilac/bg.jpg');
    background-size: cover;
    background-position: center;
    filter: blur(15px) brightness(0.5);
    z-index: -1;
}
</style>
