const initialized_urls = {}

window.browser = window.browser || window.chrome;


function loadTime(request) {
  const response = {
    success: false
  };

  const source = parseUrl(request.src);
  if (!source) {
    response.success = false;
    return response;
  }


  browser.storage.sync.get([source], (result) => {
    console.log(result)
    if (result[source]) {
      response.success = true;
      response.time = result[source];
    } else {
      response.success = false;
    }
  })

  return response;
}

function saveTime(request) {
  const response = {
    success: true
  };

  const source = parseUrl(request.src);
  if (!source) {
    response.success = false;
    return response;
  }

  browser.storage.sync.set({
    source: response.currentTime 
  });

  return response;
}


function trim(s, c) {
  if (c === "]") c = "\\]";
  if (c === "^") c = "\\^";
  if (c === "\\") c = "\\\\";
  return s.replace(new RegExp(
    "^[" + c + "]+|[" + c + "]+$", "g"
  ), "");
}


function parseUrl(url) {
  let parsed = undefined;
  
  try {
      parsed = new URL(url);
  } catch (error) {
      console.log(url);
      console.log(error);
      return url;
  }

  parsed.hostname = trim(parsed.hostname, "/");
  parsed.pathname = trim(parsed.pathname, "/");
  parsed.search = trim(parsed.search, "/");

  return parsed.toString();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message)

  if (message.action === "save") {
    sendResponse(saveTime(message))
  }
  else if (message.action === "load") {
    sendResponse(loadTime(message));
  }
});
