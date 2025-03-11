import YOUR_API_KEY from "./API_CONSTANTS.js";

// console.log(window.location.href);
// http://127.0.0.1:5501/video.html

const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("id");
console.log(videoId);

const videoPlayerContainer = document.querySelector("#video-player");
const video_http = "https://www.googleapis.com/youtube/v3/videos?";

if(videoId){
    fetch(video_http + new URLSearchParams({
        key : YOUR_API_KEY,
        part : "snippet",
        id : videoId,
    })).then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            videoPlayerContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}"></iframe>`
        })
        .catch((err)=>console.log(err));
}