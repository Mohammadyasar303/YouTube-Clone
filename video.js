import YOUR_API_KEY from "./API_CONSTANTS.js";

// console.log(window.location.href);
// http://127.0.0.1:5501/video.html

const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("id");
console.log(videoId);

const videoPlayerContainer = document.querySelector("#video-player");
const video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_https = "https://www.googleapis.com/youtube/v3/channels?";

if(videoId){
    fetch(video_http + new URLSearchParams({
        key : YOUR_API_KEY,
        part : "snippet,statistics",
        id : videoId,
    })).then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            const channelId = data.items[0].snippet.channelId;
            const likeCount = data.items[0].statistics.likeCount;
            const dislikeCount = data.items[0].statistics.dislikeCount;

            fetch(channel_https + new URLSearchParams({
                key: YOUR_API_KEY,
                part: "snippet",
                id: channelId,
            })).then((res) => res.json())
              .then((channelData) => {
                const channelThumbnail = channelData.items[0].snippet.thumbnails.default.url;
                videoPlayerContainer.innerHTML = `
                    <div class="video-div">
                        <div class="videoPage-video-container">
                            <iframe class="videoPage-video" src="https://www.youtube.com/embed/${videoId}"></iframe>
                            <h1 class="videoPage-title">${data.items[0].snippet.title}</h1>
                        </div>                    

                        <div class="videoPage-channel">
                            <div class="videoPage-channel-container">
                                <div class="videoPage-channel-icon-container">
                                    <img src="${channelThumbnail}" class="videoPage-channel-icon" alt="">
                                    <p class="videoPage-channel-text">${data.items[0].snippet.channelTitle}</p>
                                </div>

                                <div class="videoPage-likes-dislikes">
                                    <button id="like-button"><i class="fa-solid fa-thumbs-up" style="color: #ffffff; margin-right:2px"></i> ${likeCount}</button>
                                    <button id="dislike-button"><i class="fa-solid fa-thumbs-down" style="color: #ffffff; margin-right:2px"></i> ${dislikeCount}</button>
                                </div>
                            </div>

                            <div class="videoPage-description-text">
                                <p>Description</p>
                                <p id="description">${data.items[0].snippet.description}</p>
                                <button id="see-more-button">See More</button>
                            </div>
                        </div>
                    </div>
                `;

                // Add event listeners for like and dislike buttons
                document.getElementById("like-button").addEventListener("click", () => {
                    console.log("Liked!");
                });

                document.getElementById("dislike-button").addEventListener("click", () => {
                    console.log("Disliked!");
                });

                // Add event listener for see more button
                const seeMoreButton = document.getElementById("see-more-button");
                const description = document.getElementById("description");
                seeMoreButton.addEventListener("click", () => {
                    if (seeMoreButton.innerText === "See More") {
                        description.style.display = "block";
                        seeMoreButton.innerText = "See Less";
                    } else {
                        description.style.display = "-webkit-box";
                        seeMoreButton.innerText = "See More";
                    }
                });
              })
              .catch((err) => console.log(err));
        })
        .catch((err)=>console.log(err));
}