let currentUrl = '';

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url.startsWith("https://www.wildberries") && currentUrl !== tab.url) {
    currentUrl = tab.url
    chrome.scripting.executeScript({
      target: {tabId, allFrames: true},
      files: ['app.js'],
  });
  }
});