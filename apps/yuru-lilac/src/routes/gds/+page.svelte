<svelte:head>
    <meta property="og:title" content="gds">
    <meta property="og:description" content="list of gds by yuiyamu">
    <title>yuiyamu | gds</title>
</svelte:head>

<script lang="ts">
    import { GuestDifficulties } from "@repo/yuru-assets";
    import { Header } from "@repo/yuru-assets";
    import "@repo/yuru-static/assets/base.css";
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
    background-image: url('/bg.jpg');
    background-size: cover;
    background-position: center;
    filter: blur(15px) brightness(0.5);
    z-index: -1;
}
</style>
