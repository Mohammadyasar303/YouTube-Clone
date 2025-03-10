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

fetch(video_https + generateQueryParam)
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));