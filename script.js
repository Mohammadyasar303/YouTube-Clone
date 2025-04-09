// class work

import { YOUR_API_KEY, YOUR_API_SEARCH, FILTER_API_KEY } from "./API_CONSTANTS.js";


const videoContainer = document.querySelector(".content");
const video_https = "https://www.googleapis.com/youtube/v3/videos?";
const search_http = "https://www.googleapis.com/youtube/v3/search?";
let channel_https = "https://www.googleapis.com/youtube/v3/channels?";

const numberOfVideosInInitialLoad = 10;
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
    .then((data) =>{
        console.log(data)
        data.items.forEach((item) => {
            getChannelIcon(item);
        })
    })
    .catch((err) => console.log(err));

const getChannelIcon = (video_data)=>{
    fetch(channel_https + new URLSearchParams({
        key : YOUR_API_KEY,
        part : "snippet",
        id : video_data.snippet.channelId,
    })).then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            video_data.channelThumbnail = data.items[0].snippet.thumbnails.default.url;
            makeVideoCard(video_data)
        })
        .catch((err)=>console.log(err));
} 

const makeVideoCard = (data) =>{
    const videoCard = document.createElement("div");
    videoCard.classList.add("video");
    videoCard.addEventListener("click",()=>{
        window.location.href=`video.html?id=${data.id}`;
    })
    videoCard.innerHTML = `
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
        
        <div class="content1">
            <img src="${data.channelThumbnail}" class="channel-icon" alt="">
            <div class="thumbnail-text">
                <h4 class="title">${data.snippet.title}</h4>
                <p class="channel-name">${data.snippet.channelTitle}</p>
            </div>
        </div>
    `
    videoContainer.appendChild(videoCard);
} 

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    const query = searchInput.value.trim(); // Get the search query
    if (!query) {
        alert("Please enter a search term!");
        return;
    }

    // Fetch videos based on the search query
    fetch(search_http + new URLSearchParams({
        key: YOUR_API_SEARCH,
        part: "snippet",
        q: query, // Search query
        type: "video",
        maxResults: 7, // Number of results to fetch
    }))
    .then((res) => res.json())
    .then((data) => {
        console.log("Search Results:", data);
        displaySearchResults(data.items); // Display the search results
    })
    .catch((err) => console.error("Error fetching search results:", err));
});

// Function to Display Search Results
const displaySearchResults = (videos) => {
    videoContainer.innerHTML = ""; // Clear previous content

    if (!videos || videos.length === 0) {
        videoContainer.innerHTML = "<p>No videos found for your search.</p>";
        return;
    }

    videos.forEach((video) => {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video");
        videoCard.addEventListener("click", () => {
            window.location.href = `video.html?id=${video.id.videoId}`;
        });

        videoCard.innerHTML = `
            <img src="${video.snippet.thumbnails.high.url}" class="thumbnail" alt="${video.snippet.title}">
            <div class="content1">
                <img src="https://via.placeholder.com/50" class="channel-icon" alt="Channel Icon">
                <div class="thumbnail-text">
                    <h4 class="title">${video.snippet.title}</h4>
                    <p class="channel-name">${video.snippet.channelTitle}</p>
                </div>
            </div>
        `;
        videoContainer.appendChild(videoCard);
    });
};

// Select all filter buttons
const filterButtons = document.querySelectorAll(".filter-options");

// Add event listeners to each filter button
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // Remove the 'active' class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        // Add the 'active' class to the clicked button
        button.classList.add("active");

        // Get the filter text (e.g., "CSS", "JavaScript")
        const filter = button.textContent.trim();

        // Fetch videos based on the filter
        fetch(search_http + new URLSearchParams({
            key: FILTER_API_KEY,
            part: "snippet",
            q: filter, // Use the filter text as the search query
            type: "video",
            maxResults: 3, // Number of results to fetch
        }))
        .then((res) => res.json())
        .then((data) => {
            console.log(`Videos for filter: ${filter}`, data);
            displayFilterResults(data.items); // Display the fetched videos
        })
        .catch((err) => console.error(`Error fetching videos for filter: ${filter}`, err));
    });
});

// Function to Display Filter Results
const displayFilterResults = (videos) => {
    videoContainer.innerHTML = ""; // Clear previous content

    if (!videos || videos.length === 0) {
        videoContainer.innerHTML = "<p>No videos found for this filter.</p>";
        return;
    }

    videos.forEach((video) => {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video");
        videoCard.addEventListener("click", () => {
            window.location.href = `video.html?id=${video.id.videoId}`;
        });

        videoCard.innerHTML = `
            <img src="${video.snippet.thumbnails.high.url}" class="thumbnail" alt="${video.snippet.title}">
            <div class="content1">
                <img src="https://via.placeholder.com/50" class="channel-icon" alt="Channel Icon">
                <div class="thumbnail-text">
                    <h4 class="title">${video.snippet.title}</h4>
                    <p class="channel-name">${video.snippet.channelTitle}</p>
                </div>
            </div>
        `;
        videoContainer.appendChild(videoCard);
    });
};