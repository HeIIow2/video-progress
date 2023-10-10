console.log("monkeypatching audio and video play");
const debug = false;

const audioPlay = HTMLAudioElement.prototype.play
HTMLAudioElement.prototype.actualPlay = audioPlay;
HTMLAudioElement.prototype.play = function(noEvent=false) {
    if (noEvent) {
        sendElement("load", this);
        this.dispatchEvent(new Event("play"));
    }

    this.actualPlay();
}

const videoPlay = HTMLVideoElement.prototype.play;
HTMLVideoElement.prototype.actualPlay = videoPlay;
HTMLVideoElement.prototype.play = function(noEvent=false) {
    if (noEvent) {
        sendElement("load", this);
        this.dispatchEvent(new Event("play"));
    }

    this.actualPlay();
}


function sendElement(action, mediaElement) { 
    let src = mediaElement.src;
    if (src == "") {
        var source = mediaElement.querySelector("source");
        if (source) src = source.src;
    }
    
    if (!src) return;
    console.log(src)

    const message = {
        "action": action,
        "src": src,
        "currentTime": mediaElement.currentTime,
        "duration": mediaElement.duration,
        "ended": mediaElement.ended,
    };

    chrome.runtime.sendMessage(message, (response) => {
        if (debug) console.log(response);
        
        if (!response) return;
        if (!response.success) return;
    
        if (action === "load") {
            console.log(response)
            mediaElement.currentTime = response.time;
        }
    });
}


document.querySelectorAll("video, audio").forEach(mediaElement => {
    let alreadyLoaded = false;
    sendElement("load", mediaElement);
    
    mediaElement.onplay = function(event) {
        event.preventDefault()
        mediaElement.play();
    }
    
    mediaElement.addEventListener("play", (event) => {
        if (alreadyLoaded) return;

        alreadyLoaded = true;
        sendElement("load", mediaElement);
    })

    mediaElement.addEventListener("timeupdate", function(event) {
        if (mediaElement.paused) return;
        if (!alreadyLoaded) return;
        sendElement("save", event.currentTarget);
    });
});

