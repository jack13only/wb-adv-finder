let currentUrl = '';

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url.startsWith("https://www.wildberries.ru/catalog/0/search.aspx?search=") && currentUrl !== tab.url) {
    currentUrl = tab.url
    chrome.scripting.executeScript({
      target: {tabId, allFrames: true},
      files: ['app.js'],
  });
  }
});