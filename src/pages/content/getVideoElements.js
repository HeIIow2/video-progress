console.log("hippies");

const audioPlay = HTMLAudioElement.prototype.play
HTMLAudioElement.prototype.audioPlay = audioPlay;
HTMLAudioElement.prototype.play = function() {
    sendElement("load", this);
    this.audioPlay();
}

const videoPlay = HTMLVideoElement.prototype.play;
HTMLVideoElement.prototype.videoPlay = videoPlay;
HTMLVideoElement.prototype.play = function() {
    sendElement("load", this);
    this.videoPlay();
}

function sendElement(action, mediaElement) {
    chrome.runtime.sendMessage({
        "action": action,
        "src": mediaElement.src,
        "currentTime": mediaElement.currentTime,
        "duration": mediaElement.duration,
        "ended": mediaElement.ended,
    }, 
    (response) => {
        console.log(response)
        if (!response) return;
        if (!response.success) return;

        if (action === "load") {
            console.log(response)
            mediaElement.currentTime = response.time;
        }
    });
}


document.querySelectorAll("video, audio").forEach(mediaElement => {
    sendElement("load", mediaElement);
    
    mediaElement.onplay = function(event) {
        event.preventDefault()
        mediaElement.play();
    }

    mediaElement.addEventListener("play", event => {
        event.preventDefault();
        mediaElement.play();
    })

    mediaElement.addEventListener("timeupdate", function(event) {
        if (mediaElement.paused) return;
        sendElement("save", event.currentTarget);
    });
});

