
<svelte:head>
    <title>sydnmc | 404</title>
</svelte:head>

<script lang="ts">
    import { page } from '$app/state';
</script>

<div class="header-wrapper">
    <a href="https://syd.yuru.ca">
        <img id="image" src="https://api.yuru.ca/images/sydneypfp.png" alt="sydney's shima rin pfp">
    </a>
    <h1 id="title">{page.status} | sydnmc</h1>
    <span><strong>- english -</strong></span>
    <br>
    <span>sorry, the page you're looking for does not exist.<br><a href="https://syd.yuru.ca">click here</a> to go back to the site homepage.</span>
    <br><br>
    <span><strong>- 日本語 -</strong></span><br><span>ごめんなさいが、探してるのページは存在ではありません。<br>ホームページに戻るには、<a href="https://syd.yuru.ca">ここ</a>をクリックしてください。</span>
</div>

<style>
.header-wrapper {
    padding: 15px 15px;
    text-align: center;
    background-color: var(--sydney-main);
    border-radius: 10px;
    margin-left: 20%;
    margin-right: 20%;
    margin-top: 35px;
}

#image {
    border-radius: 50%;
    width: 10%;
}

h1 {
    font-family: Kyokasho, sans-serif;
    font-weight: normal;
    color: var(--offwhite);
    font-size: 58px;
    margin-top: 10px;
}

span {
    color: var(--offwhite);
}
</style>