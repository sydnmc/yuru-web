export function createHovers() {
    let users = document.getElementsByClassName("osu-user");
    for (let i = 0; i < users.length; i++) {
        let userID = users[i].dataset.osuid;
        let username = users[i].dataset.osuusername;
        let flag = users[i].dataset.osuflag;
        let hoverText = `
    <a class="osu-hover" id="osu-hover-${i}" href="https://osu.ppy.sh/users/${userID}">
            <img src="https://a.ppy.sh/${userID}" class="hover-pfp"></img>
            <div class="osu-hover-text-container">
                <div class="osu-hover-flagtext-container">
                    <div class="flaguser-container">
                        <img src="https://osu.ppy.sh${flag}" class="osu-flag"></img>
                        <span class="hover-username">${username}</span>
                    </div>
                    <div>
                        <span>click to go to profile!</span>
                    </div>
                </div>
            </div>
    </a>`;

        users[i].insertAdjacentHTML("beforeend", hoverText);
        let hoverContainer = document.getElementById("osu-hover-"+i);
        users[i].addEventListener("mouseover", () => {
            hoverContainer.style.display = "flex";
        });

        users[i].addEventListener("mouseleave", () => {
            hoverContainer.style.display = "none";
        });

        hoverContainer.style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${users[i].dataset.osubanner})`;
        hoverContainer.style.backgroundSize = "cover";
    }
};