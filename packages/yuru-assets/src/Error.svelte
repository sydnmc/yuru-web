<script lang="ts">
    export let page;
</script>

<div id="page">
    <a id="header" href="https://yuru.ca/">
        <img alt="system pfp" src="/systempfp.jpg">
        <h1>{page.status}△</h1>
        <h2>{page.error?.message.toLowerCase()}</h2>
    </a>
    <strong>- english -</strong>
    <p>
        {#if page.status === 404}
            sorry, the page you're looking for does not exist.
        {:else if page.status === 500}
            sorry, the server ran into an internal error.
        {:else}
            sorry, an unknown error occured.
        {/if}
        <br>
        <a href="https://yuru.ca">click here</a> to go back to the site homepage.
    </p>
    <div style="display: flex; justify-content: center;">
        <div id="divider"></div>
    </div>
    <strong>- 日本語 -</strong>
    <p>
        {#if page.status === 404}
            ごめんなさいが、探してるのページは存在ではありません。
        {:else if page.status === 500}
            ごめんなさいが、サーバーで内部エラーが発生しました。
        {:else}
            ごめんなさいが、不明なエラーが発生しました。
        {/if}
        <br>
        ホームページに戻るには、<a href="https://yuru.ca">ここ</a>をクリックしてください。
    </p>
    <div style="display: flex; justify-content: center;">
        <div id="divider"></div>
    </div>
    <strong>- עברית -</strong>
    <p dir="rtl">
        {#if page.status === 404}
            אנחנו מצתערות, העמוד שחיפשת לא קיים.
        {:else if page.status === 500}
            אנחנו מצתערות, השרת נתקל בשגיאה פנימית.
        {:else}
            קרתה שגיאה לא ידועה.
        {/if}
        <br>
        <a href="https://yuru.ca">לחצו כאן</a> כדי לחצור בחזרה לדף הראשי.
    </p> <!-- ~<3 - anne -->
</div>

<style>
#page {
    position: relative;
    padding: 30px 30px;
    text-align: center;
    background-color: var(--sydney-main);
    border-radius: 10px;
    margin-left: 20%;
    margin-right: 20%;
    margin-top: 35px;
}

#header {
    display: flex;
    text-align: left;
    align-items: center;
    text-decoration: none;
}


img {
    border-radius: 50%;
    width: 100px;
}

h1 {
    display: inline;
    font-family: Kyokasho, sans-serif;
    font-weight: normal;
    color: var(--offwhite);
    font-size: 70px;
    margin-left: 10px;
    margin-top: 0;
    margin-bottom: 0;
}

h2 {
    font-size: 30px;
    margin-left: 10px;
}

strong {
    color: var(--offwhite);
} p {
    color: var(--offwhite);
    margin-top: 0;
}

a {
    color: var(--text);
}

#divider {
    height: 3px;
    width: 50%;
    background: linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 15%, rgba(255, 255, 255, 0.4) 85%, rgba(255, 255, 255, 0) 100%);
    margin-top: 15px;
    margin-bottom: 15px;
}
</style>
