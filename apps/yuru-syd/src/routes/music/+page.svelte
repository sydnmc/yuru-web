<svelte:head>
  <meta property="og:site_name" content="yurukyan△">
  <meta property="og:title" content="anemone | music">
  <meta property="og:description" content="all of the music that i've made">
  <meta name="theme-color" content="#5a4969">
  <title>sydnmc | music</title>
</svelte:head>

<script lang="ts">
    import LegacyHeader from "$lib/LegacyHeader.svelte";


</script>

<LegacyHeader page="music"/>
      <h2 class="centered">hi! o/</h2>
      <p class="centered">producing is something that my brain has always wanted me to do, but honestly hasn't materialized in too much so far</p>
      <p class="centered">i started taking a bit seriously when i made my first music projects in 2021, taking a music technology class in high school. i'd continue with this class for a number of years, but the only thing i feel proud enough with to share publicly today is <a>shiranaieki</a>.
    before that, i had made ねむいどれみー (nemui doremy) over winter break in 2022 in 2 days, and also covered シュタロフテノラッセ (Shutarofutenorasse) by Shibayan on a whim during my first semester of university. so far, that's all i'm comfortable sharing with the world~ but i have plans to add a lot more to this... sometime soon :p</p>
    <div id="music-container">
      <div class="song-element song-padding" style="background-image: linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.7) 100%), url(/sydney/doremy.jpg);">
        <h2 class="song-name translate-title"><a class="song-link" href="https://soundcloud.com/sydnmc/nemuidoremy">nemui doremy</a></h2>
        <p class="translated-text">ねむいどれみー</p>
        <p>♪ BPM = 124</p>
        <p>released <strong>Dec 12nd, 2022</strong></p>
        <p>first time seriously using ableton (as i had used logic pro in class for many things before), wanted to do something touhou because i was listening to a ton of shibayan at the time (things don't ever quite change hehe) and i think it turned out pretty well! would like to make an extended cut someday, and release this on spotify when i can get actual image art for it, but for now you can check it out on youtube :3</p>
        <div class="links-container">
          <a href="https://youtu.be/vr9PRioBeG0" class="clickable-image-text"><img alt="youtube" src="/common/youtube.png" class="socials-image"></a>
          <a class="image-link" href="https://youtu.be/vr9PRioBeG0">listen on youtube</a>
        </div>
      </div>
      <div class="song-element song-padding" style="background-image: linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.7) 100%), url(/sydney/shiranaieki.jpg);">
        <h2 class="song-name"><a class="song-link" href="https://soundcloud.com/sydnmc/shiranaieki">shiranaieki</a></h2>
        <p>♪ BPM = 135</p>
        <p>released <strong>Feb 16th, 2023</strong></p>
        <p>only thing here that i actually finished for class and feel good enough releasing to the public ^_^ made this in a mix of logic and ableton - most of the chords and stuff i did in class with logic and other effects + beat were done with logic. pretty happy with how this turned out, so c:</p>
        <div class="links-container">
          <a href="https://open.spotify.com/track/76c9EA38of8JP8uj3IpAsw?si=8d652ddc2da0414b" class="clickable-image-text"><img alt="spotify" src="/common/spotify.png" class="socials-image"></a>
          <a class="image-link" href="https://open.spotify.com/track/76c9EA38of8JP8uj3IpAsw?si=8d652ddc2da0414b" style="margin-right: 5px;">listen on spotify</a>
          <span style="font-size: 14px; color: rgb(100, 101, 112)">(only thing i have on spotify so far)</span>
        </div>
      </div>
      <div class="song-element" style="background-image: linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.7) 100%), url(/sydney/sugar\ particle.jpg);">
        <h2 class="song-name translate-title"><a class="song-link" href="https://soundcloud.com/sydnmc/shutarofutenorasse_kaai_yuki_cover">Shutarofutenorasse (Kaai Yuki Cover)</a></h2>
        <p class="translated-text">シュタロフテノラッセ（歌愛ユキ カバー）</p>
        <p>♪ BPM = 90</p>
        <p>released <strong>Sept 10th, 2024</strong></p>
        <p>this actually came about because i had been listening to しゅがー ぱーてぃくる (sugar particle) a lot and really loved a lot of the songs on there (this one included) but i wasn't as much of a fan of the tuning... i had messed around a bit with vocaloid for other class projects i had done before, so i knew the basics before hopping in, but this really kinda was a 5 day (give or take) project to teach myself how to use vocaloid, which is pretty cool!!</p>
        <div class="links-container">
          <a href="https://osu.ppy.sh/beatmapsets/2252115" class="clickable-image-text" style="height: 18px;"><img alt="osu!" src="/common/osu.png" class="socials-image"></a>
          <a class="image-link" href="https://osu.ppy.sh/beatmapsets/2252115">check out my osu map for this song!</a>
        </div>
      </div>
    </div>

<style>
.centered {
    text-align: center;
}

#music-container {
    display: flex;
}

.song-element {
    border-radius: 15px;
    border: 3px solid #5a4969;
    height: 55vh;
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
    background-size: cover;
    background-position: 100%;
}

.song-padding {
    margin-right: 30px;
}

.song-link {
    text-decoration: none;
    color: white;
}

h2 {
    color: white;
}

.clickable-image-text {
    width: 20px;
    height: 20px;
    padding-right: 10px;
}

.translated-text {
    margin-top: 0;
}

.translate-title {
    margin-bottom: 0;
}

.links-container {
    display: flex;
    align-items: center;
}

.socials-image {
    height: 20px;
    margin: 0;
}

.image-link {
  color: white;
  text-decoration: none;
}

/* mobile */
@media only screen and (max-device-width: 768px)
{  
    #music-container {
        flex-direction: column;
    }

    .song-element {
        width: calc(100% - 30px);
        margin-bottom: 15px;
    }
}
</style>
