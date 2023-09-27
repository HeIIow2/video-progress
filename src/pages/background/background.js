window.browser = window.browser || window.chrome;
const storage = chrome.storage.local;


async function loadTime(request, sendResponse) {
  const response = {
    success: false
  };

  const source = parseUrl(request.src);
  if (!source) {
    response.success = false;
    sendResponse(response);
  }

  chrome.storage.local.get([source], function(r) {
    if (r[source]) {
      response.success = true;
      response.time = r[source];
    }

    sendResponse(response);
  });


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

  console.log(request.currentTime )
  console.log(request)
  const tempObj = {};
  tempObj[source] = request.currentTime
  chrome.storage.local.set(tempObj);

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


async function getStoredValue(key) {
  const res = await new Promise((resolve, reject) => {
      storage.get([key], (result) => {
        console.log(result)
        console.log(result[key])
        resolve(result[key]);
      });
  });
  console.log("in await", res)
  return res;
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);

  const response = {
    success: false
  };

  const source = parseUrl(message.src);
  if (!source) {
    console.log(response);
    sendResponse(response);
    return;
  }

  if (message.action === "save") {
    sendResponse(saveTime(message))
  }
  else if (message.action === "load") {
    try {
      console.log(sendResponse);
      // sendResponse(response)
      
      response.time = getStoredValue(source);
      console.log(response)
      response.success = true;
    } catch (error) {
      response.success = false;
    }
    sendResponse(response)
  }
});


chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});
