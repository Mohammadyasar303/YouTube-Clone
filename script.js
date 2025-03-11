// class work

import YOUR_API_KEY from "./API_CONSTANTS.js";

const videoContainer = document.querySelector(".content");
const video_https = "https://www.googleapis.com/youtube/v3/videos?";

const numberOfVideosInInitialLoad = 20;
const generateQueryParam = new URLSearchParams({
    key : YOUR_API_KEY,
    part : "snippet, contentDetails",
    chart : "mostPopular",
    maxResults : numberOfVideosInInitialLoad,
    regionCode : "IN",
})

// console.log(video_https + generateQueryParam);

// video element
function createVideoElement(video){
    const videoElement = document.createElement("div");
    videoElement.classList("video");

    const videoThumbnail = document.createElement("img");
    videoThumbnail.src = video.snippet.thumbnails.medium.url;

    const videoTitle = document.createElement("h2");
    videoTitle.textContent = video.snippet.title;

    const channelTitle = document.createElement("p");
    channelTitle.textContent = video.snippet.channelTitle;

    videoElement.appendChild(videoThumbnail);
    videoElement.appendChild(videoTitle);
    videoElement.appendChild(channelTitle);

    return videoElement;
}

function displayVideos(videos){
    videos.forEach((video) => {
        const videoElement = createVideoElement(video);
        videoContainer.appendChild(videoElement);
    });
}


fetch(video_https + generateQueryParam)
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        displayVideos(data.items);
    })
    .catch((err) => console.log(err));

