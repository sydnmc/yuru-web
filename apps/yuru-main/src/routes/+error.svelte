<svelte:head>
    <title>yurukyan | {page.status}</title>
</svelte:head>

<script>
  import { page } from '$app/state';
  import Error from '@yuru-web/yuru-assets';
</script>

<Error page={page} />