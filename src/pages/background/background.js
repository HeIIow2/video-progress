window.browser = window.browser || window.chrome;
const crossStorage = browser.storage ||  chrome.storage;
const storageMethod = crossStorage.sync;


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
  storageMethod.set(tempObj);

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


function getStorageValuePromise(key) {
  return new Promise((resolve) => {
    storageMethod.get(key, resolve);
  });
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);

  const response = {
    success: false
  };

  // error
  const source = parseUrl(message.src);
  if (!source) {
    console.log(response);
    sendResponse(response);
    return false;
  }

  // saving synchronously
  if (message.action === "save") {
    sendResponse(saveTime(message));
    return false;
  }

  // loading asynchronously
  if (message.action === "load") {
    (async () => {
      const res = await getStorageValuePromise(source);
      if (source in res) {
        response.time = res[source];
        response.success = true;
      }

      sendResponse(response);
    })();

    return true;
  }
  
  console.error("action is not known", message);
  return false;
});


crossStorage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `storageMethod key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});
