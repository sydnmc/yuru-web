<svelte:head>
  <meta property="og:title" content="gds">
  <meta property="og:description" content="list of gds by sydnmc">
  <title>sydnmc | gds</title>
</svelte:head>

<script lang="ts">
    import { GuestDifficulties } from "@repo/yuru-assets";
    import LegacyHeader from "$lib/LegacyHeader.svelte";
    import "@repo/yuru-static/assets/base.css";
</script>

<LegacyHeader page="gds"/>
<GuestDifficulties person="syd"/>
