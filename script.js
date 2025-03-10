const API_KEY = "AIzaSyCzVBqC8rR6rvAu9UuV2FnoDIH4ziMoVN8";
const videoContainer = document.querySelector(".content");

function fetchVideos() {
    const xhr = new XMLHttpRequest();
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=US&maxResults=12&key=${API_KEY}`;
    
    xhr.open("GET", url, true);
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            displayVideos(response.items);
        }
    };

    xhr.send();
}

function displayVideos(videos) {
    videoContainer.innerHTML = ""; // Clear previous content

    videos.forEach(video => {
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");
        
        videoCard.innerHTML = `
            <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
            <h3>${video.snippet.title}</h3>
            <p>${video.snippet.channelTitle}</p>
        `;

        videoContainer.appendChild(videoCard);
    });
}

// Call the function when the page loads
fetchVideos();
