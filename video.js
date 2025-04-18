import { YOUR_API_KEY} from "./API_CONSTANTS.js";

const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("id");
console.log("Current Video ID:", videoId);

const videoPlayerContainer = document.querySelector("#video-player");
const video_http = "https://www.googleapis.com/youtube/v3/videos?";
const channel_https = "https://www.googleapis.com/youtube/v3/channels?";
const related_videos_http = "https://www.googleapis.com/youtube/v3/search?";

if (videoId) {
    fetch(video_http + new URLSearchParams({
        key: YOUR_API_KEY,
        part: "snippet,statistics",
        id: videoId,
    }))
    .then((res) => res.json())
    .then((data) => {
        console.log("Video Data:", data);
        if (!data.items || data.items.length === 0) {
            console.error("Video data not found");
            return;
        }

        const videoTitle = data.items[0].snippet.title; // Get video title
        const channelId = data.items[0].snippet.channelId;
        const likeCount = data.items[0].statistics.likeCount;
        const dislikeCount = data.items[0].statistics.dislikeCount;

        fetch(channel_https + new URLSearchParams({
            key: YOUR_API_KEY,
            part: "snippet, statistics",
            id: channelId,
        }))
        .then((res) => res.json())
        .then((channelData) => {
            if (!channelData.items || channelData.items.length === 0) {
                console.error("Channel data not found");
                return;
            }

            const channelThumbnail = channelData.items[0].snippet.thumbnails.default.url;
            // const subscriberCount = channelData.items[0].statistics.subscriberCount;
            videoPlayerContainer.innerHTML = `
                <div class="video-div">
                    <div class="videoPage-video-container">
                        <iframe class="videoPage-video" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
                        <h1 class="videoPage-title">${data.items[0].snippet.title}</h1>
                    </div>                    

                    <div class="videoPage-channel">
                        <div class="videoPage-channel-container">
                            <div class="videoPage-channel-icon-container">
                                <img src="${channelThumbnail}" class="videoPage-channel-icon" alt="">
                                <div>
                                    <p class="videoPage-channel-text">${data.items[0].snippet.channelTitle}</p>
                                    <p class="videoPage-channel-subs-text">${channelData.items[0].statistics.subscriberCount} Subscribers</p>
                                </div>
                                <button class="videoPage-channel-subs-btn">Subscribe</button>                                
                            </div>

                            <div class="videoPage-likes-dislikes">
                                <button id="like-button"><i class="fa-solid fa-thumbs-up"></i> ${likeCount}</button>
                                <button id="dislike-button"><i class="fa-solid fa-thumbs-down"></i> ${dislikeCount}</button>
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

            document.getElementById("like-button").addEventListener("click", () => console.log("Liked!"));
            document.getElementById("dislike-button").addEventListener("click", () => console.log("Disliked!"));

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

            // Fetch Related Videos
            fetch(related_videos_http + new URLSearchParams({
                key: YOUR_API_KEY,
                part: "snippet",
                relatedToVideoId: videoId,
                type: "video",
                maxResults: 10
            }))
            .then((res) => res.json())
            .then((relatedVideosData) => {
                console.log("Related Videos Response:", relatedVideosData);

                setTimeout(() => {
                    const relatedVideosContainer = document.getElementById("related-videos");
                    relatedVideosContainer.innerHTML = ""; // Clear previous content

                    if (!relatedVideosData.items || relatedVideosData.items.length === 0) {
                        console.warn("No related videos found! Switching to search by title.");
                        fetch(related_videos_http + new URLSearchParams({
                            key: YOUR_API_KEY,
                            part: "snippet",
                            q: videoTitle, // Search using video title instead
                            type: "video",
                            maxResults: 10
                        }))
                        .then((res) => res.json())
                        .then((searchData) => {
                            console.log("Search Data Response:", searchData);

                            if (!searchData.items || searchData.items.length === 0) {
                                relatedVideosContainer.innerHTML = "<p>No related videos found.</p>";
                                return;
                            }

                            searchData.items.forEach((item) => {
                                const video = item.snippet;
                                const videoElement = document.createElement("div");
                                videoElement.classList.add("related-video");
                                videoElement.innerHTML = `
                                    <a href="video.html?id=${item.id.videoId}">
                                        <img src="${video.thumbnails.default.url}" alt="${video.title}">
                                        <p>${video.title}</p>
                                    </a>
                                `;
                                relatedVideosContainer.appendChild(videoElement);
                            });
                        })
                        .catch((err) => console.error("Error fetching videos by title:", err));

                        return;
                    }
                }, 100);
            })
            .catch((err) => console.error("Error fetching related videos:", err));
        })
        .catch((err) => console.error("Error fetching channel data:", err));
    })
    .catch((err) => console.error("Error fetching video data:", err));
}