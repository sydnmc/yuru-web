<svelte:head>
    <title>yurukyan△ | {page.status}</title>
</svelte:head>

<script>
  import "@repo/yuru-static/assets/base.css";
  import { page } from '$app/state';
  import { Error } from '@repo/yuru-assets';
</script>

<Error page={page} />
