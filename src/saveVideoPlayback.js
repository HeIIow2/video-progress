function setCookie(key, value) {
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7); // Add 7 days
  
    let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    cookieString += `; expires=${oneWeekFromNow.toUTCString()}`;
    cookieString += '; path=/'; // Set the path to '/' for a global cookie
  
    document.cookie = cookieString;
}

function getCookie(key) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (decodeURIComponent(cookieName) === key) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null; // Return null if the cookie is not found
}


function parseUrl(url) {
    const parsed = new URL(url);
    return parsed.host + "/" + parsed.pathname + "/?" + parsed.search
}


function loadTime(videoElement) {
    const currentTime = getCookie(parseUrl(videoElement.src));
    if (currentTime === null) return;

    console.log(`Found the time ${currentTime} for the video "${videoElement.src}".`)
    videoElement.currentTime = parseFloat(currentTime);
}


function setTime(event) {
    const videoElement = event.currentTarget;
    setCookie(key = parseUrl(videoElement.src), value = videoElement.currentTime.toString());
}


document.querySelectorAll("video, audio").forEach(videoElement => {
    loadTime(videoElement);
    videoElement.addEventListener("timeupdate", setTime);
});
